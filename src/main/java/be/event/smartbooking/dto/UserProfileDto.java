package be.event.smartbooking.dto;

import be.event.smartbooking.validation.PasswordMatches;
import be.event.smartbooking.validation.StrongPassword;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@PasswordMatches(message = "Les mots de passe ne correspondent pas")
public class UserProfileDto {

    private Long id;

    @NotBlank(message = "Le prénom est obligatoire")
    private String firstname;

    @NotBlank(message = "Le nom est obligatoire")
    private String lastname;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "L'email doit être valide")
    private String email;

    @NotBlank(message = "La langue est obligatoire")
    private String langue;

    private String login; // visible mais non modifiable
    private String role; // visible mais non modifiable

    @StrongPassword
    private String password; // nouveau mot de passe (optionnel)

    private String confirmPassword; // confirmation du mot de passe
}
