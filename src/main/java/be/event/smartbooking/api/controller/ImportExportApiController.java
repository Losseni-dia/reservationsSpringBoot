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
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCER')") // 🔓 On ouvre aux deux
    public ResponseEntity<byte[]> export(
            @PathVariable String type,
            @RequestParam(defaultValue = "csv") String format,
            java.security.Principal principal, // 👤 On récupère l'utilisateur
            org.springframework.security.core.Authentication auth) {

        try {
            // Vérification des droits : Un producteur ne peut exporter que ses "shows"
            boolean isAdmin = auth.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

            if (!isAdmin && !"shows".equalsIgnoreCase(type)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            String content;
            String login = principal.getName();

            // Logique de choix du service
            if ("shows".equalsIgnoreCase(type)) {
                if (isAdmin) {
                    // L'admin voit TOUT
                    content = "csv".equalsIgnoreCase(format)
                            ? exportService.exportShowsCsv()
                            : exportService.exportShowsJson();
                } else {
                    // Le producteur ne voit que les SIENS 🚀
                    content = "csv".equalsIgnoreCase(format)
                            ? exportService.exportShowsCsvForProducer(login)
                            : exportService.exportShowsJsonForProducer(login);
                }
            } else if ("users".equalsIgnoreCase(type) && isAdmin) {
                content = "csv".equalsIgnoreCase(format)
                        ? exportService.exportUsersCsv()
                        : exportService.exportUsersJson();
            } else {
                throw new IllegalArgumentException("Type non supporté ou droits insuffisants");
            }

            // --- Le reste de ton code pour générer le fichier reste identique ---
            if (content == null || content.trim().isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            String extension = "json".equalsIgnoreCase(format) ? ".json" : ".csv";
            String filename = (isAdmin ? "admin_" : "my_") + type + "_" + LocalDate.now() + extension;
            byte[] bytes = content.getBytes(java.nio.charset.StandardCharsets.UTF_8);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(
                    "json".equalsIgnoreCase(format) ? "application/json" : "text/csv" + ";charset=UTF-8"));
            headers.setContentDisposition(ContentDisposition.attachment().filename(filename).build());

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