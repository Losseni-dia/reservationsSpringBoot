package be.event.smartbooking.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class ShowDetailsDTO {
    private ShowDTO show; // Les infos de base (titre, image, slug)
    private List<RepresentationDTO> representations; // Les dates et les prix
}