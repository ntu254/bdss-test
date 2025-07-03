package com.hicode.backend.dto.admin;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class AdminCreateUserRequest {

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 100)
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Size(max = 150)
    private String email;

    @NotBlank(message = "Full name is required")
    @Size(min = 3, max = 150, message = "Full name must be between 3 and 150 characters")
    private String fullName;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100)
    private String password;

    @NotBlank(message = "Role name is required")
    private String roleName;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Phone number is required")
    @Size(min = 9, max = 15, message = "Phone number must be between 9 and 15 characters")
    private String phone;

    @NotBlank(message = "Address is required")
    @Size(min = 10, max = 255, message = "Address must be between 10 and 255 characters")
    private String address;

    private Integer bloodTypeId;
    private String status;
    private Boolean emailVerified;
    private Boolean phoneVerified;
}