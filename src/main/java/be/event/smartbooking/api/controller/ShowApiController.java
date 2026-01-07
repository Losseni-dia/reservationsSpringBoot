package be.event.smartbooking.api.controller;

import be.event.smartbooking.dto.PriceDTO;
import be.event.smartbooking.dto.RepresentationDTO;
import be.event.smartbooking.dto.ShowDTO;
import be.event.smartbooking.dto.ShowDetailsDTO;
import be.event.smartbooking.model.Show;
import be.event.smartbooking.service.ShowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/shows")
@CrossOrigin(origins = "http://localhost:3000")
public class ShowApiController {

    @Autowired
    private ShowService showService;

    @GetMapping
    public List<ShowDTO> getAll() {
        return showService.getAll().stream()
                .map(this::convertToDto) // Appel de la méthode de base
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ShowDTO getOne(@PathVariable Long id) {
        Show show = showService.get(id);
        return (show != null) ? convertToDto(show) : null;
    }

    @GetMapping("/details/{slug}")
    public ResponseEntity<?> getDetails(@PathVariable String slug) {
            Show show = showService.findBySlug(slug);

            if (show == null) {
                    return ResponseEntity.notFound().build();
            }

            // 1. Mapper le Show
            ShowDTO showDto = ShowDTO.builder()
                            .id(show.getId())
                            .title(show.getTitle())
                            .description(show.getDescription())
                            .posterUrl(show.getPosterUrl())
                            .slug(show.getSlug())
                            .bookable(show.isBookable())
                            .locationDesignation(show.getLocation() != null ? show.getLocation().getDesignation()
                                            : "Lieu non défini")
                            .build();

            // 2. Mapper les Représentations
            List<RepresentationDTO> representationDtos = show.getRepresentations().stream()
                            .<RepresentationDTO>map(rep -> {

                                    // Mapping des prix pour React
                                    List<PriceDTO> priceDtos = rep.getPrices().stream()
                                                    .map(p -> PriceDTO.builder()
                                                                    .id(p.getId())
                                                                    .type(p.getType().name())
                                                                    .amount(p.getAmount())
                                                                    .build())
                                                    .collect(Collectors.toList());

                                    // Utilisation des noms de méthodes générés par ton DTO (showTitle,
                                    // locationName, prices)
                                    return RepresentationDTO.builder()
                                                    .id(rep.getId())
                                                    .when(rep.getWhen())
                                                    .showTitle(show.getTitle())
                                                    .prices(priceDtos)
                                                    .locationName(rep.getLocation() != null
                                                                    ? rep.getLocation().getDesignation()
                                                                    : "Salle standard")
                                                    .build();
                            })
                            .collect(Collectors.toList());

            // 3. Construction du DTO final
            ShowDetailsDTO detailsDto = ShowDetailsDTO.builder()
                            .show(showDto)
                            .representations(representationDtos)
                            .build();

            return ResponseEntity.ok(detailsDto);
    }

    // --- MÉTHODES DE CONVERSION (MAPPERS) ---

    // 1. Méthode pour le DTO simple (Liste)
    private ShowDTO convertToDto(Show show) {
        return ShowDTO.builder()
                .id(show.getId())
                .slug(show.getSlug())
                .title(show.getTitle())
                .description(show.getDescription())
                .posterUrl(show.getPosterUrl())
                .bookable(show.isBookable())
                .locationDesignation(show.getLocation() != null ? show.getLocation().getDesignation() : "Lieu inconnu")
                .build();
    }

    // 2. Méthode pour le DTO détaillé (Page de détails)
    private ShowDetailsDTO convertToDetailsDto(Show show) {
        return ShowDetailsDTO.builder()
                .show(convertToDto(show)) // Utilisation de la méthode définie juste au-dessus
                .representations(show.getRepresentations().stream()
                        .map(rep -> RepresentationDTO.builder()
                                .id(rep.getId())
                                .when(rep.getWhen())
                                .showTitle(show.getTitle())
                                .locationName(rep.getLocation() != null ? rep.getLocation().getDesignation()
                                        : "Lieu par défaut")
                                .prices(rep.getPrices().stream()
                                        .map(p -> PriceDTO.builder()
                                                .id(p.getId())
                                                .type(p.getType().toString())
                                                .amount(p.getAmount())
                                                .build())
                                        .collect(Collectors.toList()))
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}