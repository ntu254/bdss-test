package com.hicode.backend.service;

import com.hicode.backend.model.entity.User;
import com.hicode.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class UserAvailabilityService {

    private static final Logger logger = LoggerFactory.getLogger(UserAvailabilityService.class);

    @Autowired
    private UserRepository userRepository;

    private static final int RECOVERY_DAYS = 84; // Thời gian phục hồi là 84 ngày (12 tuần)

    /**
     * Tác vụ này sẽ tự động chạy vào lúc 2 giờ sáng mỗi ngày.
     * Cron expression: "0 0 2 * * ?" (giây phút giờ * * ?)
     */
    @Scheduled(cron = "0 0 2 * * ?")
    @Transactional
    public void updateDonorAvailability() {
        logger.info("Running scheduled task to update donor availability...");

        List<User> usersToUpdate = userRepository.findByIsReadyToDonateFalseAndLastDonationDateIsNotNull();

        if (usersToUpdate.isEmpty()) {
            logger.info("No users to update today.");
            return;
        }

        LocalDate today = LocalDate.now();
        int updatedCount = 0;

        for (User user : usersToUpdate) {
            LocalDate recoveryDate = user.getLastDonationDate().plusDays(RECOVERY_DAYS);
            if (today.isAfter(recoveryDate) || today.isEqual(recoveryDate)) {
                user.setIsReadyToDonate(true);
                userRepository.save(user);
                updatedCount++;
                logger.info("User {} is now available to donate again.", user.getEmail());
            }
        }

        if (updatedCount > 0) {
            logger.info("Successfully updated availability for {} users.", updatedCount);
        } else {
            logger.info("Finished checking, no users met the recovery period today.");
        }
    }
}