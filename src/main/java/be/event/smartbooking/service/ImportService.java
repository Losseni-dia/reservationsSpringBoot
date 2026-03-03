package be.event.smartbooking.service;

import be.event.smartbooking.dto.importexport.ShowImportDto;
import be.event.smartbooking.dto.importexport.UserImportDto;
import be.event.smartbooking.dto.importexport.ImportResult;
import be.event.smartbooking.errorHandler.BusinessException;
import be.event.smartbooking.model.Show;
import be.event.smartbooking.model.User;
import be.event.smartbooking.model.Location;
import be.event.smartbooking.model.enumeration.ShowStatus;
import be.event.smartbooking.repository.ShowRepos;
import be.event.smartbooking.repository.UserRepos;
import be.event.smartbooking.repository.LocationRepos;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class ImportService {

    private final UserRepos userRepos;
    private final ShowRepos showRepos;
    private final LocationRepos locationRepos;
    private final PasswordEncoder passwordEncoder;
    private final Validator validator;

    // ===================================================================
    // IMPORT USERS
    // ===================================================================

    public ImportResult importUsers(MultipartFile file, String format) throws IOException, CsvException {
        if ("json".equalsIgnoreCase(format)) return importUsersFromJson(file);
        return importUsersFromCsv(file);
    }

    private ImportResult importUsersFromCsv(MultipartFile file) throws IOException, CsvException {
        List<String> errors = new ArrayList<>();
        int imported = 0, skipped = 0;

        try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            List<String[]> rows = reader.readAll();
            if (rows.isEmpty()) throw new BusinessException("Le fichier CSV est vide.", HttpStatus.BAD_REQUEST);

            String[] headers = rows.get(0);
            Map<String, Integer> colIndex = buildColumnIndex(headers);
            validateRequiredColumns(colIndex, new String[]{"login", "firstname", "lastname", "email", "password"});

            for (int i = 1; i < rows.size(); i++) {
                int lineNumber = i + 1;
                String[] row = rows.get(i);
                if (isBlankRow(row)) continue;

                UserImportDto dto = new UserImportDto();
                dto.setLogin(getCsvValue(row, colIndex, "login"));
                dto.setFirstname(getCsvValue(row, colIndex, "firstname"));
                dto.setLastname(getCsvValue(row, colIndex, "lastname"));
                dto.setEmail(getCsvValue(row, colIndex, "email"));
                dto.setPassword(getCsvValue(row, colIndex, "password"));
                dto.setLangue(getCsvValue(row, colIndex, "langue"));

                List<String> lineErrors = validate(dto);
                if (!lineErrors.isEmpty()) {
                    lineErrors.forEach(e -> errors.add("Ligne " + lineNumber + " : " + e));
                    continue;
                }

                if (userRepos.existsByLogin(dto.getLogin()) || userRepos.existsByEmail(dto.getEmail())) {
                    errors.add("Ligne " + lineNumber + " : Login ou email déjà existant — ignoré (" + dto.getLogin() + ")");
                    skipped++;
                    continue;
                }

                userRepos.save(User.builder()
                        .login(dto.getLogin()).firstname(dto.getFirstname())
                        .lastname(dto.getLastname()).email(dto.getEmail())
                        .password(passwordEncoder.encode(dto.getPassword()))
                        .langue(dto.getLangue()).isActive(true).build());
                imported++;
            }
        }
        return ImportResult.builder().imported(imported).skipped(skipped).errors(errors).build();
    }

    private ImportResult importUsersFromJson(MultipartFile file) throws IOException {
        List<String> errors = new ArrayList<>();
        int imported = 0, skipped = 0;
        List<UserImportDto> dtos = new ObjectMapper().readValue(file.getInputStream(), new TypeReference<>() {});

        for (int i = 0; i < dtos.size(); i++) {
            int n = i + 1;
            UserImportDto dto = dtos.get(i);
            List<String> entryErrors = validate(dto);
            if (!entryErrors.isEmpty()) { entryErrors.forEach(e -> errors.add("Entrée " + n + " : " + e)); continue; }
            if (userRepos.existsByLogin(dto.getLogin()) || userRepos.existsByEmail(dto.getEmail())) {
                errors.add("Entrée " + n + " : Login ou email déjà existant — ignoré (" + dto.getLogin() + ")");
                skipped++; continue;
            }
            userRepos.save(User.builder()
                    .login(dto.getLogin()).firstname(dto.getFirstname())
                    .lastname(dto.getLastname()).email(dto.getEmail())
                    .password(passwordEncoder.encode(dto.getPassword()))
                    .langue(dto.getLangue()).isActive(true).build());
            imported++;
        }
        return ImportResult.builder().imported(imported).skipped(skipped).errors(errors).build();
    }

    // ===================================================================
    // IMPORT SHOWS
    // ===================================================================

    public ImportResult importShows(MultipartFile file, String format) throws IOException, CsvException {
        if ("json".equalsIgnoreCase(format)) return importShowsFromJson(file);
        return importShowsFromCsv(file);
    }

    private ImportResult importShowsFromCsv(MultipartFile file) throws IOException, CsvException {
        List<String> errors = new ArrayList<>();
        int imported = 0, skipped = 0;

        try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            List<String[]> rows = reader.readAll();
            if (rows.isEmpty()) throw new BusinessException("Le fichier CSV est vide.", HttpStatus.BAD_REQUEST);

            Map<String, Integer> colIndex = buildColumnIndex(rows.get(0));
            validateRequiredColumns(colIndex, new String[]{"title"});

            for (int i = 1; i < rows.size(); i++) {
                int lineNumber = i + 1;
                String[] row = rows.get(i);
                if (isBlankRow(row)) continue;

                ShowImportDto dto = new ShowImportDto();
                dto.setTitle(getCsvValue(row, colIndex, "title"));
                dto.setDescription(getCsvValue(row, colIndex, "description"));
                dto.setStatus(getCsvValue(row, colIndex, "status"));
                dto.setBookable(getCsvValue(row, colIndex, "bookable"));
                dto.setLocationName(getCsvValue(row, colIndex, "locationName"));

                List<String> lineErrors = validate(dto);
                if (!lineErrors.isEmpty()) {
                    lineErrors.forEach(e -> errors.add("Ligne " + lineNumber + " : " + e)); continue;
                }
                if (showRepos.existsByTitle(dto.getTitle())) {
                    errors.add("Ligne " + lineNumber + " : Spectacle déjà existant — ignoré (\"" + dto.getTitle() + "\")");
                    skipped++; continue;
                }
                showRepos.save(buildShowFromDto(dto));
                imported++;
            }
        }
        return ImportResult.builder().imported(imported).skipped(skipped).errors(errors).build();
    }

    private ImportResult importShowsFromJson(MultipartFile file) throws IOException {
        List<String> errors = new ArrayList<>();
        int imported = 0, skipped = 0;
        List<ShowImportDto> dtos = new ObjectMapper().readValue(file.getInputStream(), new TypeReference<>() {});

        for (int i = 0; i < dtos.size(); i++) {
            int n = i + 1;
            ShowImportDto dto = dtos.get(i);
            List<String> entryErrors = validate(dto);
            if (!entryErrors.isEmpty()) { entryErrors.forEach(e -> errors.add("Entrée " + n + " : " + e)); continue; }
            if (showRepos.existsByTitle(dto.getTitle())) {
                errors.add("Entrée " + n + " : Spectacle déjà existant — ignoré (\"" + dto.getTitle() + "\")");
                skipped++; continue;
            }
            showRepos.save(buildShowFromDto(dto));
            imported++;
        }
        return ImportResult.builder().imported(imported).skipped(skipped).errors(errors).build();
    }

    // ===================================================================
    private Show buildShowFromDto(ShowImportDto dto) {
        ShowStatus status;
        try {
            status = (dto.getStatus() != null && !dto.getStatus().isBlank())
                    ? ShowStatus.valueOf(dto.getStatus().toUpperCase()) : ShowStatus.A_CONFIRMER;
        } catch (IllegalArgumentException e) { status = ShowStatus.A_CONFIRMER; }
        boolean bookable = dto.getBookable() == null || !"false".equalsIgnoreCase(dto.getBookable());
       
        Location location = null;
    if (dto.getLocationName() != null && !dto.getLocationName().isBlank()) {
        location = locationRepos.findByDesignation(dto.getLocationName());
    }
    
    return Show.builder()
            .title(dto.getTitle())
            .description(dto.getDescription())
            .status(status)
            .bookable(bookable)
            .location(location)
            .build();
}

    private Map<String, Integer> buildColumnIndex(String[] headers) {
        Map<String, Integer> map = new HashMap<>();
        for (int i = 0; i < headers.length; i++) map.put(headers[i].trim().toLowerCase(), i);
        return map;
    }

    private void validateRequiredColumns(Map<String, Integer> colIndex, String[] required) {
        List<String> missing = new ArrayList<>();
        for (String col : required) if (!colIndex.containsKey(col.toLowerCase())) missing.add(col);
        if (!missing.isEmpty())
            throw new BusinessException("Colonnes obligatoires manquantes : " + String.join(", ", missing), HttpStatus.BAD_REQUEST);
    }

    private String getCsvValue(String[] row, Map<String, Integer> colIndex, String colName) {
        Integer idx = colIndex.get(colName.toLowerCase());
        if (idx == null || idx >= row.length) return null;
        String val = row[idx];
        return (val == null || val.isBlank()) ? null : val.trim();
    }

    private boolean isBlankRow(String[] row) {
        if (row == null || row.length == 0) return true;
        for (String cell : row) if (cell != null && !cell.isBlank()) return false;
        return true;
    }

    private <T> List<String> validate(T dto) {
        Set<ConstraintViolation<T>> violations = validator.validate(dto);
        List<String> messages = new ArrayList<>();
        violations.forEach(v -> messages.add(v.getMessage()));
        return messages;
    }

    // Simple ImportResult DTO to avoid missing external dependency
    public static class ImportResult {
        private int imported;
        private int skipped;
        private List<String> errors;

        private ImportResult() { }

        public int getImported() { return imported; }
        public int getSkipped() { return skipped; }
        public List<String> getErrors() { return errors; }

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private final ImportResult instance = new ImportResult();

            public Builder imported(int imported) { instance.imported = imported; return this; }
            public Builder skipped(int skipped) { instance.skipped = skipped; return this; }
            public Builder errors(List<String> errors) { instance.errors = errors; return this; }
            public ImportResult build() { return instance; }
        }
    
}
}
