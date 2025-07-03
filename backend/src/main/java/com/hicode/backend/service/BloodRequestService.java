package com.hicode.backend.service;

import com.hicode.backend.dto.admin.BloodRequestResponse;
import com.hicode.backend.dto.admin.BloodTypeResponse;
import com.hicode.backend.dto.admin.CreateBloodRequestRequest;
import com.hicode.backend.model.entity.*;
import com.hicode.backend.model.enums.*;
import com.hicode.backend.repository.BloodRequestRepository;
import com.hicode.backend.repository.BloodTypeRepository;
import com.hicode.backend.repository.DonationPledgeRepository;
import com.hicode.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BloodRequestService {

    @Autowired private BloodRequestRepository bloodRequestRepository;
    @Autowired private BloodTypeRepository bloodTypeRepository;
    @Autowired private DonationPledgeRepository pledgeRepository;
    @Autowired private UserService userService;
    @Autowired private UserRepository userRepository;
    @Autowired private EmailService emailService;

    /**
     * Staff/Admin tạo một yêu cầu cần máu mới.
     * Trả về DTO thay vì Entity.
     */
    @Transactional
    public BloodRequestResponse createRequest(CreateBloodRequestRequest request) {
        User currentStaff = userService.getCurrentUser();
        BloodType bloodType = bloodTypeRepository.findById(request.getBloodTypeId())
                .orElseThrow(() -> new EntityNotFoundException("BloodType not found with id: " + request.getBloodTypeId()));

        BloodRequest newRequest = new BloodRequest();
        newRequest.setPatientName(request.getPatientName());
        newRequest.setHospital(request.getHospital());
        newRequest.setBloodType(bloodType);
        newRequest.setQuantityInUnits(request.getQuantityInUnits());
        newRequest.setUrgency(request.getUrgency());
        newRequest.setCreatedBy(currentStaff);
        newRequest.setStatus(RequestStatus.PENDING);

        BloodRequest savedRequest = bloodRequestRepository.save(newRequest);
        sendNotificationToAvailableDonors(savedRequest);

        return mapToResponse(savedRequest);
    }

    /**
     * Lấy danh sách các yêu cầu đang hoạt động (PENDING) cho Member xem.
     */
    @Transactional(readOnly = true)
    public List<BloodRequestResponse> searchActiveRequests() {
        List<BloodRequest> requests = bloodRequestRepository.findByStatusWithDetails(RequestStatus.PENDING);
        return requests.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    /**
     * Lấy chi tiết một yêu cầu máu theo ID.
     */
    @Transactional(readOnly = true)
    public BloodRequestResponse getRequestById(Long id) {
        BloodRequest request = bloodRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Blood request not found with id: " + id));
        return mapToResponse(request);
    }

    /**
     * Lấy tất cả yêu cầu máu có phân trang cho Staff/Admin.
     */
    @Transactional(readOnly = true)
    public Page<BloodRequestResponse> getAllRequests(Pageable pageable) {
        Page<BloodRequest> requestPage = bloodRequestRepository.findAll(pageable);
        return requestPage.map(this::mapToResponse);
    }

    /**
     * Lấy danh sách các yêu cầu đã hoàn thành (FULFILLED) có phân trang cho Staff/Admin.
     */
    @Transactional(readOnly = true)
    public Page<BloodRequestResponse> getCompletedRequests(Pageable pageable) {
        Page<BloodRequest> requestPage = bloodRequestRepository.findByStatus(RequestStatus.FULFILLED, pageable);
        return requestPage.map(this::mapToResponse);
    }

    /**
     * Cho phép một Member đăng ký hiến tặng cho một yêu cầu cụ thể.
     */
    @Transactional
    public DonationPledge pledgeForRequest(Long requestId) {
        User currentUser = userService.getCurrentUser();
        BloodRequest bloodRequest = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new EntityNotFoundException("Blood request not found"));

        if(bloodRequest.getStatus() != RequestStatus.PENDING) {
            throw new IllegalStateException("This blood request is no longer active for pledging.");
        }

        boolean alreadyPledged = bloodRequest.getPledges().stream()
                .anyMatch(p -> p.getDonor().getId().equals(currentUser.getId()));
        if (alreadyPledged) {
            throw new IllegalStateException("You have already pledged for this blood request.");
        }

        DonationPledge pledge = new DonationPledge();
        pledge.setDonor(currentUser);
        pledge.setBloodRequest(bloodRequest);

        DonationPledge savedPledge = pledgeRepository.save(pledge);

        // Tải lại đối tượng cha để cập nhật danh sách pledge trong bộ nhớ
        BloodRequest updatedRequest = bloodRequestRepository.findById(requestId).get();
        checkAndUpdateRequestStatus(updatedRequest);

        return savedPledge;
    }

    /**
     * Staff/Admin cập nhật trạng thái của một yêu cầu.
     */
    @Transactional
    public BloodRequestResponse updateStatus(Long requestId, RequestStatus newStatus) {
        BloodRequest request = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new EntityNotFoundException("Blood request not found with id: " + requestId));
        request.setStatus(newStatus);
        return mapToResponse(bloodRequestRepository.save(request));
    }

    /**
     * Hàm nội bộ để kiểm tra và cập nhật trạng thái yêu cầu máu theo quy tắc N+1.
     */
    private void checkAndUpdateRequestStatus(BloodRequest bloodRequest) {
        int requiredQuantity = bloodRequest.getQuantityInUnits();
        int currentPledges = bloodRequest.getPledges().size();
        int requiredPledges = requiredQuantity + 1;

        if (currentPledges >= requiredPledges) {
            bloodRequest.setStatus(RequestStatus.FULFILLED);
            bloodRequestRepository.save(bloodRequest);
        }
    }

    /**
     * Gửi email thông báo bất đồng bộ đến các người hiến máu phù hợp.
     */
    @Async
    public void sendNotificationToAvailableDonors(BloodRequest bloodRequest) {
        List<User> availableDonors = userRepository.findByIsReadyToDonateFalseAndLastDonationDateIsNotNull();

        String subject = "[Khẩn cấp] Kêu gọi hiến máu nhóm " + bloodRequest.getBloodType().getBloodGroup();
        String text = String.format(
                "Chào bạn,\n\nHệ thống hiến máu đang có một trường hợp khẩn cấp cần máu nhóm %s tại %s cho bệnh nhân %s.\n" +
                        "Số lượng cần: %d đơn vị.\n\n" +
                        "Vui lòng truy cập ứng dụng để xem chi tiết và đăng ký hỗ trợ nếu bạn đủ điều kiện.\n\n" +
                        "Trân trọng.",
                bloodRequest.getBloodType().getBloodGroup(),
                bloodRequest.getHospital(),
                bloodRequest.getPatientName(),
                bloodRequest.getQuantityInUnits()
        );

        for (User donor : availableDonors) {
            emailService.sendEmail(donor.getEmail(), subject, text);
        }
    }

    /**
     * Hàm helper để chuyển đổi BloodRequest Entity sang BloodRequestResponse DTO.
     */
    private BloodRequestResponse mapToResponse(BloodRequest entity) {
        BloodRequestResponse response = new BloodRequestResponse();
        BeanUtils.copyProperties(entity, response, "bloodType", "createdBy", "pledges");

        if (entity.getBloodType() != null) {
            BloodTypeResponse btResponse = new BloodTypeResponse();
            BeanUtils.copyProperties(entity.getBloodType(), btResponse);
            response.setBloodType(btResponse);
        }

        if (entity.getCreatedBy() != null) {
            response.setCreatedBy(userService.mapToUserResponse(entity.getCreatedBy()));
        }

        if (entity.getPledges() != null) {
            response.setPledgeCount(entity.getPledges().size());
        } else {
            response.setPledgeCount(0);
        }
        return response;
    }
}