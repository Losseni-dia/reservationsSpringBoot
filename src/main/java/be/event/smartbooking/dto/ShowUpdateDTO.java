package be.event.smartbooking.dto;


import lombok.Data;
import java.util.List;

@Data
public class ShowUpdateDTO {
    private String title;
    private String description;
    private Long locationId;
    private List<Long> artistTypeIds;
    private boolean bookable;
}