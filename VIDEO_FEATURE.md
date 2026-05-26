# Fonctionnalité Vidéo — SmartBooking

> **Projet** : SmartBooking — Gestion de réservations de spectacles  
> **Stack** : Spring Boot 3.4.3 · React 19 · MySQL · Flyway

---

## Vue d'ensemble

Une **vidéo** est un lien (YouTube, Vimeo, etc.) associé à un spectacle.  
- Un spectacle peut avoir **zéro ou plusieurs vidéos**  
- Une vidéo appartient à **un seul spectacle**  
- → Relation **Many-to-One** depuis Video (FK `show_id` dans la table `videos`)

**Fonctionnalités implémentées :**
| ID | Acteur | Description |
|----|--------|-------------|
| F1 | Utilisateur | Voir les vidéos d'un spectacle sur sa page de détail |
| F2 | Utilisateur | Rechercher toutes les vidéos liées à un artiste (par nom de famille) |
| A1 | Administrateur | Ajouter une vidéo à un spectacle |

---

## 1. Base de données (Flyway)

### Table `videos`
**Fichier :** `V20_1__create_videos_table.sql`

```sql
CREATE TABLE `videos` (
    `id`        BIGINT       NOT NULL AUTO_INCREMENT,
    `title`     VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `video_url` VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
    `show_id`   BIGINT       NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `videos` ADD KEY `IDX_videos_show_id` (`show_id`);

ALTER TABLE `videos`
  ADD CONSTRAINT `FK_videos_show_id`
    FOREIGN KEY (`show_id`) REFERENCES `shows` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT;
```

