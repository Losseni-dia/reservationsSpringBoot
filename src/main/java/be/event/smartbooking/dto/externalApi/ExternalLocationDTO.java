package be.event.smartbooking.dto.externalApi;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.Map;

@Data
public class ExternalLocationDTO {

    @JsonProperty("denomination") // C'était le "coupable" !
    private String name;

    @JsonProperty("rue")
    private String street;

    @JsonProperty("localite")
    private String city;

    @JsonProperty("code_postal")
    private String zipCode;

    @JsonProperty("site_web")
    private String url;

    @JsonProperty("courriel") // On peut aussi stocker l'email si besoin
    private String email;

    @JsonProperty("geolocalisation")
    private Map<String, Double> geolocation;
}