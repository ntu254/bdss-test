package com.hicode.backend.service;

import com.hicode.backend.dto.*;
import com.hicode.backend.dto.admin.HealthCheckRequest;
import com.hicode.backend.dto.admin.BloodTestResultRequest;
import com.hicode.backend.dto.admin.CollectionInfoRequest;
import com.hicode.backend.dto.admin.DonationProcessResponse;
import com.hicode.backend.dto.admin.UpdateDonationStatusRequest;
import com.hicode.backend.model.entity.*;
import com.hicode.backend.model.enums.*;
import com.hicode.backend.repository.DonationProcessRepository;
import com.hicode.backend.repository.HealthCheckRepository;
import com.hicode.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DonationService {

    @Autowired
    private DonationProcessRepository donationProcessRepository;
    @Autowired
    private HealthCheckRepository healthCheckRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private AppointmentService appointmentService;
    @Autowired
    private InventoryService inventoryService;
    @Autowired
    private EmailService emailService; // Inject EmailService

    /**
     * User đăng ký một quy trình hiến máu mới.
     */
    @Transactional
    public DonationProcessResponse createDonationRequest() {
        User currentUser = userService.getCurrentUser();
        DonationProcess process = new DonationProcess();
        process.setDonor(currentUser);
        process.setStatus(DonationStatus.PENDING_APPROVAL);
        DonationProcess savedProcess = donationProcessRepository.save(process);
        return mapToResponse(savedProcess);
    }

    /**
     * User xem lịch sử các lần đăng ký hiến máu của mình.
     */
    @Transactional(readOnly = true)
    public List<DonationProcessResponse> getMyDonationHistory() {
        User currentUser = userService.getCurrentUser();
        List<DonationProcess> processes = donationProcessRepository.findByDonorIdWithDetails(currentUser.getId());
        return processes.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    /**
     * Staff/Admin xem tất cả các đơn đăng ký hiến máu.
     */
    @Transactional(readOnly = true)
    public List<DonationProcessResponse> getAllDonationRequests() {
        List<DonationProcess> processes = donationProcessRepository.findAllWithDetails();
        return processes.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    /**
     * Staff/Admin duyệt hoặc từ chối một đơn đăng ký.
     */
    @Transactional
    public DonationProcessResponse updateDonationStatus(Long processId, UpdateDonationStatusRequest request) {
        DonationProcess process = findProcessById(processId);
        if (process.getStatus() != DonationStatus.PENDING_APPROVAL) {
            throw new IllegalStateException("This request is not pending approval.");
        }
        if (request.getNewStatus() == DonationStatus.REJECTED || request.getNewStatus() == DonationStatus.APPOINTMENT_PENDING) {
            process.setStatus(request.getNewStatus());
            process.setNote(request.getNote());
        } else {
            throw new IllegalArgumentException("Invalid status. Only REJECTED or APPOINTMENT_PENDING are allowed from this state.");
        }
        return mapToResponse(donationProcessRepository.save(process));
    }

    /**
     * Staff/Admin ghi nhận kết quả khám sàng lọc.
     */
    @Transactional
    public DonationProcessResponse recordHealthCheck(Long processId, HealthCheckRequest request) {
        DonationProcess process = findProcessById(processId);
        if (process.getStatus() != DonationStatus.APPOINTMENT_SCHEDULED) {
            throw new IllegalStateException("Cannot record health check for a process that is not in a scheduled state.");
        }

        HealthCheck healthCheck = process.getHealthCheck() != null ? process.getHealthCheck() : new HealthCheck();

        BeanUtils.copyProperties(request, healthCheck);
        healthCheck.setDonationProcess(process);
        healthCheckRepository.save(healthCheck);

        process.setHealthCheck(healthCheck); // Đảm bảo mối quan hệ hai chiều
        process.setStatus(request.getIsEligible() ? DonationStatus.HEALTH_CHECK_PASSED : DonationStatus.HEALTH_CHECK_FAILED);
        process.setNote("Health check recorded. Result: " + (request.getIsEligible() ? "Passed." : "Failed. " + request.getNotes()));

        DonationProcess updatedProcess = donationProcessRepository.save(process);
        return mapToResponse(updatedProcess);
    }

    /**
     * Staff/Admin xác nhận đã lấy máu và ghi nhận thể tích.
     */
    @Transactional
    public DonationProcessResponse markBloodAsCollected(Long processId, CollectionInfoRequest request) {
        DonationProcess process = findProcessById(processId);
        if (process.getStatus() != DonationStatus.HEALTH_CHECK_PASSED) {
            throw new IllegalStateException("Blood can only be collected after a passed health check.");
        }
        process.setCollectedVolumeMl(request.getCollectedVolumeMl());
        process.setStatus(DonationStatus.BLOOD_COLLECTED);
        process.setNote("Blood collected ("+ request.getCollectedVolumeMl() +"ml). Awaiting test results.");
        return mapToResponse(donationProcessRepository.save(process));
    }

    /**
     * Staff/Admin ghi nhận kết quả xét nghiệm túi máu.
     */
    @Transactional
    public DonationProcessResponse recordBloodTestResult(Long processId, BloodTestResultRequest request) {
        DonationProcess process = findProcessById(processId);
        if (process.getStatus() != DonationStatus.BLOOD_COLLECTED) {
            throw new IllegalStateException("Cannot record test results for blood that has not been collected.");
        }

        if (request.getIsSafe()) {
            inventoryService.addUnitToInventory(process, request.getBloodUnitId());

            process.setStatus(DonationStatus.COMPLETED);
            process.setNote("Blood unit " + request.getBloodUnitId() + " passed tests and added to inventory.");

            User donor = process.getDonor();
            donor.setIsReadyToDonate(false);
            donor.setLastDonationDate(LocalDate.now());
            userRepository.save(donor);

            // **NEW: Send email with test results**
            sendTestResultEmail(process, request);


        } else {
            process.setStatus(DonationStatus.TESTING_FAILED);
            process.setNote("Blood unit " + request.getBloodUnitId() + " failed testing. Reason: " + request.getNotes());
            // **NEW: Send email with test results even if it failed**
            sendTestResultEmail(process, request);
        }
        return mapToResponse(donationProcessRepository.save(process));
    }

    /**
     * **NEW METHOD**
     * Prepares and sends the blood test result email to the donor.
     * @param process The donation process containing donor and appointment info.
     * @param result The result of the blood test.
     */
    private void sendTestResultEmail(DonationProcess process, BloodTestResultRequest result) {
        User donor = process.getDonor();
        DonationAppointment appointment = process.getDonationAppointment();

        // Prepare email variables
        String recipientEmail = donor.getEmail();
        String subject = "Kết quả xét nghiệm máu của bạn";

        // Format the date from the appointment
        String donationDate = "không xác định";
        String location = "không xác định";
        if (appointment != null) {
            donationDate = appointment.getAppointmentDateTime().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            location = appointment.getLocation();
        }

        String bloodGroup = donor.getBloodType() != null ? donor.getBloodType().getBloodGroup() : "chưa xác định";

        String resultText;
        if (result.getIsSafe()) {
            resultText = "KQ 血液：Nhóm máu " + bloodGroup + ", âm tính với VR HIV, VR viêm gan B, VR viêm gan C, VK giang mai.";
        } else {
            resultText = "KQ 血液：Máu của bạn không đạt tiêu chuẩn an toàn. Lý do: " + result.getNotes() + ". Vui lòng liên hệ cơ sở y tế để được tư vấn chi tiết.";
        }

        String emailBody = String.format(
                "Trân trọng cảm ơn quý vị đã tham gia Hiến máu vào ngày %s tại %s.\n\n" +
                        "%s\n\n" +
                        "Kính mong quý vị sẽ tiếp tục tham gia Hiến máu trong các chương trình tiếp theo. LH: 0328223509",
                donationDate,
                location,
                resultText
        );

        emailService.sendEmail(recipientEmail, subject, emailBody);
    }


    // Hàm helper để tìm quy trình theo ID
    private DonationProcess findProcessById(Long processId) {
        return donationProcessRepository.findById(processId)
                .orElseThrow(() -> new EntityNotFoundException("Donation process not found with id: " + processId));
    }

    // Hàm helper để chuyển đổi Entity sang DTO
    public DonationProcessResponse mapToResponse(DonationProcess entity) {
        DonationProcessResponse response = new DonationProcessResponse();
        BeanUtils.copyProperties(entity, response, "donor", "donationAppointment", "healthCheck");

        if (entity.getDonor() != null) {
            response.setDonor(userService.mapToUserResponse(entity.getDonor()));
        }
        if (entity.getDonationAppointment() != null) {
            response.setAppointment(appointmentService.mapToResponse(entity.getDonationAppointment()));
        }
        if (entity.getHealthCheck() != null) {
            response.setHealthCheck(mapToHealthCheckResponse(entity.getHealthCheck()));
        }
        return response;
    }

    // Hàm helper để map HealthCheck sang DTO
    private HealthCheckResponse mapToHealthCheckResponse(HealthCheck entity) {
        if (entity == null) return null;
        HealthCheckResponse response = new HealthCheckResponse();
        BeanUtils.copyProperties(entity, response);
        return response;
    }
}