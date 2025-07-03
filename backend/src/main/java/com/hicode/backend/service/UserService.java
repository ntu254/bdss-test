package com.hicode.backend.service;

import com.hicode.backend.dto.*;
import com.hicode.backend.dto.admin.AdminCreateUserRequest;
import com.hicode.backend.dto.admin.AdminUpdateUserRequest;
import com.hicode.backend.model.entity.BloodType;
import com.hicode.backend.model.entity.Role;
import com.hicode.backend.model.entity.User;
import com.hicode.backend.model.enums.UserStatus;
import com.hicode.backend.repository.BloodTypeRepository;
import com.hicode.backend.repository.RoleRepository;
import com.hicode.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private BloodTypeRepository bloodTypeRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new IllegalStateException("No authenticated user found. Please login.");
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User principal not found in database: " + email));
    }

    public UserResponse getUserProfile() {
        User currentUser = getCurrentUser();
        return mapToUserResponse(currentUser);
    }

    @Transactional
    public UserResponse updateUserProfile(UpdateUserRequest updateUserRequest) {
        User currentUser = getCurrentUser();

        if (updateUserRequest.getFullName() != null) currentUser.setFullName(updateUserRequest.getFullName());
        if (updateUserRequest.getPhone() != null) currentUser.setPhone(updateUserRequest.getPhone());
        if (updateUserRequest.getDateOfBirth() != null) currentUser.setDateOfBirth(updateUserRequest.getDateOfBirth());
        if (updateUserRequest.getGender() != null) currentUser.setGender(updateUserRequest.getGender());
        if (updateUserRequest.getAddress() != null) currentUser.setAddress(updateUserRequest.getAddress());
        if (updateUserRequest.getLatitude() != null) currentUser.setLatitude(updateUserRequest.getLatitude());
        if (updateUserRequest.getLongitude() != null) currentUser.setLongitude(updateUserRequest.getLongitude());
        if (updateUserRequest.getEmergencyContact() != null) currentUser.setEmergencyContact(updateUserRequest.getEmergencyContact());
        if (updateUserRequest.getMedicalConditions() != null) currentUser.setMedicalConditions(updateUserRequest.getMedicalConditions());
        if (updateUserRequest.getLastDonationDate() != null) currentUser.setLastDonationDate(updateUserRequest.getLastDonationDate());
        if (updateUserRequest.getIsReadyToDonate() != null) currentUser.setIsReadyToDonate(updateUserRequest.getIsReadyToDonate());

        if (updateUserRequest.getBloodTypeId() != null) {
            bloodTypeRepository.findById(updateUserRequest.getBloodTypeId())
                    .ifPresent(currentUser::setBloodType);
        }

        User updatedUser = userRepository.save(currentUser);
        return mapToUserResponse(updatedUser);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> searchDonorsByLocation(LocationSearchRequest request) {
        List<User> users = userRepository.findDonorsWithinRadius(
                request.getLatitude(),
                request.getLongitude(),
                request.getRadius(),
                request.getBloodTypeId()
        );
        return users.stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    public Page<UserResponse> getAllUsers(Pageable pageable) {
        Page<User> usersPage = userRepository.findAll(pageable);
        return usersPage.map(this::mapToUserResponse);
    }

    public UserResponse getUserByIdForAdmin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));
        return mapToUserResponse(user);
    }

    @Transactional
    public UserResponse createUserByAdmin(AdminCreateUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Error: Username '" + request.getUsername() + "' is already taken!");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Error: Email '" + request.getEmail() + "' is already in use!");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());

        // Đảm bảo gán giá trị cho các trường bắt buộc
        user.setDateOfBirth(request.getDateOfBirth());
        user.setAddress(request.getAddress());

        Role role = roleRepository.findByName(request.getRoleName())
                .orElseThrow(() -> new RuntimeException("Error: Role '" + request.getRoleName() + "' not found."));
        user.setRole(role);

        if (request.getBloodTypeId() != null) {
            bloodTypeRepository.findById(request.getBloodTypeId()).ifPresent(user::setBloodType);
        }

        if (request.getStatus() != null && !request.getStatus().isEmpty()) {
            user.setStatus(UserStatus.valueOf(request.getStatus().toUpperCase()));
        } else {
            user.setStatus(UserStatus.ACTIVE);
        }

        user.setEmailVerified(request.getEmailVerified() != null ? request.getEmailVerified() : false);
        user.setPhoneVerified(request.getPhoneVerified() != null ? request.getPhoneVerified() : false);

        User savedUser = userRepository.save(user);
        return mapToUserResponse(savedUser);
    }

    @Transactional
    public UserResponse updateUserByAdmin(Long userId, AdminUpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getAddress() != null) user.setAddress(request.getAddress());
        if (request.getDateOfBirth() != null) user.setDateOfBirth(request.getDateOfBirth());

        if (request.getStatus() != null && !request.getStatus().isEmpty()) {
            try {
                user.setStatus(UserStatus.valueOf(request.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid status value: " + request.getStatus());
            }
        }

        if (request.getBloodTypeId() != null) {
            bloodTypeRepository.findById(request.getBloodTypeId()).ifPresent(user::setBloodType);
        }

        if (request.getRoleName() != null && !request.getRoleName().equals(user.getRole().getName())) {
            Role newRole = roleRepository.findByName(request.getRoleName())
                    .orElseThrow(() -> new RuntimeException("Error: Role '" + request.getRoleName() + "' not found."));
            user.setRole(newRole);
        }

        User updatedUser = userRepository.save(user);
        return mapToUserResponse(updatedUser);
    }

    @Transactional
    public UserResponse softDeleteUserByAdmin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));
        user.setStatus(UserStatus.SUSPENDED);
        User deactivatedUser = userRepository.save(user);
        return mapToUserResponse(deactivatedUser);
    }

    public UserResponse mapToUserResponse(User user) {
        UserResponse userResponse = new UserResponse();
        BeanUtils.copyProperties(user, userResponse, "role", "bloodType", "passwordHash", "donationProcesses", "status");
        if (user.getRole() != null) {
            userResponse.setRole(user.getRole().getName());
        }
        if (user.getBloodType() != null) {
            userResponse.setBloodTypeDescription(user.getBloodType().getDescription());
        }
        if (user.getStatus() != null) {
            userResponse.setStatus(user.getStatus().name());
        }
        return userResponse;
    }
}