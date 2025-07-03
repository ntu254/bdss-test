package com.hicode.backend.model.entity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "donation_appointments")
@Getter
@Setter
@NoArgsConstructor
public class DonationAppointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "process_id", nullable = false, unique = true)
    @JsonBackReference("process-appointment")
    private DonationProcess donationProcess;

    @Column(nullable = false)
    private LocalDateTime appointmentDateTime;

    @Column(columnDefinition = "NVARCHAR(255)", nullable = false)
    private String location;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id")
    private User staff;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String notes;
}
