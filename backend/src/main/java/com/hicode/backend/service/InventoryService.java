package com.hicode.backend.service;

import com.hicode.backend.dto.admin.BloodTypeResponse;
import com.hicode.backend.dto.admin.BloodUnitResponse;
import com.hicode.backend.dto.admin.InventorySummary;
import com.hicode.backend.model.entity.BloodType;
import com.hicode.backend.model.entity.BloodUnit;
import com.hicode.backend.model.entity.DonationProcess;
import com.hicode.backend.model.enums.InventoryStatus;
import com.hicode.backend.repository.BloodUnitRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    @Autowired
    private BloodUnitRepository bloodUnitRepository;

    @Transactional
    public BloodUnit addUnitToInventory(DonationProcess process, String bloodUnitId) {
        if (bloodUnitRepository.existsById(bloodUnitId)) {
            throw new IllegalArgumentException("Blood unit with ID " + bloodUnitId + " already exists.");
        }

        BloodUnit newUnit = new BloodUnit();
        newUnit.setId(bloodUnitId);
        newUnit.setDonationProcess(process);

        BloodType bloodType = process.getDonor().getBloodType();
        if (bloodType == null) {
            throw new IllegalStateException("Donor's blood type is not set.");
        }
        newUnit.setBloodType(bloodType);

        if (process.getCollectedVolumeMl() == null) {
            throw new IllegalStateException("Collected volume is not recorded for this donation process.");
        }
        newUnit.setVolumeMl(process.getCollectedVolumeMl());
        newUnit.setCollectionDate(LocalDate.now());

        int shelfLife = bloodType.getShelfLifeDays();
        newUnit.setExpiryDate(LocalDate.now().plusDays(shelfLife));

        newUnit.setStatus(InventoryStatus.AVAILABLE);
        newUnit.setStorageLocation("Main Storage");

        return bloodUnitRepository.save(newUnit);
    }

    public List<BloodUnitResponse> getAllInventory() {
        return bloodUnitRepository.findAll().stream()
                .map(this::mapToBloodUnitResponse)
                .collect(Collectors.toList());
    }

    // --- CÁC PHƯƠNG THỨC MỚI ---

    public List<InventorySummary> getInventorySummary() {
        return bloodUnitRepository.getInventorySummary();
    }

    public List<BloodUnitResponse> getRecentAdditions() {
        return bloodUnitRepository.findTop10ByOrderByCollectionDateDesc().stream()
                .map(this::mapToBloodUnitResponse)
                .collect(Collectors.toList());
    }

    // --- HÀM HELPER ---
    private BloodUnitResponse mapToBloodUnitResponse(BloodUnit entity) {
        BloodUnitResponse response = new BloodUnitResponse();
        BeanUtils.copyProperties(entity, response, "bloodType", "donationProcess");

        // Map BloodType
        BloodTypeResponse btResponse = new BloodTypeResponse();
        BeanUtils.copyProperties(entity.getBloodType(), btResponse);
        response.setBloodType(btResponse);

        // Map Donor Info
        response.setDonorId(entity.getDonationProcess().getDonor().getId());
        response.setDonorName(entity.getDonationProcess().getDonor().getFullName());

        return response;
    }
}