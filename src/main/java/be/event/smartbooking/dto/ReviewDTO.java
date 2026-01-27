package be.event.smartbooking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDTO {
    private Long id;
    private Long showId;
    private String authorLogin;
    private String comment;
    private Integer stars;
    private LocalDateTime createdAt;
}