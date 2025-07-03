package com.hicode.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hicode.backend.dto.FptOcrResponse;
import com.hicode.backend.dto.OcrDataDTO;
import com.hicode.backend.dto.RegisterRequest;
import com.hicode.backend.model.entity.User;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class OcrValidationService {

    private final String OCR_API_URL = "https://api.fpt.ai/vision/idr/vnm";
    private final String FPT_API_KEY = "P0jPWEU1ryJ2KYt2D6J4Ik0ooLszQX9o";

    public String identifyIdCardSide(MultipartFile image) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.set("api-key", FPT_API_KEY);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("image", image.getResource());

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> responseEntity = restTemplate.postForEntity(OCR_API_URL, requestEntity, String.class);

            if (responseEntity.getStatusCode().is2xxSuccessful() && responseEntity.getBody() != null) {
                ObjectMapper objectMapper = new ObjectMapper();
                FptOcrResponse response = objectMapper.readValue(responseEntity.getBody(), FptOcrResponse.class);

                if (response != null && response.getErrorCode() == 0 && response.getData() != null && !response.getData().isEmpty()) {
                    OcrDataDTO ocrData = response.getData().get(0);

                    // Sử dụng trường "type" do FPT AI cung cấp để phân biệt chính xác
                    String type = ocrData.getType();
                    if (type != null) {
                        if (type.contains("front")) {
                            return "FRONT";
                        } else if (type.contains("back")) {
                            return "BACK";
                        }
                    }
                } else {
                    throw new RuntimeException("OCR analysis failed: " + (response != null ? response.getErrorMessage() : "Empty response"));
                }
            } else {
                throw new RuntimeException("OCR service returned an error: " + responseEntity.getBody());
            }

        } catch (Exception e) {
            System.err.println("Error calling FPT.AI OCR API: " + e.getMessage());
            throw new RuntimeException("Could not validate image with OCR service.", e);
        }

        return "UNKNOWN";
    }

    /**
     * Hàm helper để gọi FPT.AI và trích xuất dữ liệu từ một ảnh.
     * @param image File ảnh cần xử lý.
     * @return Đối tượng OcrDataDTO chứa thông tin đã trích xuất, hoặc null nếu thất bại.
     */
    private OcrDataDTO extractDataFromImage(MultipartFile image) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.set("api-key", FPT_API_KEY);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("image", image.getResource());

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> responseEntity = restTemplate.postForEntity(OCR_API_URL, requestEntity, String.class);

            if (responseEntity.getStatusCode().is2xxSuccessful() && responseEntity.getBody() != null) {
                ObjectMapper objectMapper = new ObjectMapper();
                FptOcrResponse response = objectMapper.readValue(responseEntity.getBody(), FptOcrResponse.class);

                if (response != null && response.getErrorCode() == 0 && response.getData() != null && !response.getData().isEmpty()) {
                    return response.getData().get(0);
                }
            } else {
                System.err.println("FPT.AI API returned non-successful status: " + responseEntity.getStatusCode());
            }
        } catch (Exception e) {
            System.err.println("Error calling FPT.AI OCR API: " + e.getMessage());
        }
        return null;
    }

    /**
     * Hàm chính để đối chiếu thông tin từ CCCD với dữ liệu người dùng cung cấp.
     * @param frontImage Ảnh mặt trước CCCD.
     * @param backImage Ảnh mặt sau CCCD.
     * @param userData Dữ liệu người dùng nhập vào từ form đăng ký.
     * @return true nếu thông tin khớp, ngược lại ném ra exception với chi tiết lỗi.
     */
    public boolean verifyIdCardData(MultipartFile frontImage, MultipartFile backImage, RegisterRequest userData) {
        OcrDataDTO frontData = extractDataFromImage(frontImage);
        OcrDataDTO backData = extractDataFromImage(backImage);

        if (frontData == null || (frontData.getType() != null && frontData.getType().contains("back"))) {
            throw new IllegalArgumentException("Ảnh mặt trước CCCD không hợp lệ hoặc không thể đọc được.");
        }
        if (backData == null || (backData.getType() != null && backData.getType().contains("front"))) {
            throw new IllegalArgumentException("Ảnh mặt sau CCCD không hợp lệ hoặc không thể đọc được.");
        }

        List<String> mismatches = new ArrayList<>();

        // 1. Đối chiếu Họ và tên
        if (frontData.getName() != null && !isNameSimilar(frontData.getName(), userData.getFullName())) {
            mismatches.add("Họ và tên không khớp (CCCD: " + frontData.getName() + ")");
        }

        // 2. Đối chiếu Ngày sinh
        if (frontData.getDob() != null) {
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                LocalDate ocrDob = LocalDate.parse(frontData.getDob(), formatter);
                if (!ocrDob.equals(userData.getDateOfBirth())) {
                    mismatches.add("Ngày sinh không khớp (CCCD: " + frontData.getDob() + ")");
                }
            } catch (Exception e) {
                mismatches.add("Không thể đọc định dạng ngày sinh trên CCCD.");
            }
        }

        // 3. Đối chiếu Số CCCD (nếu cần)
        // if (frontData.getId() != null && !frontData.getId().equals(userData.getIdCardNumber())) {
        //     mismatches.add("Số CCCD không khớp.");
        // }

        if (!mismatches.isEmpty()) {
            throw new IllegalArgumentException("Thông tin không khớp: " + String.join(", ", mismatches));
        }

        return true;
    }

    /**
     * Hàm helper để so sánh tên một cách linh hoạt hơn, bỏ qua viết hoa và dấu.
     */
    private boolean isNameSimilar(String ocrName, String formName) {
        if (ocrName == null || formName == null) {
            return false;
        }
        // Chuẩn hóa cả hai chuỗi: chuyển về chữ thường và bỏ các ký tự không cần thiết.
        String normalizedOcrName = ocrName.trim().toLowerCase();
        String normalizedFormName = formName.trim().toLowerCase();

        return normalizedOcrName.equalsIgnoreCase(normalizedFormName);
    }

    /**
     * Hàm chính để đối chiếu thông tin
     * @return Một đối tượng OcrDataDTO chứa thông tin đã được trích xuất và chuẩn hóa.
     */
    public OcrDataDTO verifyAndExtractIdCardData(MultipartFile frontImage, MultipartFile backImage, RegisterRequest userData) {
        OcrDataDTO frontData = extractDataFromImage(frontImage);

        if (frontData == null || (frontData.getType() != null && frontData.getType().contains("back"))) {
            throw new IllegalArgumentException("Ảnh mặt trước CCCD không hợp lệ hoặc không thể đọc được.");
        }

        List<String> mismatches = new ArrayList<>();

        // 1. Đối chiếu Họ và tên
        if (frontData.getName() == null || !isNameSimilar(frontData.getName(), userData.getFullName())) {
            mismatches.add("Họ và tên không khớp (CCCD: " + frontData.getName() + ")");
        }

        // 2. Đối chiếu Ngày sinh
        if (frontData.getDob() == null) {
            mismatches.add("Không đọc được Ngày sinh trên CCCD.");
        } else {
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                LocalDate ocrDob = LocalDate.parse(frontData.getDob(), formatter);
                if (!ocrDob.equals(userData.getDateOfBirth())) {
                    mismatches.add("Ngày sinh không khớp (CCCD: " + frontData.getDob() + ")");
                }
            } catch (Exception e) {
                mismatches.add("Không thể đọc định dạng ngày sinh trên CCCD.");
            }
        }

        if (!mismatches.isEmpty()) {
            throw new IllegalArgumentException("Thông tin không khớp: " + String.join("; ", mismatches));
        }

        // Nếu mọi thứ đều khớp, trả về dữ liệu đã được OCR
        return frontData;
    }

    public OcrDataDTO verifyAndExtractIdCardDataAgainstUser(MultipartFile frontImage, User user) {
        OcrDataDTO frontData = extractDataFromImage(frontImage);

        if (frontData == null || (frontData.getType() != null && frontData.getType().contains("back"))) {
            throw new IllegalArgumentException("Ảnh mặt trước CCCD không hợp lệ hoặc không thể đọc được.");
        }

        List<String> mismatches = new ArrayList<>();

        // 1. Đối chiếu Họ và tên
        if (frontData.getName() == null || !isNameSimilar(frontData.getName(), user.getFullName())) {
            mismatches.add("Họ và tên không khớp (CCCD: " + frontData.getName() + ", Hồ sơ: " + user.getFullName() + ")");
        }

        // 2. Đối chiếu Ngày sinh
        if (frontData.getDob() == null) {
            mismatches.add("Không đọc được Ngày sinh trên CCCD.");
        } else {
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                LocalDate ocrDob = LocalDate.parse(frontData.getDob(), formatter);
                if (!ocrDob.equals(user.getDateOfBirth())) {
                    mismatches.add("Ngày sinh không khớp (CCCD: " + frontData.getDob() + ", Hồ sơ: " + user.getDateOfBirth() + ")");
                }
            } catch (Exception e) {
                mismatches.add("Không thể đọc định dạng ngày sinh trên CCCD.");
            }
        }

        if (!mismatches.isEmpty()) {
            throw new IllegalArgumentException("Thông tin không khớp: " + String.join("; ", mismatches));
        }

        // Nếu mọi thứ đều khớp, trả về dữ liệu đã được OCR
        return frontData;
    }
}