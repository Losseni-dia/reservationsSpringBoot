package be.event.smartbooking.service;

import be.event.smartbooking.model.Reservation;
import be.event.smartbooking.model.Role;
import be.event.smartbooking.model.Show;
import be.event.smartbooking.model.User;
import be.event.smartbooking.repository.ReservationRepository;
import be.event.smartbooking.repository.ShowRepos;
import be.event.smartbooking.repository.UserRepos;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.opencsv.CSVWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.StringWriter;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@RequiredArgsConstructor
public class ExportService {

    private final UserRepos userRepos;
    private final ShowRepos showRepos;
    private final ReservationRepository reservationRepos;

    // ===================================================================
    // EXPORT CSV
    // ===================================================================

    public String exportUsersCsv() throws IOException {
        List<User> users = StreamSupport
                .stream(userRepos.findAll().spliterator(), false)
                .collect(Collectors.toList());

        StringWriter sw = new StringWriter();
        try (CSVWriter writer = new CSVWriter(sw)) {
            writer.writeNext(new String[]{"id", "login", "firstname", "lastname", "email", "langue", "isActive", "createdAt"});
            for (User u : users) {
                writer.writeNext(new String[]{
                        String.valueOf(u.getId()),
                        u.getLogin(),
                        u.getFirstname(),
                        u.getLastname(),
                        u.getEmail(),
                        u.getLangue(),
                        String.valueOf(u.isActive()),
                        u.getCreatedAt() != null ? u.getCreatedAt().toString() : ""
                });
            }
        }
        return sw.toString();
    }

    public String exportShowsCsv() throws IOException {
        List<Show> shows = StreamSupport
                .stream(showRepos.findAll().spliterator(), false)
                .collect(Collectors.toList());
        // ✅ On utilise maintenant la méthode privée en bas du fichier
        return convertShowsToCsv(shows);
    }

    public String exportReservationsCsv() throws IOException {
        List<Reservation> reservations = StreamSupport
                .stream(reservationRepos.findAll().spliterator(), false)
                .collect(Collectors.toList());

        StringWriter sw = new StringWriter();
        try (CSVWriter writer = new CSVWriter(sw)) {
            writer.writeNext(new String[]{"id", "userLogin", "userEmail", "representationId", "showTitle", "statut", "reservationDate", "createdAt"});
            for (Reservation r : reservations) {
                String showTitle = "";
                if (r.getRepresentation() != null && r.getRepresentation().getShow() != null) {
                    showTitle = r.getRepresentation().getShow().getTitle();
                }
                writer.writeNext(new String[]{
                        String.valueOf(r.getId()),
                        r.getUser() != null ? r.getUser().getLogin() : "",
                        r.getUser() != null ? r.getUser().getEmail() : "",
                        r.getRepresentation() != null ? String.valueOf(r.getRepresentation().getId()) : "",
                        showTitle,
                        r.getStatut() != null ? r.getStatut().name() : "",
                        r.getReservationDate() != null ? r.getReservationDate().toString() : "",
                        r.getCreatedAt() != null ? r.getCreatedAt().toString() : ""
                });
            }
        }
        return sw.toString();
    }

    // ===================================================================
    // EXPORT JSON
    // ===================================================================

