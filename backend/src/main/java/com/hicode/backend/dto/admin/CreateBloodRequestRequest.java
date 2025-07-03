package com.hicode.backend.dto.admin;

import com.hicode.backend.model.enums.UrgencyLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateBloodRequestRequest {
    @NotBlank
    private String patientName;
    @NotBlank
    private String hospital;
    @NotNull
    private Integer bloodTypeId;
    @NotNull
    @Positive
    private Integer quantityInUnits;
    @NotNull
    private UrgencyLevel urgency;
}