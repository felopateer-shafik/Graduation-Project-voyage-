package com.voyage.backend.service;

import org.junit.jupiter.api.Test;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentCaptor.forClass;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

class EmailServiceTest {

    private final JavaMailSender mailSender = mock(JavaMailSender.class);
    private final EmailService emailService = new EmailService(mailSender, "no-reply@voyage.test");

    @Test
    void sendOtpEmailSendsVerificationMessageThroughMailSender() {
        emailService.sendOtpEmail("ali@example.com", "123456");

        var messageCaptor = forClass(SimpleMailMessage.class);
        verify(mailSender).send(messageCaptor.capture());

        SimpleMailMessage message = messageCaptor.getValue();
        assertThat(message.getFrom()).isEqualTo("no-reply@voyage.test");
        assertThat(message.getTo()).containsExactly("ali@example.com");
        assertThat(message.getSubject()).isEqualTo("Your Voyage verification code");
        assertThat(message.getText()).contains("123456", "10 minutes");
    }

    @Test
    void sendOtpEmailReportsSafeErrorWhenProviderFails() {
        doThrow(new MailSendException("smtp failed"))
                .when(mailSender)
                .send(org.mockito.ArgumentMatchers.any(SimpleMailMessage.class));

        assertThatThrownBy(() -> emailService.sendOtpEmail("ali@example.com", "123456"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Could not send verification email");
    }
}
