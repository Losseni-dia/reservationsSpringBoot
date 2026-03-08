package be.event.smartbooking.dto.externalApi;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExternalLocationDTO {

    // On utilise @JsonProperty si le nom dans le JSON est différent du nom Java
    @JsonProperty("venue_name")
    private String name;

    @JsonProperty("official_website")
    private String url;

    @JsonProperty("full_address")
    private String street;

    @JsonProperty("city_name")
    private String city;

    @JsonProperty("postal_code")
    private String zipCode;

    @JsonProperty("contact_phone")
    private String phone;
}