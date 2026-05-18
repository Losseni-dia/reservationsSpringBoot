package be.event.smartbooking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArtistLanguageRequest {

    @NotNull(message = "L'identifiant de la langue est obligatoire")
    private Long languageId;

    @NotBlank(message = "Le niveau de maîtrise est obligatoire")
    private String level; // Reçoit des chaînes comme "COURANT", "MATERNELLE", etc.
}