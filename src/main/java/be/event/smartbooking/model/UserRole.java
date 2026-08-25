package be.event.smartbooking.model;

public enum UserRole {
    ADMIN("admin"),
    MEMBER("membre"),
    AFFILIATE("affilié"),
    PRESS("presse"),
    PRODUCER("producteur");

    private String role;

    UserRole(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }

}
