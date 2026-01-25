package be.event.smartbooking.dto;

import lombok.Data;
import be.event.smartbooking.model.enumeration.TypePrice;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

@Data
public class RepresentationRequest {
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime when;
    private Long locationId;
    private List<PriceRequest> prices;

    @Data
    public static class PriceRequest {
        private TypePrice type;
        private Double amount;
    }
}