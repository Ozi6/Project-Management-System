package com.planwise.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    private final JavaMailSender mailSender;

    public void sendInvitationEmail(String to, String invitationLink) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject("Приглашение в проект");
            helper.setText(
                    String.format(
                            "<html><body>" +
                                    "<h2>Вы приглашены в проект</h2>" +
                                    "<p>Для принятия приглашения перейдите по ссылке:</p>" +
                                    "<p><a href='%s'>%s</a></p>" +
                                    "</body></html>",
                            invitationLink, invitationLink),
                    true);

            mailSender.send(message);
            log.info("Email sent successfully to: {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send email to: {}", to, e);
            throw new RuntimeException("Failed to send email", e);
        }
    }
}