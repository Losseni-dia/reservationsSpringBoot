package be.event.smartbooking.controller;

import jakarta.validation.Valid;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import be.event.smartbooking.dto.UserRegistrationDto;
import be.event.smartbooking.model.User;
import be.event.smartbooking.service.EmailService;
import be.event.smartbooking.service.UserService;

import java.util.Locale;

@Controller
public class RegistrationController {

    private final UserService userService;
    private final EmailService emailService;

    public RegistrationController(UserService userService, EmailService emailService) {
        this.userService = userService;
        this.emailService = emailService;
    }

    @GetMapping("/register")
    public String showRegistrationForm(Model model) {
        model.addAttribute("user", new UserRegistrationDto());
        return "authentication/register";
    }

    @PostMapping("/register")
    public String registerUser(@Valid @ModelAttribute("user") UserRegistrationDto dto,
            BindingResult result, Model model, RedirectAttributes redirAttrs) {
        if (result.hasErrors()) {
            model.addAttribute("errorMessage", "Erreurs de validation !");
            return "authentication/register";
        }

        // Vérification de doublons
        if (!userService.isLoginAndEmailAvailable(dto.getLogin(), dto.getEmail())) {
            model.addAttribute("errorMessage", "Email ou login déjà utilisé !");
            return "authentication/register";
        }

        userService.registerFromDto(dto);
        User user = userService.findByLogin(dto.getLogin());
        Locale locale = (dto.getLangue() != null && !dto.getLangue().isBlank())
                ? Locale.forLanguageTag(dto.getLangue()) : Locale.FRENCH;
        emailService.sendRegistrationConfirmationMail(user, locale);
        redirAttrs.addFlashAttribute("successMessage", "Inscription réussie !");
        return "redirect:login";
    }
}
