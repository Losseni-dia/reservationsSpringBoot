package be.event.smartbooking.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

// ReservationItemRequest.java
public record ReservationItemRequest(
        Long representationId,
        Long priceId,

        @NotNull(message = "La quantité est obligatoire")
    @Min(1)
    @JsonProperty("places")
        Integer quantity) {
}