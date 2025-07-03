package com.hicode.backend.repository;

import com.hicode.backend.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    Boolean existsByEmail(String email);
    Boolean existsByUsername(String username);
    List<User> findByBloodTypeId(Integer bloodTypeId);

    @Query(value = "SELECT * FROM users u WHERE " +
            "u.is_ready_to_donate = 1 AND " +
            "(:bloodTypeId IS NULL OR u.blood_type_id = :bloodTypeId) AND " +
            "( 6371 * acos( cos( radians(:lat) ) * cos( radians( u.latitude ) ) * " +
            "cos( radians( u.longitude ) - radians(:lon) ) + sin( radians(:lat) ) * " +
            "sin( radians( u.latitude ) ) ) ) < :radius", nativeQuery = true)
    List<User> findDonorsWithinRadius(
            @Param("lat") double lat,
            @Param("lon") double lon,
            @Param("radius") double radius,
            @Param("bloodTypeId") Integer bloodTypeId
    );

    List<User> findByIsReadyToDonateFalseAndLastDonationDateIsNotNull();
}