package be.event.smartbooking.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PriceDTO {
    private Long id;
    private String type; // TypePrice enum
    private Double amount;
}