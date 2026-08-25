package be.event.smartbooking.dto.externalApi;

import lombok.Data;
import java.util.List;

@Data
public class LocationApiResponse {
    private int total_count;
    private List<ExternalLocationDTO> results;
}