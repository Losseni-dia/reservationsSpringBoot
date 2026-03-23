package be.event.smartbooking.dto.importexport;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class ImportResult {
    private int imported;
    private int skipped;
    private List<String> errors;
}