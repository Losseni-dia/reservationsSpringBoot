package be.event.smartbooking.service;

import be.event.smartbooking.model.RepresentationReservation;
import be.event.smartbooking.model.Reservation;
import be.event.smartbooking.model.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final MessageSource messageSource;

    @Value("${spring.application.frontend-url}")
    private String frontendUrl;

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    /** @deprecated Use {@link #sendPasswordResetMail(String, String, Locale)} with explicit locale */
    @Deprecated
    public void sendPasswordResetMail(String to, String token) {
        sendPasswordResetMail(to, token, Locale.FRENCH);
    }

    public void sendPasswordResetMail(String to, String token, Locale locale) {
        if (locale == null) locale = Locale.FRENCH;
        String url = frontendUrl + "/reset-password?token=" + token;
        Context ctx = new Context(locale);
        ctx.setVariable("resetUrl", url);

        String subject = messageSource.getMessage("email.passwordreset.subject", null, locale);
        String html = templateEngine.process("emails/password-reset", ctx);

        sendHtmlMail(to, subject, html);
    }

    public void sendRegistrationConfirmationMail(User user, Locale locale) {
        if (locale == null) locale = Locale.FRENCH;
        String firstName = user.getFirstname() != null ? user.getFirstname() : user.getLogin();

        Context ctx = new Context(locale);
        ctx.setVariable("firstName", firstName);

        String subject = messageSource.getMessage("email.register.subject", null, locale);
        String html = templateEngine.process("emails/registration-confirmation", ctx);

        sendHtmlMail(user.getEmail(), subject, html);
    }

    public void sendAccountActivatedMail(User user, Locale locale) {
        if (locale == null) locale = Locale.FRENCH;
        String firstName = user.getFirstname() != null ? user.getFirstname() : user.getLogin();

        Context ctx = new Context(locale);
        ctx.setVariable("firstName", firstName);
        ctx.setVariable("loginUrl", frontendUrl + "/login");

        String subject = messageSource.getMessage("email.activation.subject", null, locale);
        String html = templateEngine.process("emails/account-activated", ctx);

        sendHtmlMail(user.getEmail(), subject, html);
    }

    public void sendReservationSummaryMail(User user, Reservation reservation,
            List<RepresentationReservation> items, Locale locale) {
        if (locale == null) locale = Locale.FRENCH;
        String firstName = user.getFirstname() != null ? user.getFirstname() : user.getLogin();

        List<Map<String, Object>> emailItems = new ArrayList<>();
        double total = 0.0;

        for (RepresentationReservation rr : items) {
            double unitPrice = rr.getPrice().getAmount();
            int qty = rr.getQuantity();
            double lineTotal = unitPrice * qty;
            total += lineTotal;

            String dateStr = rr.getRepresentation().getWhen().format(DATE_FORMAT);
            String unitPriceStr = String.format(locale, "%.2f €", unitPrice);
            String lineTotalStr = String.format(locale, "%.2f €", lineTotal);

            emailItems.add(Map.of(
                    "showTitle", rr.getRepresentation().getShow().getTitle(),
                    "date", dateStr,
                    "unitPrice", unitPriceStr,
                    "quantity", qty,
                    "lineTotal", lineTotalStr));
        }

        String totalStr = String.format(locale, "%.2f €", total);

        Context ctx = new Context(locale);
        ctx.setVariable("firstName", firstName);
        ctx.setVariable("items", emailItems);
        ctx.setVariable("total", totalStr);

        String subject = messageSource.getMessage("email.reservation.subject", null, locale);
        String html = templateEngine.process("emails/reservation-summary", ctx);

        sendHtmlMail(user.getEmail(), subject, html);
    }

    private void sendHtmlMail(String to, String subject, String html) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            mailSender.send(message);
        } catch (MessagingException | MailException e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
            throw new RuntimeException("Échec de l'envoi de l'email à " + to, e);
        }
    }
}
