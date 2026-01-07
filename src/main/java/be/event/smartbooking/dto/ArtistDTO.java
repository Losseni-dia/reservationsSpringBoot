package be.event.smartbooking.dto;

import lombok.Data;
import lombok.Builder; 
import lombok.NoArgsConstructor; 
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArtistDTO {
    private Long id;
    private String firstname;
    private String lastname;
    private List<String> types;
}