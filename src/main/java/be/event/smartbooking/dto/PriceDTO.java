package be.event.smartbooking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PriceDTO {
    private Long id;
    private String type; // TypePrice enum
    private Double amount;
    private String startDate; // ISO string
    private String endDate; // ISO string, peut être null
}