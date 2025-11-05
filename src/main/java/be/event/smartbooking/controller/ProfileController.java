package be.event.smartbooking.controller;

import jakarta.validation.Valid;

import java.util.Arrays;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import be.event.smartbooking.dto.UserProfileDto;
import be.event.smartbooking.model.Language;
import be.event.smartbooking.model.User;
import be.event.smartbooking.model.Role;
import be.event.smartbooking.repository.UserRepos;
import be.event.smartbooking.service.UserService;

@Controller
public class ProfileController {

    private final UserRepos userRepository;
    private final UserService userService;

    public ProfileController(UserRepos userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    // Afficher la page de profil
    @GetMapping("/profile")
    public String showProfile(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String login = auth.getName();

        User user = userRepository.findByLogin(login);

        if (user == null) {
            throw new RuntimeException("Utilisateur introuvable");
        }

        // Conversion User → UserProfileDto
        UserProfileDto dto = new UserProfileDto();
        dto.setId(user.getId());
        dto.setFirstname(user.getFirstname());
        dto.setLastname(user.getLastname());
        dto.setEmail(user.getEmail());
        dto.setLangue(user.getLangue());
        dto.setLogin(user.getLogin());
        if (!user.getRoles().isEmpty()) {
            dto.setRole(user.getRoles().get(0).getRole());
        }


        // Conversion du code linguistique en nom de la langue
        Language userLanguage = Arrays.stream(Language.values())
                .filter(lang -> lang.toString().equals(user.getLangue().toUpperCase()))
                .findFirst().get();

        model.addAttribute("user_language", userLanguage != null ? userLanguage.getDescription() : "Inconnue");
        model.addAttribute("user", dto);
        return "authentication/profile";
    }

    // Enregistrer les modifications
    @PostMapping(value = "/profile", params = { "edit" })
    public String updateProfile(
            @Valid @ModelAttribute("user") UserProfileDto dto,
            BindingResult result, Model model, RedirectAttributes redirAttrs) {

        if (result.hasErrors()) {
            model.addAttribute("errorMessage", "Erreurs de validation !");
            return "authentication/profile";
        }

        // Appel du service pour gérer mot de passe, etc.
        userService.updateUserFromDto(dto);
        redirAttrs.addFlashAttribute("successMessage", "Profil mis à jour avec succès !");
        return "redirect:profile";
    }
}
