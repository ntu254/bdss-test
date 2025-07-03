package com.hicode.backend.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "verification_tokens")
@Getter
@Setter
@NoArgsConstructor
public class VerificationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String token; // Mã OTP

    @Column(nullable = false, unique = true)
    private String email;

    @Lob
    @Column(nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String userRegistrationInfo; // Lưu thông tin đăng ký dưới dạng JSON

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    public VerificationToken(String token, String email, String userRegistrationInfo, int expirationTimeInMinutes) {
        this.token = token;
        this.email = email;
        this.userRegistrationInfo = userRegistrationInfo;
        this.expiryDate = LocalDateTime.now().plusMinutes(expirationTimeInMinutes);
    }
}