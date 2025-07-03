package com.hicode.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.hicode.backend.dto.*;
import com.hicode.backend.model.entity.Role;
import com.hicode.backend.model.entity.User;
import com.hicode.backend.model.entity.VerificationToken;
import com.hicode.backend.model.enums.UserStatus;
import com.hicode.backend.repository.BloodTypeRepository;
import com.hicode.backend.repository.RoleRepository;
import com.hicode.backend.repository.UserRepository;
import com.hicode.backend.repository.VerificationTokenRepository;
import com.hicode.backend.security.JwtTokenProvider;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Random;

@Service
public class AuthService {

    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private UserRepository userRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtTokenProvider tokenProvider;
    @Autowired private VerificationTokenRepository tokenRepository;
    @Autowired private EmailService emailService;
    @Autowired private BloodTypeRepository bloodTypeRepository;

    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    /**
     * Bước 1 của quy trình đăng ký: Nhận thông tin cơ bản và gửi OTP.
     * Đã loại bỏ việc tải lên ảnh và xác thực OCR.
     */
    @Transactional
    public void requestRegistration(RegisterRequest registerRequest) throws IOException {

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new IllegalArgumentException("Error: Email is already in use!");
        }

        // Mã hóa mật khẩu
        registerRequest.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        // Tạo và gửi OTP, lưu thông tin đăng ký tạm thời
        String otp = String.format("%06d", new Random().nextInt(999999));
        String registrationInfoJson = objectMapper.writeValueAsString(registerRequest);

        VerificationToken verificationToken = tokenRepository.findByEmail(registerRequest.getEmail())
                .orElse(new VerificationToken());

        verificationToken.setEmail(registerRequest.getEmail());
        verificationToken.setToken(otp);
        verificationToken.setUserRegistrationInfo(registrationInfoJson);
        verificationToken.setExpiryDate(LocalDateTime.now().plusMinutes(10));

        tokenRepository.save(verificationToken);

        String emailBody = "Mã xác thực đăng ký tài khoản của bạn là: " + otp;
        emailService.sendEmail(registerRequest.getEmail(), "Xác thực đăng ký tài khoản", emailBody);
    }

    /**
     * Bước 2: User xác thực OTP để hoàn tất đăng ký.
     * Đã loại bỏ việc gán các thông tin liên quan đến CCCD.
     */
    @Transactional
    public User verifyAndCompleteRegistration(VerifyRequest verifyRequest) {
        VerificationToken token = tokenRepository.findByEmail(verifyRequest.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("Invalid or expired verification request. Please register again."));

        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(token);
            throw new IllegalStateException("OTP has expired. Please register again.");
        }
        if (!token.getToken().equals(verifyRequest.getOtp())) {
            throw new IllegalArgumentException("Invalid OTP code.");
        }

        try {
            RegisterRequest registrationInfo = objectMapper.readValue(token.getUserRegistrationInfo(), RegisterRequest.class);

            User user = new User();
            user.setFullName(registrationInfo.getFullName());
            user.setEmail(registrationInfo.getEmail());
            user.setUsername(registrationInfo.getEmail()); // Dùng email làm username
            user.setPasswordHash(registrationInfo.getPassword());
            user.setPhone(registrationInfo.getPhone());
            user.setAddress(registrationInfo.getAddress());
            user.setDateOfBirth(registrationInfo.getDateOfBirth());
            user.setLatitude(registrationInfo.getLatitude());
            user.setLongitude(registrationInfo.getLongitude());
            user.setStatus(UserStatus.ACTIVE);
            user.setEmailVerified(true);
            user.setIdCardVerified(false); // Mặc định là chưa xác thực CCCD

            Role userRole = roleRepository.findByName("Member").orElseThrow(() -> new RuntimeException("Error: Role 'Member' not found."));
            user.setRole(userRole);

            if (registrationInfo.getBloodTypeId() != null) {
                bloodTypeRepository.findById(registrationInfo.getBloodTypeId()).ifPresent(user::setBloodType);
            }

            User savedUser = userRepository.save(user);
            tokenRepository.delete(token);
            return savedUser;
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error reading registration data.", e);
        }
    }

    @Transactional
    public void resendOtp(ResendOtpRequest resendRequest) {
        VerificationToken token = tokenRepository.findByEmail(resendRequest.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("No pending registration found for this email."));

        String newOtp = String.format("%06d", new Random().nextInt(999999));
        token.setToken(newOtp);
        token.setExpiryDate(LocalDateTime.now().plusMinutes(10));
        tokenRepository.save(token);

        String emailBody = "Mã xác thực mới của bạn là: " + newOtp + ".";
        emailService.sendEmail(resendRequest.getEmail(), "Yêu cầu gửi lại mã OTP", emailBody);
    }

    public AuthResponse loginUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + loginRequest.getEmail()));
        return new AuthResponse(jwt, user.getId(), user.getEmail(), user.getFullName(), user.getRole().getName());
    }
}