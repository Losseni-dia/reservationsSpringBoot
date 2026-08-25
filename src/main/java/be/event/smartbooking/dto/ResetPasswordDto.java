package be.event.smartbooking.dto;

import be.event.smartbooking.validation.StrongPassword;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResetPasswordDto {
    @NotBlank(message = "Le jeton de sécurité est manquant")
    private String token;

    @NotBlank(message = "Le nouveau mot de passe est obligatoire")
    @StrongPassword
    private String newPassword;
}
