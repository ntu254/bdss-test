package com.hicode.backend.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class HealthCheckResponse {
    private Long id;
    private Boolean isEligible;
    private Integer bloodPressureSystolic;
    private Integer bloodPressureDiastolic;
    private Double hemoglobinLevel;
    private Double weight;
    private Integer heartRate;
    private Double temperature;
    private String notes;
    private LocalDateTime checkDate;
}