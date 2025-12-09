package be.event.smartbooking.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import java.util.Arrays;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import be.event.smartbooking.dto.UserProfileDto;
import be.event.smartbooking.model.Language;
import be.event.smartbooking.model.User;
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

        @DeleteMapping("/profile/delete")
    public String deleteAccount(HttpServletRequest request, HttpServletResponse response,
        RedirectAttributes redirAttrs) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String login = auth.getName();

        if (request.isUserInRole("ADMIN")) {
            redirAttrs.addFlashAttribute("errorMessage", "Pas de suppression de son propre compte admin !");
            return "redirect:/profile";
        }

        // Supprimer l'utilisateur courant
        userService.deleteByLogin(login);

        // Invalider la session HTTP (déconnecte l'utilisateur)
        /* Solution 1
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        */

        // Variante plus Spring-Security "propre" (Solution 2)
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }

        // Effacer le contexte de sécurité
        SecurityContextHolder.clearContext();

        redirAttrs.addFlashAttribute("successMessage", "Votre compte a été supprimé avec succès.");
        return "redirect:/";
    }

}
