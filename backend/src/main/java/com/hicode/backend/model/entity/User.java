package com.hicode.backend.model.entity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.hicode.backend.model.enums.UserStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, columnDefinition = "NVARCHAR(150)")
    private String username;

    @Column(length = 150, unique = true, nullable = false)
    private String email;

    @Column(length = 255, nullable = false)
    private String passwordHash;

    @Column(nullable = false, columnDefinition = "NVARCHAR(150)")
    private String fullName;

    @Column(length = 20, nullable = false)
    private String phone;

    @Column(nullable = false)
    private LocalDate dateOfBirth;

    @Column(length = 10)
    private String gender;

    @Lob
    @Column(columnDefinition = "NVARCHAR(MAX)", nullable = false)
    private String address;

    @Column(name = "id_card_front_url", length = 255)
    private String idCardFrontUrl; // URL ảnh CCCD mặt trước

    @Column(name = "id_card_back_url", length = 255)
    private String idCardBackUrl; // URL ảnh CCCD mặt sau

    @Column(name = "id_card_verified", columnDefinition = "BIT DEFAULT 0")
    private Boolean idCardVerified = false; // Trạng thái đã đối chiếu thông tin

    private Double latitude;
    private Double longitude;

    @Column(length = 255)
    private String emergencyContact;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blood_type_id")
    @JsonBackReference
    private BloodType bloodType;

    @Lob
    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String medicalConditions;

    private LocalDate lastDonationDate;

    @Column(columnDefinition = "BIT DEFAULT 1")
    private Boolean isReadyToDonate = true;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private UserStatus status = UserStatus.ACTIVE;
    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("user-blogpost")
    private List<BlogPost> blogPosts;

    @Column(columnDefinition = "BIT DEFAULT 0")
    private Boolean emailVerified = false;

    @Column(columnDefinition = "BIT DEFAULT 0")
    private Boolean phoneVerified = false;

    @OneToMany(mappedBy = "donor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("user-donation")
    private List<DonationProcess> donationProcesses;

    @OneToMany(mappedBy = "donor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("user-pledge")
    private List<DonationPledge> pledges;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private IdCardVerification idCardVerification;

    @Column(name = "id_card_number", length = 20, unique = true)
    private String idCardNumber; // Số CCCD

    @Column(name = "hometown", columnDefinition = "NVARCHAR(255)")
    private String hometown; // Quê quán

    @Column(name = "nationality", columnDefinition = "NVARCHAR(100)")
    private String nationality; // Quốc tịch

    @PrePersist
    protected void onCreate() {
        this.createdAt = this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
