package be.event.smartbooking.dto;

import lombok.Data;
import be.event.smartbooking.model.enumeration.TypePrice;
import jakarta.validation.Valid;
import jakarta.validation.constraints.FutureOrPresent;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

@Data
public class RepresentationRequest {

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    @FutureOrPresent(message = "La date de la séance ne peut pas être dans le passé") 
    private LocalDateTime when;

    private Long locationId;
    private List<PriceRequest> prices;

    @Data
    public static class PriceRequest {
        private TypePrice type;
        private Double amount;
    }
}