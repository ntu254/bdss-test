package com.hicode.backend.service;

import com.hicode.backend.dto.*;
import com.hicode.backend.dto.admin.*;
import com.hicode.backend.model.entity.BloodType;
import com.hicode.backend.model.entity.BloodTypeCompatibility;
import com.hicode.backend.model.entity.User;
import com.hicode.backend.repository.BloodTypeCompatibilityRepository;
import com.hicode.backend.repository.BloodTypeRepository;
import com.hicode.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BloodManagementService {

    @Autowired
    private BloodTypeRepository bloodTypeRepository;
    @Autowired
    private BloodTypeCompatibilityRepository bloodCompatibilityRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;

    public List<BloodTypeResponse> getAllBloodTypes() {
        return bloodTypeRepository.findAll().stream()
                .map(this::mapToBloodTypeResponse)
                .collect(Collectors.toList());
    }

    public BloodTypeResponse getBloodTypeDetails(Integer id) {
        BloodType bloodType = bloodTypeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("BloodType not found with id: " + id));
        return mapToBloodTypeResponse(bloodType);
    }

    @Transactional
    public BloodTypeResponse createBloodType(CreateBloodTypeRequest request) {
        Optional<BloodType> existing = bloodTypeRepository.findByBloodGroupAndComponentType(
                request.getBloodGroup(), request.getComponentType());
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Blood type with this group and component already exists.");
        }
        BloodType bloodType = new BloodType();
        BeanUtils.copyProperties(request, bloodType);
        BloodType savedBloodType = bloodTypeRepository.save(bloodType);
        return mapToBloodTypeResponse(savedBloodType);
    }

    @Transactional
    public BloodTypeResponse updateBloodType(Integer id, UpdateBloodTypeRequest request) {
        BloodType bloodType = bloodTypeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("BloodType not found with id: " + id));

        if (request.getDescription() != null) {
            bloodType.setDescription(request.getDescription());
        }

        BloodType updatedBloodType = bloodTypeRepository.save(bloodType);
        return mapToBloodTypeResponse(updatedBloodType);
    }

    @Transactional
    public void deleteBloodType(Integer id) {
        if (!bloodTypeRepository.existsById(id)) {
            throw new EntityNotFoundException("BloodType not found with id: " + id);
        }
        List<BloodTypeCompatibility> relatedCompatibilities = bloodCompatibilityRepository.findByDonorBloodTypeIdOrRecipientBloodTypeId(id, id);
        if (!relatedCompatibilities.isEmpty()) {
            bloodCompatibilityRepository.deleteAllInBatch(relatedCompatibilities);
        }
        bloodTypeRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> findUsersByBloodTypeId(Integer bloodTypeId) {
        if (!bloodTypeRepository.existsById(bloodTypeId)) {
            throw new EntityNotFoundException("BloodType not found with id: " + bloodTypeId);
        }
        List<User> users = userRepository.findByBloodTypeId(bloodTypeId);
        return users.stream()
                .map(userService::mapToUserResponse)
                .collect(Collectors.toList());
    }

    public Page<BloodCompatibilityDetailResponse> getAllCompatibilityRules(Pageable pageable) {
        return bloodCompatibilityRepository.findAll(pageable).map(this::mapToBloodCompatibilityDetailResponse);
    }

    public BloodCompatibilityDetailResponse getCompatibilityRuleById(Integer id) {
        BloodTypeCompatibility rule = bloodCompatibilityRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Compatibility Rule not found with id: " + id));
        return mapToBloodCompatibilityDetailResponse(rule);
    }

    @Transactional
    public BloodCompatibilityDetailResponse createCompatibilityRule(CreateBloodCompatibilityRequest request) {
        BloodType donor = bloodTypeRepository.findById(request.getDonorBloodTypeId())
                .orElseThrow(() -> new EntityNotFoundException("Donor BloodType not found."));
        BloodType recipient = bloodTypeRepository.findById(request.getRecipientBloodTypeId())
                .orElseThrow(() -> new EntityNotFoundException("Recipient BloodType not found."));

        bloodCompatibilityRepository.findByDonorBloodTypeIdAndRecipientBloodTypeId(request.getDonorBloodTypeId(), request.getRecipientBloodTypeId())
                .ifPresent(r -> { throw new IllegalArgumentException("This compatibility rule already exists."); });

        BloodTypeCompatibility rule = new BloodTypeCompatibility();
        BeanUtils.copyProperties(request, rule, "donorBloodTypeId", "recipientBloodTypeId");
        rule.setDonorBloodType(donor);
        rule.setRecipientBloodType(recipient);

        return mapToBloodCompatibilityDetailResponse(bloodCompatibilityRepository.save(rule));
    }

    @Transactional
    public BloodCompatibilityDetailResponse updateCompatibilityRule(Integer id, UpdateBloodCompatibilityRequest request) {
        BloodTypeCompatibility rule = bloodCompatibilityRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Compatibility Rule not found with id: " + id));

        if (request.getIsCompatible() != null) rule.setIsCompatible(request.getIsCompatible());
        if (request.getNotes() != null) rule.setNotes(request.getNotes());

        return mapToBloodCompatibilityDetailResponse(bloodCompatibilityRepository.save(rule));
    }

    @Transactional
    public void deleteCompatibilityRule(Integer id) {
        if (!bloodCompatibilityRepository.existsById(id)) {
            throw new EntityNotFoundException("Compatibility Rule not found with id: " + id);
        }
        bloodCompatibilityRepository.deleteById(id);
    }

    private BloodTypeResponse mapToBloodTypeResponse(BloodType bloodType) {
        if (bloodType == null) return null;
        BloodTypeResponse res = new BloodTypeResponse();
        BeanUtils.copyProperties(bloodType, res);
        return res;
    }

    private BloodCompatibilityDetailResponse mapToBloodCompatibilityDetailResponse(BloodTypeCompatibility rule) {
        if (rule == null) return null;
        BloodCompatibilityDetailResponse res = new BloodCompatibilityDetailResponse();
        BeanUtils.copyProperties(rule, res, "donorBloodType", "recipientBloodType");
        res.setDonorBloodType(mapToBloodTypeResponse(rule.getDonorBloodType()));
        res.setRecipientBloodType(mapToBloodTypeResponse(rule.getRecipientBloodType()));
        return res;
    }
}