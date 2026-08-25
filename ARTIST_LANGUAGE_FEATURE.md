# Fonctionnalité Artist Language (Langues des artistes) — SmartBooking

> **Projet** : SmartBooking — Gestion de réservations de spectacles  
> **Stack** : Spring Boot 3.4.3 · React 19 · MySQL · Flyway

---

## Vue d'ensemble

Un **artist_language** représente la maîtrise d'une langue par un artiste.  
- Un artiste peut parler **zéro ou plusieurs langues**  
- Chaque association artiste-langue inclut un **niveau de maîtrise**  
- → Relation **One-to-Many** (un artiste → plusieurs `ArtistLanguage`)

**Règle métier importante :**  
> Seuls les artistes de type **"comédien"** peuvent avoir des compétences linguistiques.

**Fonctionnalités implémentées :**
| ID | Acteur | Description |
|----|--------|-------------|
| F1 | Utilisateur connecté | Voir les langues d'un artiste comédien |
| A1 | Administrateur | Ajouter une langue à un artiste comédien |
| F2 | Public | Trouver les artistes parlant couramment une langue (route personnalisée) |

---

## 1. Base de données

> **Note :** Les tables `languages` et `artist_language` sont gérées par Hibernate (auto-DDL) ou à créer manuellement. Aucun fichier Flyway dédié n'existe pour cette fonctionnalité — à prévoir si nécessaire.

