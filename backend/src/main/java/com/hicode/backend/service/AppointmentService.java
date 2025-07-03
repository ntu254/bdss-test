package com.hicode.backend.service;

import com.hicode.backend.dto.admin.AppointmentResponse;
import com.hicode.backend.dto.admin.CreateAppointmentRequest;
import com.hicode.backend.dto.admin.RescheduleRequest;
import com.hicode.backend.model.entity.DonationAppointment;
import com.hicode.backend.model.entity.DonationProcess;
import com.hicode.backend.model.enums.DonationStatus;
import com.hicode.backend.model.entity.User;
import com.hicode.backend.repository.DonationAppointmentRepository;
import com.hicode.backend.repository.DonationProcessRepository;
import com.hicode.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    @Autowired
    private DonationAppointmentRepository appointmentRepository;
    @Autowired
    private DonationProcessRepository processRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private EmailService emailService;

    /**
     * Staff/Admin tạo một lịch hẹn mới cho một quy trình hiến máu.
     * @param request Dữ liệu để tạo lịch hẹn.
     * @return Thông tin chi tiết của lịch hẹn đã tạo.
     */
    @Transactional
    public AppointmentResponse createAppointment(CreateAppointmentRequest request) {
        // 1. Tìm quy trình hiến máu tương ứng
        DonationProcess process = processRepository.findById(request.getProcessId())
                .orElseThrow(() -> new EntityNotFoundException("Donation process not found with id: " + request.getProcessId()));

        // 2. Kiểm tra trạng thái của quy trình, cho phép tạo hẹn khi đang chờ hoặc cần đặt lại
        if (process.getStatus() != DonationStatus.APPOINTMENT_PENDING && process.getStatus() != DonationStatus.RESCHEDULE_REQUESTED) {
            throw new IllegalStateException("Cannot create appointment for this donation process state.");
        }

        // 3. Tạo đối tượng lịch hẹn mới
        DonationAppointment appointment = new DonationAppointment();
        appointment.setDonationProcess(process);
        appointment.setAppointmentDateTime(request.getAppointmentDateTime());
        appointment.setLocation(request.getLocation());
        appointment.setNotes(request.getNotes());

        // 4. (Tùy chọn) Gán nhân viên phụ trách nếu có
        if (request.getStaffId() != null) {
            User staff = userRepository.findById(request.getStaffId())
                    .orElseThrow(() -> new EntityNotFoundException("Staff user not found with id: " + request.getStaffId()));
            appointment.setStaff(staff);
        }

        DonationAppointment savedAppointment = appointmentRepository.save(appointment);

        // 5. Cập nhật mối quan hệ hai chiều và trạng thái của quy trình chính
        process.setDonationAppointment(savedAppointment);
        process.setStatus(DonationStatus.APPOINTMENT_SCHEDULED);
        process.setNote("Appointment scheduled for " + request.getAppointmentDateTime() + " at " + request.getLocation());
        processRepository.save(process);

        return mapToResponse(savedAppointment);
    }

    /**
     * Staff/Admin yêu cầu người dùng đặt lại lịch hẹn.
     * @param appointmentId ID của lịch hẹn cần hủy và yêu cầu đặt lại.
     * @param request Chứa lý do cần đặt lại lịch.
     */
    @Transactional
    public void requestReschedule(Long appointmentId, RescheduleRequest request) {
        DonationAppointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found with id: " + appointmentId));

        DonationProcess process = appointment.getDonationProcess();

        // Cập nhật trạng thái quy trình thành "Cần đặt lại lịch"
        process.setStatus(DonationStatus.RESCHEDULE_REQUESTED);
        process.setNote("Reschedule requested. Reason: " + request.getReason());

        // Xóa lịch hẹn cũ không còn hợp lệ
        appointmentRepository.delete(appointment);

        // Gửi email thông báo cho người dùng
        String emailSubject = "Thông báo: Yêu cầu đặt lại lịch hẹn hiến máu";
        String emailBody = String.format(
                "Chào %s,\n\nLịch hẹn hiến máu của bạn (ID quy trình: %d) cần được đặt lại vì lý do sau: %s\n\n" +
                        "Chúng tôi sẽ sớm liên hệ với bạn để sắp xếp một lịch hẹn mới phù hợp. Xin cảm ơn.\n",
                process.getDonor().getFullName(),
                process.getId(),
                request.getReason()
        );
        emailService.sendEmail(process.getDonor().getEmail(), emailSubject, emailBody);

        processRepository.save(process);
    }

    /**
     * Hàm helper để chuyển đổi DonationAppointment Entity sang AppointmentResponse DTO.
     * @param entity Đối tượng DonationAppointment Entity.
     * @return Đối tượng AppointmentResponse DTO.
     */
    public AppointmentResponse mapToResponse(DonationAppointment entity) {
        if (entity == null) return null;

        AppointmentResponse response = new AppointmentResponse();
        BeanUtils.copyProperties(entity, response);

        if (entity.getDonationProcess() != null) {
            response.setProcessId(entity.getDonationProcess().getId());
            response.setDonor(userService.mapToUserResponse(entity.getDonationProcess().getDonor()));
        }
        if(entity.getStaff() != null) {
            response.setStaff(userService.mapToUserResponse(entity.getStaff()));
        }
        return response;
    }

    /**
     * Lấy danh sách tất cả các lịch hẹn của người dùng đang đăng nhập.
     * @return Danh sách AppointmentResponse DTO.
     */
    @Transactional(readOnly = true)
    public List<AppointmentResponse> getMyAppointments() {
        User currentUser = userService.getCurrentUser();
        List<DonationAppointment> appointments = appointmentRepository.findByDonorId(currentUser.getId());
        return appointments.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
}