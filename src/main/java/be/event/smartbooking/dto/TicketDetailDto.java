package be.event.smartbooking.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TicketDetailDto {
    private String category;
    private Integer quantity;

    
}
