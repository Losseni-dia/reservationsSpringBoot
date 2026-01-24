package be.event.smartbooking.dto;

import lombok.Data;
import be.event.smartbooking.model.enumeration.TypePrice;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class RepresentationRequest {
    private LocalDateTime when;
    private Long locationId;
    private List<PriceRequest> prices;

    @Data
    public static class PriceRequest {
        private TypePrice type;
        private Double amount;
    }
}