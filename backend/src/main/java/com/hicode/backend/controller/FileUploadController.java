package com.hicode.backend.controller;

import com.hicode.backend.dto.OcrDataDTO;
import com.hicode.backend.model.entity.User;
import com.hicode.backend.repository.UserRepository;
import com.hicode.backend.service.OcrValidationService;
import com.hicode.backend.service.StorageService;
import com.hicode.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
public class FileUploadController {

    @Autowired
    private StorageService storageService;
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OcrValidationService ocrValidationService;

    /**
     * API này sẽ tải lên, xác thực và cập nhật thông tin CCCD cho user
     */
    @PostMapping("/me/upload-id-card")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> uploadIdCard(
            @RequestParam("frontImage") MultipartFile frontImage,
            @RequestParam("backImage") MultipartFile backImage) {

        try {
            User currentUser = userService.getCurrentUser();

            // 1. Lưu ảnh mặt trước và mặt sau
            String frontImageUrl = storageService.store(frontImage);
            String backImageUrl = storageService.store(backImage);

            // 2. Gọi OCR để xác thực và trích xuất dữ liệu
            // Hàm này sẽ so sánh dữ liệu OCR với thông tin hiện có của currentUser
            OcrDataDTO ocrData = ocrValidationService.verifyAndExtractIdCardDataAgainstUser(frontImage, currentUser);

            // 3. Cập nhật đường dẫn và thông tin từ OCR vào User
            currentUser.setIdCardFrontUrl(frontImageUrl);
            currentUser.setIdCardBackUrl(backImageUrl);
            currentUser.setIdCardNumber(ocrData.getId()); // Cập nhật số CCCD từ OCR
            currentUser.setIdCardVerified(true); // Đánh dấu đã xác thực thành công

            userRepository.save(currentUser);

            return ResponseEntity.ok("ID card images uploaded and verified successfully.");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Verification failed: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred: " + e.getMessage());
        }
    }
}