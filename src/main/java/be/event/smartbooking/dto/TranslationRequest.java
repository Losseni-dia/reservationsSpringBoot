package be.event.smartbooking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TranslationRequest {

    @NotBlank(message = "Text is required")
    @Size(max = 50000)
    private String text;

    @NotBlank(message = "Target language is required")
    @Size(min = 2, max = 5)
    private String targetLang;

    @Size(min = 2, max = 5)
    private String sourceLang;
}
