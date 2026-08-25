package be.event.smartbooking.dto;

import lombok.Data;

@Data
public class LocalityDTO {
    private Long id;
    private Long postalCode;
    private String locality;
}