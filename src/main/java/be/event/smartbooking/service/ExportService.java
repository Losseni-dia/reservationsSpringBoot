package be.event.smartbooking.service;

import be.event.smartbooking.model.Reservation;
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
import java.util.List;
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

        StringWriter sw = new StringWriter();
        try (CSVWriter writer = new CSVWriter(sw)) {
            writer.writeNext(new String[]{"id", "title", "slug", "description", "status", "bookable", "location", "createdAt"});
            for (Show s : shows) {
                writer.writeNext(new String[]{
                            String.valueOf(s.getId()),
                            s.getTitle(),
                            s.getSlug(),
                            s.getDescription(),
                            s.getStatus() != null ? s.getStatus().name() : "",
                            String.valueOf(s.isBookable()),
                            s.getLocation() != null ? s.getLocation().toString() : "",
                            s.getCreatedAt() != null ? s.getCreatedAt().toString() : ""
                    });
            }
        }
        return sw.toString();
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
        var projections = users.stream().map(u -> new java.util.LinkedHashMap<String, Object>() {{
            put("id", u.getId());
            put("login", u.getLogin());
            put("firstname", u.getFirstname());
            put("lastname", u.getLastname());
            put("email", u.getEmail());
            put("langue", u.getLangue());
            put("isActive", u.isActive());
            put("createdAt", u.getCreatedAt() != null ? u.getCreatedAt().toString() : null);
            put("roles", u.getRoles().stream().map(r -> r.getRole()).collect(Collectors.toList()));
        }}).collect(Collectors.toList());
        return buildObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(projections);
    }

    public String exportShowsJson() throws IOException {
        List<Show> shows = StreamSupport
                .stream(showRepos.findAll().spliterator(), false)
                .collect(Collectors.toList());
            var projections = shows.stream().map(s -> new java.util.LinkedHashMap<String, Object>() {{
            put("id", s.getId());
            put("title", s.getTitle());
            put("slug", s.getSlug());
            put("description", s.getDescription());
            put("status", s.getStatus() != null ? s.getStatus().name() : null);
            put("bookable", s.isBookable());
            put("location", s.getLocation() != null ? s.getLocation().toString() : null);
            put("createdAt", s.getCreatedAt() != null ? s.getCreatedAt().toString() : null);
        }}).collect(Collectors.toList());
        return buildObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(projections);
    }

    public String exportReservationsJson() throws IOException {
        List<Reservation> reservations = StreamSupport
                .stream(reservationRepos.findAll().spliterator(), false)
                .collect(Collectors.toList());
        var projections = reservations.stream().map(r -> new java.util.LinkedHashMap<String, Object>() {{
            put("id", r.getId());
            put("userLogin", r.getUser() != null ? r.getUser().getLogin() : null);
            put("userEmail", r.getUser() != null ? r.getUser().getEmail() : null);
            put("representationId", r.getRepresentation() != null ? r.getRepresentation().getId() : null);
            put("showTitle", r.getRepresentation() != null && r.getRepresentation().getShow() != null
                    ? r.getRepresentation().getShow().getTitle() : null);
            put("statut", r.getStatut() != null ? r.getStatut().name() : null);
            put("reservationDate", r.getReservationDate() != null ? r.getReservationDate().toString() : null);
            put("createdAt", r.getCreatedAt() != null ? r.getCreatedAt().toString() : null);
        }}).collect(Collectors.toList());
        return buildObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(projections);
    }
}
