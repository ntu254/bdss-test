package com.hicode.backend.dto.admin;

import com.hicode.backend.dto.UserResponse;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class AppointmentResponse {
    private Long id;
    private Long processId;
    private UserResponse donor;
    private LocalDateTime appointmentDateTime;
    private String location;
    private UserResponse staff;
    private String notes;
}