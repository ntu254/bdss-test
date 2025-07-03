package com.hicode.backend.model.enums;

public enum VerificationStatus {
    PENDING,    // Đang chờ xử lý
    VERIFIED,   // Đã xác thực thành công
    FAILED      // Xác thực thất bại (thông tin không khớp)
}