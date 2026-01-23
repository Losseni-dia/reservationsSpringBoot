package be.event.smartbooking.dto;

import lombok.Data;

@Data
public class ShowCreateRequest {
    private String title;
    private String description;
    private Long locationId; // On envoie l'ID du lieu plutôt que l'objet complet
    private boolean bookable;
}