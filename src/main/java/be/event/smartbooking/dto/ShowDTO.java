package be.event.smartbooking.dto;



import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShowDTO {
    private Long id;
    private String slug;
    private String title;
    private String description;
    private String posterUrl;
    private boolean bookable;

    // Nouveaux champs pour les détails complets
    private Double averageRating; // Calculé via show.getAverageRating()
    private Long reviewCount; // Calculé via show.getReviewCount()
    private List<RepresentationDTO> representations; // Liste des dates
    private List<ReviewDTO> reviews; // Liste des avis
    private List<ArtistDTO> artists; // Liste des artistes associés

    private String locationDesignation; // Nom du lieu uniquement
    private String createdAt;
}