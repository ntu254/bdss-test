package com.hicode.backend.dto.admin;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class CreateAppointmentRequest {

    @NotNull(message = "Process ID is required")
    private Long processId;

    @NotNull(message = "Appointment date and time are required")
    @Future(message = "Appointment date must be in the future")
    private LocalDateTime appointmentDateTime;

    @NotBlank(message = "Location is required")
    private String location;

    private Long staffId;
    private String notes;
}