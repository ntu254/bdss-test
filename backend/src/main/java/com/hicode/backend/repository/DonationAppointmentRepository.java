package com.hicode.backend.repository;

import com.hicode.backend.model.entity.DonationAppointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonationAppointmentRepository extends JpaRepository<DonationAppointment, Long> {
    @Query("SELECT da FROM DonationAppointment da WHERE da.donationProcess.donor.id = :donorId ORDER BY da.appointmentDateTime DESC")
    List<DonationAppointment> findByDonorId(@Param("donorId") Long donorId);
}
