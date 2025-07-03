package com.hicode.backend.dto.admin;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class AdminUpdateUserRequest {
    @Size(min = 3, max = 150)
    private String fullName;
    private String phone;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private Double latitude;
    private Double longitude;
    private String emergencyContact;
    private Integer bloodTypeId;
    private String medicalConditions;
    private LocalDate lastDonationDate;
    private Boolean isReadyToDonate;
    private String roleName;
    private String status;
    private Boolean emailVerified;
    private Boolean phoneVerified;
}