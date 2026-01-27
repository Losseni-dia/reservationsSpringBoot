package be.event.smartbooking.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewStatsDTO {
    private long totalReviews;
    private long pendingReviews;
    private long validatedReviews;
    private Double globalAverage;
}