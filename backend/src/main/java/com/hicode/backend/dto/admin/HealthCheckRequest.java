package com.hicode.backend.dto.admin;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HealthCheckRequest {

    @NotNull(message = "Eligibility result is required")
    private Boolean isEligible;

    @NotNull(message = "Systolic blood pressure is required")
    @Positive(message = "Systolic pressure must be positive")
    @DecimalMin(value = "90", message = "Systolic pressure must be at least 90 mmHg")
    @DecimalMax(value = "180", message = "Systolic pressure must not exceed 180 mmHg")
    private Integer bloodPressureSystolic; // Huyết áp tâm thu

    @NotNull(message = "Diastolic blood pressure is required")
    @Positive(message = "Diastolic pressure must be positive")
    @DecimalMin(value = "60", message = "Diastolic pressure must be at least 60 mmHg")
    @DecimalMax(value = "100", message = "Diastolic pressure must not exceed 100 mmHg")
    private Integer bloodPressureDiastolic; // Huyết áp tâm trương

    @NotNull(message = "Hemoglobin level is required")
    @Positive(message = "Hemoglobin level must be positive")
    @DecimalMin(value = "12.0", message = "Hemoglobin level must be at least 12.0 g/dL")
    @DecimalMax(value = "18.5", message = "Hemoglobin level must not exceed 18.5 g/dL")
    private Double hemoglobinLevel; // Nồng độ hemoglobin

    @NotNull(message = "Weight is required")
    @Positive(message = "Weight must be positive")
    @DecimalMin(value = "45.0", message = "Weight must be at least 45 kg")
    private Double weight; // Cân nặng

    @NotNull(message = "Heart rate is required")
    @Positive(message = "Heart rate must be positive")
    @DecimalMin(value = "50", message = "Heart rate must be between 50 and 100 bpm")
    @DecimalMax(value = "100", message = "Heart rate must be between 50 and 100 bpm")
    private Integer heartRate; // Nhịp tim

    @NotNull(message = "Temperature is required")
    @Positive(message = "Temperature must be positive")
    @DecimalMin(value = "36.0", message = "Temperature must be between 36.0 and 37.5 °C")
    @DecimalMax(value = "37.5", message = "Temperature must be between 36.0 and 37.5 °C")
    private Double temperature; // Nhiệt độ

    private String notes; // Ghi chú (tùy chọn)
}