package com.hicode.backend.dto.admin;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class BloodCompatibilityDetailResponse {
    private Integer id;
    private BloodTypeResponse donorBloodType;
    private BloodTypeResponse recipientBloodType;
    private Boolean isCompatible;
    private Integer compatibilityScore;
    private Boolean isEmergencyCompatible;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}