> **Contraintes :** `video_url` est UNIQUE (une même URL ne peut être ajoutée qu'une fois).  
> CASCADE en mise à jour, RESTRICT en suppression (on ne peut pas supprimer un spectacle qui a des vidéos).

### Données de test
**Fichier :** `V20_2__insert_videos.sql`

```sql
INSERT INTO `videos` (`id`, `title`, `video_url`, `show_id`) VALUES
(1, 'Bande-annonce Ayiti',         'https://www.youtube.com/embed/...', 1),
(2, 'Extrait Ayiti – Scène 1',     'https://www.youtube.com/embed/...', 1),
(3, 'Teaser Cible mouvante',       'https://www.youtube.com/embed/...', 2),
(4, 'Interview metteur en scène',  'https://www.youtube.com/embed/...', 3);
```

---

## 2. Backend — Java / Spring Boot

### Entité `Video`
**Fichier :** `src/main/java/be/event/smartbooking/model/Video.java`

```java
@Data @NoArgsConstructor @AllArgsConstructor @Builder
@Entity @Table(name = "videos")
public class Video {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "video_url", nullable = false, unique = true)
    private String videoUrl;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "show_id", nullable = false)
    private Show show;
}
```

### Modification de `Show`
**Fichier :** `src/main/java/be/event/smartbooking/model/Show.java`

```java
@Builder.Default
@OneToMany(mappedBy = "show", cascade = CascadeType.ALL, orphanRemoval = true)
@JsonManagedReference
@ToString.Exclude
@EqualsAndHashCode.Exclude
private List<Video> videos = new ArrayList<>();
```

> `Show` est le **côté inverse** (`mappedBy="show"`).  
> `Video` est le **propriétaire** de la relation (il porte `@JoinColumn`).  
> `@JsonBackReference` sur Video évite la boucle infinie JSON.  
> `@Builder.Default` est requis pour la compatibilité avec le Builder Lombok.

### Repository
**Fichier :** `src/main/java/be/event/smartbooking/repository/VideoRepository.java`

```java
public interface VideoRepository extends JpaRepository<Video, Long> {

    // Toutes les vidéos d'un spectacle
    List<Video> findByShowId(Long showId);

    // Route personnalisée : vidéos des spectacles d'un artiste par nom de famille
    @Query("SELECT v FROM Video v " +
           "JOIN v.show s " +
           "JOIN s.artistTypes at " +
           "JOIN at.artist a " +
           "WHERE LOWER(a.lastname) = LOWER(:lastname)")
    List<Video> findVideosByArtistLastname(@Param("lastname") String lastname);
}
```

> La requête JPQL remonte la chaîne : `Video → Show → ArtistType → Artist`.

### Service
**Fichier :** `src/main/java/be/event/smartbooking/service/VideoService.java`

```java
@Transactional(readOnly = true)
public List<Video> getByShow(Long showId) {
    return videoRepository.findByShowId(showId);
}

@Transactional
public Video addVideoToShow(Long showId, String title, String videoUrl) {
    Show show = showRepository.findById(showId)
            .orElseThrow(() -> new BusinessException("Spectacle introuvable", HttpStatus.NOT_FOUND));
    Video video = Video.builder().title(title).videoUrl(videoUrl).show(show).build();
    return videoRepository.save(video);
}

@Transactional(readOnly = true)
public List<Video> getVideosByArtistLastname(String lastname) {
    return videoRepository.findVideosByArtistLastname(lastname);
}
```

### DTO
**Fichier :** `src/main/java/be/event/smartbooking/dto/VideoDTO.java`

```java
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class VideoDTO {
    private Long id;
    private String title;
    private String videoUrl;
    private Long showId;
    private String showTitle;
}
```

### Contrôleur REST
**Fichier :** `src/main/java/be/event/smartbooking/api/controller/VideoApiController.java`

| Méthode | URL | Accès | Description |
|---------|-----|-------|-------------|
| `GET` | `/api/videos/show/{showId}` | Public | Vidéos d'un spectacle |
| `POST` | `/api/videos/show/{showId}` | **ADMIN** | Ajoute une vidéo à un spectacle |
| `GET` | `/api/videos/by-artist/{lastname}` | Public | Vidéos liées à un artiste |

**Body du POST :**
```json
{
  "title": "Bande-annonce",
  "videoUrl": "https://www.youtube.com/embed/..."
}
```

**Réponse GET `/api/videos/by-artist/{lastname}` :**
```json
{
  "artist": "Dupont",
  "total": 2,
  "videos": [
    { "id": 1, "title": "Bande-annonce Ayiti", "videoUrl": "https://...", "showId": 1, "showTitle": "Ayiti" },
    { "id": 2, "title": "Extrait Ayiti – Scène 1", "videoUrl": "https://...", "showId": 1, "showTitle": "Ayiti" }
  ]
}
```

### Modification de `ShowDTO`
**Fichier :** `src/main/java/be/event/smartbooking/dto/ShowDTO.java`

```java
private List<VideoDTO> videos;
```

Le champ est alimenté dans `safeConvertToDto()` de `ShowApiController` :

```java
.videos(show.getVideos() != null
    ? show.getVideos().stream()
        .map(v -> VideoDTO.builder()
            .id(v.getId())
            .title(v.getTitle())
            .videoUrl(v.getVideoUrl())
            .showId(show.getId())
            .showTitle(title)
            .build())
        .toList()
    : new ArrayList<>())
```

### Sécurité (`SpringSecurityConfig`)
```java
// Lecture publique
.requestMatchers(HttpMethod.GET, "/api/videos/**").permitAll()

// Écriture réservée à l'ADMIN
.requestMatchers(HttpMethod.POST, "/api/videos/**").hasAnyRole("admin", "ADMIN")
```

La méthode `addToShow` porte également `@PreAuthorize("hasAnyRole('ADMIN', 'admin')")` (double sécurité).

---

## 3. Frontend — React / TypeScript

### Type (`models.ts`)
```typescript
export interface Video {
  id: number;
  title: string;
  videoUrl: string;
  showId: number;
  showTitle?: string;
}
```

Ajout dans l'interface `Show` :
```typescript
videos?: Video[];
```

### API client (`api.ts`)
```typescript
export const videoApi = {
  getByShow: async (showId: number): Promise<Video[]> => {
    const res = await secureFetch(`/api/videos/show/${showId}`);
    return res.json();
  },
  addToShow: async (showId: number, title: string, videoUrl: string): Promise<Video> => {
    const res = await secureFetch(`/api/videos/show/${showId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, videoUrl }),
    });
    return res.json();
  },
  getByArtist: async (lastname: string): Promise<{ artist: string; total: number; videos: Video[] }> => {
    const res = await secureFetch(`/api/videos/by-artist/${encodeURIComponent(lastname)}`);
    return res.json();
  },
};
```

### Page `ShowDetails`
**Fichier :** `frontend/src/pages/show/showDetails/ShowDetails.tsx`

Section ajoutée après les mots-clés (tags) :

**Affichage — visible par tous :**
- Liste des vidéos sous forme de liens cliquables `▶ Titre` (ouvrent dans un nouvel onglet)
- Texte *"Aucune vidéo pour ce spectacle."* si la liste est vide

**Formulaire ajout — visible uniquement si `isAdmin` :**
- Champ texte pour le **titre** (max 100 caractères)
- Champ URL pour le **lien vidéo**
- Message de succès (vert) / erreur (rouge) après soumission
- Rechargement automatique de la page après succès

```typescript
const handleSubmitVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    await videoApi.addToShow(data.id, newVideoTitle.trim(), newVideoUrl.trim());
    loadData(); // Recharge pour afficher la nouvelle vidéo
};
```

### Page `VideosByArtist`
**Fichier :** `frontend/src/pages/video/VideosByArtist.tsx`

Page de recherche accessible via `/videos/by-artist/:lastname` :

- Champ de saisie du **nom de famille** de l'artiste
- Appel `GET /api/videos/by-artist/{lastname}` au submit
- Affichage du nombre de résultats et liste des vidéos :
  - Lien cliquable `▶ Titre` (nouvel onglet)
  - Nom du spectacle associé en sous-titre

---

## 4. Résumé des fichiers créés / modifiés

### Fichiers créés
| Fichier | Description |
|---------|-------------|
| `db/migration/V20_1__create_videos_table.sql` | Table `videos` + FK + index |
| `db/migration/V20_2__insert_videos.sql` | 4 vidéos de test |
| `model/Video.java` | Entité JPA |
| `repository/VideoRepository.java` | Repository Spring Data + requête JPQL custom |
| `service/VideoService.java` | Logique métier |
| `dto/VideoDTO.java` | DTO de transfert |
| `api/controller/VideoApiController.java` | Endpoints REST |
| `frontend/.../video/VideosByArtist.tsx` | Page de recherche par artiste |

### Fichiers modifiés
| Fichier | Modification |
|---------|-------------|
| `model/Show.java` | Ajout `@OneToMany List<Video> videos` avec `@Builder.Default` |
| `dto/ShowDTO.java` | Ajout `List<VideoDTO> videos` |
| `api/controller/ShowApiController.java` | `safeConvertToDto()` inclut le champ `videos` + import `VideoDTO` |
| `config/SpringSecurityConfig.java` | Règles sécurité pour `/api/videos/**` |
| `frontend/types/models.ts` | Interface `Video` + `videos?: Video[]` dans `Show` |
| `frontend/services/api.ts` | `videoApi` (import `Video` + 3 méthodes) |
| `frontend/.../ShowDetails.tsx` | Section vidéos (liste + formulaire admin) |
| `frontend/App.tsx` | Route `/videos/by-artist/:lastname` + import `VideosByArtist` |
