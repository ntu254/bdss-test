package com.hicode.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // Tự động lấy giá trị từ application.properties
    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async // Đánh dấu đây là một tác vụ bất đồng bộ để không làm chậm API
    public void sendEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
        } catch (Exception e) {
            // Ghi log lỗi để debug
            System.err.println("Error sending email to " + to + ": " + e.getMessage());
        }
    }
}