package be.event.smartbooking.dto.externalApi;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ExternalLocationDTO {
    // L'API utilise souvent ces noms de champs
    @JsonProperty("nom")
    private String name;

    @JsonProperty("site_web")
    private String url;

    @JsonProperty("adresse")
    private String street;

    @JsonProperty("localite")
    private String city;

    @JsonProperty("code_postal")
    private String zipCode;

    @JsonProperty("telephone")
    private String phone;
}