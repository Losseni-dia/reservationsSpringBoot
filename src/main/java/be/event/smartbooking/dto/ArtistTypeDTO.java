package be.event.smartbooking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArtistTypeDTO {
    private Long id; // L'ID de la relation (ex: 10)
    private String firstname;
    private String lastname;
    private String type; // Le rôle (ex: "Auteur")
}
