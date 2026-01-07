package be.event.smartbooking.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ReviewDTO {
    private Long id;
    private String authorLogin;
    private String comment;
    private Integer stars;
    private LocalDateTime createdAt;
}