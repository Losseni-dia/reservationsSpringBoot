package be.event.smartbooking.model.enumeration;

public enum TypePrice {
    STANDARD("Standard"),
    VIP("VIP"),
    REDUIT("Réduit"),
    PREMIUM("Premium");

    private final String type;

    TypePrice(String type) {
        this.type = type;
    }

    public String getLabel() {
        return type;
    }
}