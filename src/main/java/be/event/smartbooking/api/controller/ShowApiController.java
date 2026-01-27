package be.event.smartbooking.api.controller;

import be.event.smartbooking.dto.ArtistDTO;
import be.event.smartbooking.dto.PriceDTO;
import be.event.smartbooking.dto.RepresentationDTO;
import be.event.smartbooking.dto.ReviewDTO;
import be.event.smartbooking.dto.ShowCreateRequest;
import be.event.smartbooking.dto.ShowDTO;
import be.event.smartbooking.dto.ShowUpdateDTO;
import be.event.smartbooking.model.ArtistType;
import be.event.smartbooking.model.Price;
import be.event.smartbooking.model.Representation;
import be.event.smartbooking.model.Review;
import be.event.smartbooking.model.Show;
import be.event.smartbooking.repository.ArtistTypeRepos;
import be.event.smartbooking.repository.LocationRepos;
import be.event.smartbooking.service.FileService;
import be.event.smartbooking.service.ShowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;

@RestController
@RequestMapping("/api/shows")
public class ShowApiController {

        @Autowired
        private ShowService showService;

        @Autowired
        private LocationRepos locationRepos;

        @Autowired
        private ArtistTypeRepos artistTypeRepos;

        @Autowired
        private FileService fileService;



        /**
         * GET /api/shows : Récupère tous les spectacles
         */
        @GetMapping
        @Transactional(readOnly = true) // <--- ICI : Indispensable pour charger les relations (Lazy Loading)
        public ResponseEntity<List<ShowDTO>> getAll() {
                try {
                        List<Show> shows = showService.getAll();
                        List<ShowDTO> dtos = shows.stream()
                                        .map(this::safeConvertToDto)
                                        .collect(Collectors.toList());
                        return ResponseEntity.ok(dtos);
                } catch (Exception e) {
                        // En cas d'erreur, on logue précisément le problème
                        System.err.println("Erreur lors de la récupération des shows: " + e.getMessage());
                        e.printStackTrace();
                        // On renvoie une erreur 500 plutôt qu'une liste vide,
                        // comme ça tu verras l'erreur dans l'onglet "Network" du navigateur
                        return ResponseEntity.internalServerError().build();
                }
        }

        /**
         * GET /api/shows/{id} : Récupère un spectacle par son ID
         */
        @GetMapping("/{id}")
        @Transactional(readOnly = true)
        public ResponseEntity<ShowDTO> getById(@PathVariable Long id) {
                Show show = showService.get(id);
                if (show == null) {
                        return ResponseEntity.notFound().build();
                }
                return ResponseEntity.ok(safeConvertToDto(show));
        }
        
        /**
         * GET /api/shows/slug/{slug} : Récupère un spectacle par son slug
         * Utilisé pour les URLs du frontend (ex: /show/mon-spectacle)
         */
        @GetMapping("/slug/{slug}")
        @Transactional(readOnly = true)
        public ResponseEntity<ShowDTO> getBySlug(@PathVariable String slug) {
                try {
                        Show show = showService.findBySlug(slug); // Utilise votre service existant

                        if (show == null) {
                                return ResponseEntity.notFound().build();
                        }

                        return ResponseEntity.ok(safeConvertToDto(show)); // Utilise votre conversion sécurisée
                } catch (Exception e) {
                        e.printStackTrace();
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                }
        }

        /**
         * GET /api/shows/search?query=... : Recherche par titre (Issue #1)
         */
        @GetMapping("/search")
        @Transactional(readOnly = true)
        public ResponseEntity<List<ShowDTO>> search(
                        @RequestParam(required = false) String title,
                        @RequestParam(required = false) String location,
                        @RequestParam(required = false) LocalDateTime start,
                        @RequestParam(required = false) LocalDateTime end) {

                try {
                        // Appel au service avec les 3 paramètres
                        List<Show> shows = showService.search(title, location, start, end);

                        List<ShowDTO> dtos = shows.stream()
                                        .map(this::safeConvertToDto)
                                        .collect(Collectors.toList());

                        return ResponseEntity.ok(dtos);
                } catch (Exception e) {
                        e.printStackTrace();
                         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                }
        }
        /**
         * POST /api/shows : Crée un nouveau spectacle (Issue #3)
         */
        @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
        public ResponseEntity<ShowDTO> create(
                        @RequestPart("show") ShowCreateRequest request,
                        @RequestPart(value = "poster", required = false) MultipartFile file) {
                try {
                        // 1. On construit l'entité Show de base
                        Show show = Show.builder()
                                        .title(request.getTitle())
                                        .description(request.getDescription())
                                        .bookable(request.isBookable())
                                        .build();

                        // 2. On lie le lieu (Location)
                        if (request.getLocationId() != null) {
                                locationRepos.findById(request.getLocationId())
                                                .ifPresent(show::setLocation);
                        }

                        // 3. On lie les artistes (ManyToMany)
                        if (request.getArtistTypeIds() != null) {
                                // On récupère tous les objets ArtistType correspondants aux IDs
                                List<ArtistType> artists = artistTypeRepos.findAllById(request.getArtistTypeIds());

                                // On utilise ta méthode utilitaire pour chaque artiste
                                artists.forEach(show::addArtistType);
                        }

                        // 4. On gère l'image
                        if (file != null && !file.isEmpty()) {
                                String imageUrl = fileService.save(file);
                                show.setPosterUrl(imageUrl);
                        }

                        showService.add(show);
                        return new ResponseEntity<>(safeConvertToDto(show), HttpStatus.CREATED);
                } catch (Exception e) {
                        e.printStackTrace();
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
                }
        }

