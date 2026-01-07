package be.event.smartbooking.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class RepresentationDTO {
    private Long id;
    private LocalDateTime when;
    private String showTitle;
    private String locationName;
    private List<PriceDTO> prices; // Ajout crucial pour le choix du tarif
}