package com.hicode.backend.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private Double latitude;
    private Double longitude;
    private String emergencyContact;
    private String bloodTypeDescription;
    private String medicalConditions;
    private LocalDate lastDonationDate;
    private Boolean isReadyToDonate;
    private String role;
    private String status;
    private Boolean emailVerified;
    private Boolean phoneVerified;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}