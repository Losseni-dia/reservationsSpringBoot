package be.event.smartbooking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TranslationUsageDTO {
    private long charactersToday;
    private long charactersThisMonth;
    private long dailyLimit;
    private long monthlyLimit;
    private boolean translationAvailable;
}
