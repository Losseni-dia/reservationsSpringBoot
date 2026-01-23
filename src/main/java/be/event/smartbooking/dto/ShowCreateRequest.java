package be.event.smartbooking.dto;

import java.util.List;

import lombok.Data;

@Data
public class ShowCreateRequest {
    private String title;
    private String description;
    private Long locationId;
    private boolean bookable;
    private List<Long> artistTypeIds; // Liste des IDs des artistes/types sélectionnés
}