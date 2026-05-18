package be.event.smartbooking.model.enumeration;

public enum LanguageLevel {
    MATERNELLE("Langue maternelle"),
    DEBUTANT("Débutant"),
    INTERMEDIAIRE("Intermédiaire"),
    COURANT("Courant");

    private final String label;

    LanguageLevel(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
