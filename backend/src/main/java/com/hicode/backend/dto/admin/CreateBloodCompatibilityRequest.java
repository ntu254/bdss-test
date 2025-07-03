package com.hicode.backend.dto.admin;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateBloodCompatibilityRequest {
    @NotNull
    private Integer donorBloodTypeId;
    @NotNull
    private Integer recipientBloodTypeId;
    @NotNull
    private Boolean isCompatible;
    private Integer compatibilityScore;
    private Boolean isEmergencyCompatible;
    private String notes;
}