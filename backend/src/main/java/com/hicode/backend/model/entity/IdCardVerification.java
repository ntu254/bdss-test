package com.hicode.backend.model.entity;

import com.hicode.backend.model.enums.VerificationStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "id_card_verifications")
@Getter
@Setter
@NoArgsConstructor
public class IdCardVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "ocr_id_number", length = 20)
    private String ocrIdNumber;

    @Column(name = "ocr_full_name", columnDefinition = "NVARCHAR(150)")
    private String ocrFullName;

    @Column(name = "ocr_dob")
    private LocalDate ocrDob;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private VerificationStatus status;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String mismatchDetails; // Ghi chú các trường không khớp

    private LocalDateTime verifiedAt;
}