package be.event.smartbooking.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class TicketDetail {
    private Long id;
    private String qrCodeReference; // uniqueReference
    private String showTitle;
    private LocalDateTime date;
    private String locationName;
    private String category; // Le type de prix (VIP, Standard...)
    private double price;
}