### Table `languages`
```sql
CREATE TABLE `languages` (
  `id`       BIGINT      NOT NULL AUTO_INCREMENT,
  `language` VARCHAR(255) NOT NULL UNIQUE,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

Données à insérer :
```sql
INSERT INTO `languages` (`language`) VALUES
('Français'), ('English'), ('Nederlands');
```

### Table `artist_language`
```sql
CREATE TABLE `artist_language` (
  `id`          BIGINT      NOT NULL AUTO_INCREMENT,
  `artist_id`   BIGINT      NOT NULL,
  `language_id` BIGINT      NOT NULL,
  `level`       VARCHAR(20) NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_al_artist   FOREIGN KEY (artist_id)   REFERENCES artists(id),
  CONSTRAINT fk_al_language FOREIGN KEY (language_id) REFERENCES languages(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 2. Backend — Java / Spring Boot

### Enum `LanguageLevel`
**Fichier :** `src/main/java/be/event/smartbooking/model/enumeration/LanguageLevel.java`

```java
public enum LanguageLevel {
    MATERNELLE("Langue maternelle"),
    DEBUTANT("Débutant"),
    INTERMEDIAIRE("Intermédiaire"),
    COURANT("Courant");

    private final String label;

    LanguageLevel(String label) { this.label = label; }
    public String getLabel() { return label; }
}
```

> `getLabel()` retourne le libellé affiché en français côté frontend.

### Entité `Language`
**Fichier :** `src/main/java/be/event/smartbooking/model/Language.java`

```java
@Data @NoArgsConstructor
@Entity @Table(name = "languages")
public class Language {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String language; // ex: "Français", "English", "Nederlands"
}
```

### Entité `ArtistLanguage`
**Fichier :** `src/main/java/be/event/smartbooking/model/ArtistLanguage.java`

```java
@Data @NoArgsConstructor @AllArgsConstructor @Builder
@Entity @Table(name = "artist_language")
public class ArtistLanguage {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "artist_id", nullable = false)
    private Artist artist;

    @ManyToOne
    @JoinColumn(name = "language_id", nullable = false)
    private Language language;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LanguageLevel level;
}
```

> La relation est **unidirectionnelle** depuis `ArtistLanguage` vers `Artist`.  
> L'entité `Artist` ne porte pas de `@OneToMany` vers `ArtistLanguage` — les langues se récupèrent via le repository.

### Repositories

**`LanguageRepository`** — `src/.../repository/LanguageRepository.java`
```java
public interface LanguageRepository extends JpaRepository<Language, Long> {
    Optional<Language> findByLanguageIgnoreCase(String language);
}
```

**`ArtistLanguageRepository`** — `src/.../repository/ArtistLanguageRepository.java`
```java
public interface ArtistLanguageRepository extends JpaRepository<ArtistLanguage, Long> {

    // Toutes les langues d'un artiste donné
    List<ArtistLanguage> findByArtistId(Long artistId);

    // Artistes parlant une langue à un niveau précis (requête JPQL)
    @Query("SELECT al.artist FROM ArtistLanguage al " +
           "WHERE LOWER(al.language.language) = LOWER(:languageName) " +
           "AND al.level = :level")
    List<Artist> findArtistsByLanguageAndLevel(
            @Param("languageName") String languageName,
            @Param("level") LanguageLevel level);
}
```

### Service `ArtistService`
**Fichier :** `src/main/java/be/event/smartbooking/service/ArtistService.java`

Méthode liée aux langues :
```java
@Transactional(readOnly = true)
public List<Artist> findFluentArtistsByLanguage(String languageName) {
    if (languageName == null || languageName.isBlank()) return List.of();

    // Fixé au niveau COURANT par le cahier des charges
    return artistLanguageRepository.findArtistsByLanguageAndLevel(
        languageName.trim(),
        LanguageLevel.COURANT
    );
}
```

> **Règle métier :** la recherche par langue est toujours filtrée au niveau `COURANT` (Fluent). Les autres niveaux ne sont pas exposés via cette route.

### DTO `ArtistLanguageRequest`
**Fichier :** `src/main/java/be/event/smartbooking/dto/ArtistLanguageRequest.java`

```java
@Data @NoArgsConstructor @AllArgsConstructor
public class ArtistLanguageRequest {
    @NotNull(message = "L'identifiant de la langue est obligatoire")
    private Long languageId;

    @NotBlank(message = "Le niveau de maîtrise est obligatoire")
    private String level; // "COURANT", "MATERNELLE", "DEBUTANT", "INTERMEDIAIRE"
}
```

### Contrôleurs REST

#### `LanguageApiController` — `/api/languages`
**Fichier :** `src/.../api/controller/LanguageApiController.java`

| Méthode | URL | Accès | Description |
|---------|-----|-------|-------------|
| `GET` | `/api/languages` | Authentifié | Liste toutes les langues disponibles |

Réponse :
```json
[
  { "id": 1, "language": "Français" },
  { "id": 2, "language": "English" },
  { "id": 3, "language": "Nederlands" }
]
```

#### `ArtistApiController` — endpoints liés aux langues
**Fichier :** `src/.../api/controller/ArtistApiController.java`

| Méthode | URL | Accès | Description |
|---------|-----|-------|-------------|
| `GET` | `/api/artists/{id}` | Authentifié | Détail artiste **avec** ses langues |
| `POST` | `/api/artists/{id}/languages` | **ADMIN** | Ajoute une langue à un artiste |
| `GET` | `/api/artists/search/fluent/{languageName}` | Public | Route personnalisée — artistes courants dans une langue |

**GET `/api/artists/{id}` — réponse avec langues :**
```json
{
  "id": 1,
  "firstname": "Marie",
  "lastname": "Dupont",
  "types": ["comédien"],
  "languages": [
    { "id": 1, "name": "Français",  "level": "Langue maternelle" },
    { "id": 2, "name": "English",   "level": "Courant" }
  ]
}
```

**POST `/api/artists/{id}/languages` — body :**
```json
{ "languageId": 2, "level": "COURANT" }
```

Codes de retour :
- `200 OK` — langue ajoutée
- `400 Bad Request` — artiste non comédien (`"Erreur : Cet artiste n'est pas un comédien."`)
- `404 Not Found` — artiste introuvable

**Logique du POST (code réel) :**
```java
@PreAuthorize("hasRole('ADMIN')")
@PostMapping("/{id}/languages")
public ResponseEntity<?> addLanguageToArtist(@PathVariable Long id,
                                              @RequestBody ArtistLanguageRequest request) {
    Artist artist = artistService.getArtistById(id);
    if (artist == null) return ResponseEntity.notFound().build();

    // Règle métier : uniquement les comédiens
    boolean isComedien = artist.getTypes().stream()
            .anyMatch(t -> t.getType().equalsIgnoreCase("comédien"));
    if (!isComedien) return ResponseEntity.badRequest()
            .body("Erreur : Cet artiste n'est pas un comédien.");

    Language lang = languageRepository.findById(request.getLanguageId()).orElse(null);

    ArtistLanguage artistLanguage = ArtistLanguage.builder()
            .artist(artist)
            .language(lang)
            .level(LanguageLevel.valueOf(request.getLevel().toUpperCase()))
            .build();

    artistLanguageRepository.save(artistLanguage);
    return ResponseEntity.ok().build();
}
```

**GET `/api/artists/search/fluent/{languageName}` — route personnalisée :**
```java
@GetMapping("/search/fluent/{languageName}")
public List<ArtistDTO> getFluentArtistsByLanguage(@PathVariable String languageName) {
    return artistService.findFluentArtistsByLanguage(languageName).stream()
            .map(this::convertToDto)
            .toList();
}
```

Exemple d'appel : `GET /api/artists/search/fluent/Français`

Réponse :
```json
[
  { "id": 1, "firstname": "Marie", "lastname": "Dupont", "types": ["comédien"] }
]
```

### Sécurité (`SpringSecurityConfig`)

```java
// GET /api/artists/search/fluent/{languageName} → public (permit all via GET /api/artists/**)
.requestMatchers(HttpMethod.GET, "/api/artists/**").permitAll()

// POST /api/artists/*/languages → ADMIN uniquement
.requestMatchers(HttpMethod.POST, "/api/artists/*/languages").hasAnyRole("ADMIN", "admin")

// GET /api/languages → utilisateur connecté uniquement
.requestMatchers(HttpMethod.GET, "/api/languages").authenticated()
```

La méthode `addLanguageToArtist` porte également `@PreAuthorize("hasRole('ADMIN')")` (double sécurité).

---

## 3. Frontend — React / TypeScript

### Interfaces locales dans `ArtistProfile.tsx`

> Ces types sont définis localement dans le composant (non dans `models.ts`).

```typescript
interface LanguageInfo {
  id: number;
  name: string;   // ex: "Français"
  level: string;  // ex: "Langue maternelle" (libellé depuis getLabel())
}

interface ArtistDetail {
  id: number;
  firstname: string;
  lastname: string;
  types: string[];
  languages?: LanguageInfo[];
}
```

### Page `ArtistProfile`
**Fichier :** `frontend/src/pages/artist/ArtistProfile.tsx`

**Logique d'accès :**
```typescript
const isComedien = artist?.types?.some(type => type.toLowerCase() === "comédien");
const isAdmin = user?.role?.toUpperCase() === "ADMIN";
```

**Chargement des données au montage :**
```typescript
useEffect(() => {
    // Détail artiste avec langues
    fetch(`/api/artists/${id}`)
        .then(res => res.json())
        .then(data => setArtist(data));

    // Liste des langues pour la dropdown (sécurisé contre les erreurs 401/404)
    fetch("/api/languages")
        .then(res => res.ok ? res.json() : [])
        .then(data => setAvailableLanguages(Array.isArray(data) ? data : []))
        .catch(() => setAvailableLanguages([]));
}, [id]);
```

**Affichage des langues** — visible si `isComedien` :
- Liste des langues avec nom + niveau en libellé français
- Message "Aucune langue enregistrée." si la liste est vide

**Formulaire d'ajout** — visible uniquement si `isAdmin && isComedien` :
- `<select>` langue (liste depuis `/api/languages`)
- `<select>` niveau : MATERNELLE · DEBUTANT · INTERMEDIAIRE · COURANT
- Message de succès/erreur après soumission

```typescript
const handleAddLanguage = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`/api/artists/${id}/languages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            languageId: parseInt(selectedLangId),
            level: selectedLevel,
        }),
    });
    if (response.ok) {
        setMessage(t("admin.artists.langSuccess"));
        // Recharge les données pour afficher la nouvelle langue
        fetch(`/api/artists/${id}`).then(res => res.json()).then(setArtist);
    } else {
        setMessage(t("admin.artists.langError"));
    }
};
```

### Route dans `App.tsx`
```tsx
<Route path="/artists/:id" element={<ArtistProfile />} />
```
Route protégée (utilisateurs connectés uniquement).

### Clés i18n utilisées
| Clé | Valeur |
|-----|--------|
| `admin.artists.langSuccess` | `"Langue ajoutée avec succès !"` |
| `admin.artists.langError` | `"Erreur lors de l'ajout de la langue."` |

---

## 4. Résumé des fichiers créés / modifiés

### Fichiers créés
| Fichier | Description |
|---------|-------------|
| `model/Language.java` | Entité JPA — table `languages` |
| `model/ArtistLanguage.java` | Entité JPA — table `artist_language` |
| `model/enumeration/LanguageLevel.java` | Enum des niveaux de maîtrise |
| `repository/LanguageRepository.java` | Repository Spring Data |
| `repository/ArtistLanguageRepository.java` | Repository + requête JPQL fluent |
| `dto/ArtistLanguageRequest.java` | DTO pour la requête POST |
| `api/controller/LanguageApiController.java` | Endpoint `GET /api/languages` |
| `frontend/.../ArtistProfile.tsx` | Page profil artiste avec langues |
| `frontend/.../ArtistProfile.module.css` | Styles de la page |

### Fichiers modifiés
| Fichier | Modification |
|---------|-------------|
| `service/ArtistService.java` | Méthode `findFluentArtistsByLanguage` |
| `api/controller/ArtistApiController.java` | Endpoints `/{id}` (langues dans réponse), `/{id}/languages` (POST), `/search/fluent/{lang}` |
| `config/SpringSecurityConfig.java` | Règles pour `POST /api/artists/*/languages` et `GET /api/languages` |

---

## 5. Points d'attention

| Point | Détail |
|-------|--------|
| **Pas de migration Flyway** | Les tables `languages` et `artist_language` doivent être créées manuellement ou via une nouvelle migration V19 |
| **Relation unidirectionnelle** | `Artist` n'a pas de `@OneToMany` vers `ArtistLanguage` — les langues se lisent uniquement via le repository |
| **Niveau COURANT figé** | La route `/search/fluent/{lang}` retourne toujours le niveau COURANT. Les autres niveaux ne sont pas exposés via cette route |
| **Restriction comédien** | Le backend vérifie `type == "comédien"` avant tout ajout de langue (400 sinon) |
| **Pas de suppression** | Il n'existe pas d'endpoint DELETE pour retirer une langue d'un artiste |
| **Données initiales** | La table `languages` doit être peuplée avant d'utiliser la fonctionnalité |
