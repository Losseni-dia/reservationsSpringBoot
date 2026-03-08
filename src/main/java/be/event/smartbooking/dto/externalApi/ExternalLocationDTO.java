package be.event.smartbooking.dto.externalApi;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ExternalLocationDTO {

    // 'entite' contient le nom du Centre Culturel dans ce dataset
    @JsonProperty("entite")
    private String name;

    // 'adresse' pour la rue et le numéro
    @JsonProperty("adresse")
    private String street;

    // 'commune' ou 'localite' pour la ville
    @JsonProperty("commune")
    private String city;

    @JsonProperty("code_postal")
    private String zipCode;

    @JsonProperty("site_web")
    private String url;

    @JsonProperty("telephone")
    private String phone;
}