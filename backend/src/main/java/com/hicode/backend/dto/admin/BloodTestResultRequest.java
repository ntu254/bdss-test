package com.hicode.backend.dto.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BloodTestResultRequest {
    @NotBlank(message = "Blood unit ID is required")
    private String bloodUnitId;

    @NotNull(message = "Test result is required")
    private Boolean isSafe;

    private String notes;
}