    private ObjectMapper buildObjectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return mapper;
    }

    public String exportUsersJson() throws IOException {
        List<User> users = StreamSupport
                .stream(userRepos.findAll().spliterator(), false)
                .collect(Collectors.toList());
        List<Map<String, Object>> projections = users.stream().map(u -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", u.getId());
            m.put("login", u.getLogin());
            m.put("firstname", u.getFirstname());
            m.put("lastname", u.getLastname());
            m.put("email", u.getEmail());
            m.put("langue", u.getLangue());
            m.put("isActive", u.isActive());
            m.put("createdAt", u.getCreatedAt() != null ? u.getCreatedAt().toString() : null);
            List<Role> roles = u.getRoles() != null ? u.getRoles() : Collections.emptyList();
            m.put("roles", roles.stream().map(Role::getRole).collect(Collectors.toList()));
            return m;
        }).collect(Collectors.toList());
        return buildObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(projections);
    }

    public String exportShowsJson() throws IOException {
        List<Show> shows = StreamSupport
                .stream(showRepos.findAll().spliterator(), false)
                .collect(Collectors.toList());
        // ✅ On utilise maintenant la méthode privée en bas du fichier
        return convertShowsToJson(shows);
    }
    
    // ===================================================================
    // LOGIQUE DE FILTRAGE PRODUCTEUR
    // ===================================================================

    public String exportShowsCsvForProducer(String login) throws IOException {
        // On récupère uniquement les spectacles du producteur
        List<Show> myShows = showRepos.findByUserLogin(login);
        return convertShowsToCsv(myShows); // Appelle la méthode privée ci-dessous
    }

    public String exportShowsJsonForProducer(String login) throws IOException {
        List<Show> myShows = showRepos.findByUserLogin(login);
        return convertShowsToJson(myShows); // Appelle la méthode privée ci-dessous
    }

    // ===================================================================
    // MÉTHODES DE CONVERSION PRIVÉES (Réutilisables)
    // ===================================================================

    private String convertShowsToCsv(List<Show> shows) throws IOException {
        StringWriter sw = new StringWriter();
        try (CSVWriter writer = new CSVWriter(sw)) {
            writer.writeNext(new String[] { "id", "title", "slug", "description", "status", "bookable", "location",
                    "createdAt" });
            for (Show s : shows) {
                writer.writeNext(new String[] {
                        String.valueOf(s.getId()),
                        s.getTitle(),
                        s.getSlug(),
                        s.getDescription(),
                        s.getStatus() != null ? s.getStatus().name() : "",
                        String.valueOf(s.isBookable()),
                        s.getLocation() != null ? s.getLocation().getDesignation() : "",
                        s.getCreatedAt() != null ? s.getCreatedAt().toString() : ""
                });
            }
        }
        return sw.toString();
    }

    private String convertShowsToJson(List<Show> shows) throws IOException {
        var projections = shows.stream().map(s -> new java.util.LinkedHashMap<String, Object>() {
            {
                put("id", s.getId());
                put("title", s.getTitle());
                put("slug", s.getSlug());
                put("description", s.getDescription());
                put("status", s.getStatus() != null ? s.getStatus().name() : null);
                put("bookable", s.isBookable());
                put("location", s.getLocation() != null ? s.getLocation().getDesignation() : null);
                put("createdAt", s.getCreatedAt() != null ? s.getCreatedAt().toString() : null);
            }
        }).collect(Collectors.toList());

        return buildObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(projections);
    }

    public String exportReservationsJson() throws IOException {
        List<Reservation> reservations = StreamSupport
                .stream(reservationRepos.findAll().spliterator(), false)
                .collect(Collectors.toList());
        List<Map<String, Object>> projections = reservations.stream().map(r -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", r.getId());
            m.put("userLogin", r.getUser() != null ? r.getUser().getLogin() : null);
            m.put("userEmail", r.getUser() != null ? r.getUser().getEmail() : null);
            m.put("representationId", r.getRepresentation() != null ? r.getRepresentation().getId() : null);
            m.put("showTitle", r.getRepresentation() != null && r.getRepresentation().getShow() != null
                    ? r.getRepresentation().getShow().getTitle() : null);
            m.put("statut", r.getStatut() != null ? r.getStatut().name() : null);
            m.put("reservationDate", r.getReservationDate() != null ? r.getReservationDate().toString() : null);
            m.put("createdAt", r.getCreatedAt() != null ? r.getCreatedAt().toString() : null);
            return m;
        }).collect(Collectors.toList());
        return buildObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(projections);
    }
}
