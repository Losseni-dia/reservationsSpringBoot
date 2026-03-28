package be.event.smartbooking.api.controller;

import be.event.smartbooking.dto.importexport.ImportResult;
import be.event.smartbooking.service.ExportService;
import be.event.smartbooking.service.ImportService;
import com.opencsv.exceptions.CsvException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;

/**
 * REST controller exposing import/export endpoints for Admin use.
 *
 * Export: GET  /api/admin/export/{type}?format=csv|json
 * Import: POST /api/admin/import/{type}?format=csv|json  (multipart file)
 *
 * Supported types: users, shows, reservations
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Slf4j
public class ImportExportApiController {

    private final ExportService exportService;
    private final ImportService importService;

    // =========================================================================
    //  EXPORT
    // =========================================================================

    /**
     * GET /api/admin/export/{type}?format=csv|json
     *
     * @param type   one of: users, shows, reservations
     * @param format csv (default) or json
     */
    @GetMapping("/export/{type}")
    public ResponseEntity<byte[]> export(
            @PathVariable String type,
            @RequestParam(defaultValue = "csv") String format) {

        try {
            log.info("Demande d'export : type={}, format={}", type, format);

            String content = switch (type.toLowerCase()) {
                case "users" -> "csv".equalsIgnoreCase(format)
                        ? exportService.exportUsersCsv()
                        : exportService.exportUsersJson();
                case "shows" -> "csv".equalsIgnoreCase(format)
                        ? exportService.exportShowsCsv()
                        : exportService.exportShowsJson();
                 /*
                 * case "reservations" -> "csv".equalsIgnoreCase(format)
                 * ? exportService.exportReservationsCsv()
                 * : exportService.exportReservationsJson();
                 */
                default -> throw new IllegalArgumentException("Type non supporté : " + type);
            };

            // --- SÉCURITÉ : Vérifier si le contenu est vide ou null ---
            if (content == null || content.trim().isEmpty()) {
                log.warn("L'export pour {} est vide.", type);
                return ResponseEntity.noContent().build(); // Retourne un code 204 (Pas de contenu)
            }

            String extension = "json".equalsIgnoreCase(format) ? ".json" : ".csv";
            String mediaType = "json".equalsIgnoreCase(format)
                    ? MediaType.APPLICATION_JSON_VALUE
                    : "text/csv";
            String filename = type + "_export_" + LocalDate.now() + extension;

            byte[] bytes = content.getBytes(java.nio.charset.StandardCharsets.UTF_8);

            HttpHeaders headers = new HttpHeaders();
            // On s'assure que le charset est bien défini
            headers.setContentType(MediaType.parseMediaType(mediaType + ";charset=UTF-8"));
            headers.setContentDisposition(
                    ContentDisposition.attachment().filename(filename).build());
            headers.setContentLength(bytes.length);

            log.info("Export généré avec succès : {}", filename);
            return new ResponseEntity<>(bytes, headers, HttpStatus.OK);

        } catch (Exception e) {
            log.error("Erreur lors de l'export de {} : ", type, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // =========================================================================
    //  IMPORT
    // =========================================================================

    /**
     * POST /api/admin/import/{type}?format=csv|json
     * Body: multipart/form-data, field "file"
     *
     * @param type   one of: users, shows
     * @param format csv (default) or json
     * @param file   the uploaded file
     * @return ImportResult with counts and per-row errors
     */
    @PostMapping(value = "/import/{type}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImportResult> importData(
            @PathVariable String type,
            @RequestParam(defaultValue = "csv") String format,
            @RequestPart("file") MultipartFile file) throws IOException, CsvException {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        ImportResult result = switch (type.toLowerCase()) {
            case "users" -> importService.importUsers(file, format);
            case "shows" -> importService.importShows(file, format);
            default -> throw new IllegalArgumentException("Type non supporté : " + type);
        };

        return ResponseEntity.ok(result);
    }
}