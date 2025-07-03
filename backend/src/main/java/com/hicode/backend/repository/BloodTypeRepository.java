package com.hicode.backend.repository;

import com.hicode.backend.model.enums.BloodComponentType;
import com.hicode.backend.model.entity.BloodType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface BloodTypeRepository extends JpaRepository<BloodType, Integer> {
    Optional<BloodType> findByBloodGroupAndComponentType(String bloodGroup, BloodComponentType componentType);
}