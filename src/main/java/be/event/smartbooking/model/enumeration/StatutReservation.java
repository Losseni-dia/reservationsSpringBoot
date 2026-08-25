package be.event.smartbooking.model.enumeration;

public enum StatutReservation {
    CONFIRMED("CONFIRMEE"),
    PENDING("EN_ATTENTE"),
    CANCELLED("ANNULEE");

    private final String statut;

    StatutReservation(String statut) {
        this.statut = statut;
    }

    public String getStatut() {
        return statut;
    }
}