package be.event.smartbooking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for the live translation API (e.g. POST /api/translation/translate).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LiveTranslateRequest {

    @NotBlank(message = "Text is required")
    @Size(max = 50000)
    private String text;

    @NotBlank(message = "Target language is required")
    @Size(min = 2, max = 5)
    private String targetLanguage;
}
