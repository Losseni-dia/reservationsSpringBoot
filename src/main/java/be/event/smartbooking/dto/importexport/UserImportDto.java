package be.event.smartbooking.dto.importexport;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserImportDto {

    @NotBlank(message = "Le champ 'login' est obligatoire")
    @Size(max = 50, message = "Le login ne doit pas dépasser 50 caractères")
    private String login;

    @NotBlank(message = "Le champ 'firstname' est obligatoire")
    private String firstname;

    @NotBlank(message = "Le champ 'lastname' est obligatoire")
    private String lastname;

    @NotBlank(message = "Le champ 'email' est obligatoire")
    @Email(message = "L'email n'est pas valide")
    private String email;

    @NotBlank(message = "Le champ 'password' est obligatoire")
    private String password;

    private String langue;
}
