package com.voyage.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final String fromAddress;

    public EmailService(JavaMailSender mailSender,
                        @Value("${app.mail.from:${spring.mail.username:no-reply@voyage.local}}") String fromAddress) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
    }

    public void sendOtpEmail(String to, String otpCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(to);
        message.setSubject("Your Voyage verification code");
        message.setText("""
                Your Voyage verification code is %s.

                This code expires in 10 minutes. If you did not request this code, you can ignore this email.
                """.formatted(otpCode));

        try {
            mailSender.send(message);
            log.info("Sent OTP email to {}", to);
        } catch (MailException e) {
            log.error("Failed to send OTP email to {}: {}", to, e.getMessage());
            throw new IllegalStateException("Could not send verification email. Please try again later.");
        }
    }
}