        /**
         * PUT /api/shows/{id} : Met à jour un spectacle existant
         */
        @PutMapping(value = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
        public ResponseEntity<ShowDTO> update(
                        @PathVariable Long id,
                        @RequestPart("show") ShowUpdateDTO request,
                        @RequestPart(value = "poster", required = false) MultipartFile file) {

                try { // <--- IL MANQUAIT CE BLOC TRY ICI
                      // 1. On récupère le spectacle existant
                        Show show = showService.get(id);
                        if (show == null) {
                                return ResponseEntity.notFound().build();
                        }

                        // 2. Mapping du DTO vers l'entité
                        show.setTitle(request.getTitle());
                        show.setDescription(request.getDescription());
                        show.setBookable(request.isBookable());

                        // 3. Gestion du lieu
                        if (request.getLocationId() != null) {
                                locationRepos.findById(request.getLocationId()).ifPresent(show::setLocation);
                        }

                        // 4. Gestion des artistes
                        show.getArtistTypes().clear();
                        if (request.getArtistTypeIds() != null) {
                                List<ArtistType> artists = artistTypeRepos.findAllById(request.getArtistTypeIds());
                                artists.forEach(show::addArtistType);
                        }

                        // 5. Gestion de l'image (IOException possible ici)
                        if (file != null && !file.isEmpty()) {
                                String imageUrl = fileService.save(file);
                                show.setPosterUrl(imageUrl);
                        }

                        // 6. Sauvegarde et retour
                        showService.update(id, show);
                        return ResponseEntity.ok(safeConvertToDto(show));

                } catch (IOException e) {
                        // Erreur spécifique au stockage du fichier
                        e.printStackTrace();
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                } catch (Exception e) {
                        // Erreur générale (Logique métier, IDs inexistants, etc.)
                        e.printStackTrace();
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
                }
        }
        /**
         * DELETE /api/shows/{id} : Supprime un spectacle
         */
        @DeleteMapping("/{id}")
        public ResponseEntity<Void> delete(@PathVariable Long id) {
                Show existingShow = showService.get(id);
                if (existingShow == null) {
                        return ResponseEntity.notFound().build();
                }
                showService.delete(id);
                return ResponseEntity.noContent().build();
        }

        /**
         * Transformation sécurisée de l'entité Show vers ShowDTO
         */
        private ShowDTO safeConvertToDto(Show show) {
                return ShowDTO.builder()
                                .id(show.getId())
                                .slug(show.getSlug())
                                .title(show.getTitle())
                                .description(show.getDescription())
                                .posterUrl(show.getPosterUrl())
                                .bookable(show.isBookable())

                                // --- DONNÉES POUR LE FORMULAIRE ---
                                .locationId(show.getLocation() != null ? show.getLocation().getId() : null)
                                .artistTypeIds(show.getArtistTypes() != null
                                                ? show.getArtistTypes().stream().map(at -> at.getId()).toList()
                                                : new ArrayList<>())
                                // ----------------------------------

                                .locationDesignation(show.getLocation() != null ? show.getLocation().getDesignation()
                                                : "Lieu non défini")
                                .averageRating(show.getAverageRating())
                                .reviewCount(show.getReviewCount())

                                .representations(show.getRepresentations() != null ? show.getRepresentations().stream()
                                                .map(rep -> convertRepToDto(rep, show.getTitle()))
                                                .toList() : new ArrayList<>())

                                  .reviews(show.getReviews() != null 
                                              ? show.getReviews().stream()
                                                        .filter(Review::getValidated)
                                                        .map(this::convertToReviewDTO)
                                                        .toList() 
                                                : new ArrayList<>())
                                .artists(show.getArtistTypes() != null ? show.getArtistTypes().stream()
                                                .collect(Collectors.groupingBy(
                                                                at -> at.getArtist(),
                                                                Collectors.mapping(at -> at.getType().getType(),
                                                                                Collectors.toList())))
                                                .entrySet().stream()
                                                .map(entry -> ArtistDTO.builder()
                                                                .id(entry.getKey().getId())
                                                                .firstname(entry.getKey().getFirstname())
                                                                .lastname(entry.getKey().getLastname())
                                                                .types(entry.getValue())
                                                                .build())
                                                .toList() : new ArrayList<>())
                                .build();
        }

        private RepresentationDTO convertRepToDto(Representation rep, String title) {
                String locationName = "Lieu non défini";

                // 1. On vérifie d'abord si la séance a un lieu spécifique
                if (rep.getLocation() != null) {
                        locationName = rep.getLocation().getDesignation();
                }
                // 2. Sinon, on se rabat sur le lieu par défaut du spectacle
                else if (rep.getShow() != null && rep.getShow().getLocation() != null) {
                        locationName = rep.getShow().getLocation().getDesignation();
                }

                return RepresentationDTO.builder()
                                .id(rep.getId())
                                .when(rep.getWhen())
                                .showTitle(title)
                                .locationName(locationName) // Utilise la logique de priorité
                                .prices(rep.getPrices() != null
                                                ? rep.getPrices().stream()
                                                                .map(this::convertPriceToDto)
                                                                .toList()
                                                : new ArrayList<>())
                                .build();
        }

        private ReviewDTO convertToReviewDTO(Review rev) {
                return ReviewDTO.builder()
                                .id(rev.getId())
                                .authorLogin(rev.getUser() != null ? rev.getUser().getFirstname() : "Anonyme")
                                .stars(rev.getStars())
                                .comment(rev.getComment())
                                .createdAt(rev.getCreatedAt())
                                
                                .build();
        }

        private PriceDTO convertPriceToDto(Price p) {
                return PriceDTO.builder()
                                .id(p.getId())
                                .type(p.getType().toString())
                                .amount(p.getAmount())
                                .build();
        }


        


       
}