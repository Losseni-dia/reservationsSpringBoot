package be.event.smartbooking.dto;

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
    private String locationDesignation; // Nom du lieu uniquement
    private String createdAt;
}