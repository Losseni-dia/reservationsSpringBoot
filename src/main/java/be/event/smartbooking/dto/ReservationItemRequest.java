package be.event.smartbooking.dto;

// ReservationItemRequest.java
public record ReservationItemRequest(
        Long representationId,
        Long priceId,
        Integer quantity) {
}