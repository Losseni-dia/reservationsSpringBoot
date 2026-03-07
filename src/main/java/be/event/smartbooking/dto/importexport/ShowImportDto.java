package be.event.smartbooking.dto.importexport;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ShowImportDto {

    @NotBlank(message = "Le champ 'title' est obligatoire")
    private String title;

    private String description;
    private String status;    // A_CONFIRMER | CONFIRME — optionnel, défaut A_CONFIRMER
    private String bookable;  // "true" | "false" — optionnel, défaut true
    private String locationName;
}
