# Fonctionnalité Troupe — SmartBooking

> **Projet** : SmartBooking — Gestion de réservations de spectacles  
> **Stack** : Spring Boot 3.4.3 · React 19 · MySQL · Flyway

---

## Vue d'ensemble

Une **troupe** est une compagnie artistique qui regroupe des artistes.  
- Une troupe regroupe **zéro ou plusieurs artistes**  
- Un artiste appartient à **une seule troupe** (ou aucune — "Non affilié")  
- → Relation **Many-to-One** depuis Artist (FK `troupe_id` dans la table `artists`)

**Fonctionnalités implémentées :**
| ID | Acteur | Description |
|----|--------|-------------|
| F1 | Utilisateur | Voir le nom et le logo de la troupe d'un artiste |
| A1 | Administrateur | Affecter un artiste à une troupe (ou le désaffilier) |

---

## 1. Base de données (Flyway)

### Table `troupes`
```sql
CREATE TABLE `troupes` (
  `id`       BIGINT       NOT NULL AUTO_INCREMENT,
  `name`     VARCHAR(60)  NOT NULL UNIQUE,
  `logo_url` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Modification de `artists` — ajout de la FK
```sql
ALTER TABLE `artists`
  ADD COLUMN `troupe_id` BIGINT DEFAULT NULL;

ALTER TABLE `artists`
  ADD CONSTRAINT `FK_artists_troupe_id`
    FOREIGN KEY (`troupe_id`) REFERENCES `troupes` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT;
```

> **Contraintes :** CASCADE en mise à jour, RESTRICT en suppression  
> **Pourquoi RESTRICT ?** On empêche la suppression d'une troupe tant qu'elle a des artistes.  
> **Fichiers :** `V19_1__create_troupes_table.sql`, `V19_2__add_troupe_id_to_artists.sql`, `V19_3__insert_troupes.sql`

### Données de test
```sql
INSERT INTO `troupes` (`id`, `name`, `logo_url`) VALUES
(1, 'Théâtre du Parc',     'troupe_parc.jpg'),
(2, 'Collectif 42',        'troupe_collectif42.jpg'),
(3, 'Les Ateliers du Sud', 'troupe_ateliers_sud.jpg'),
(4, 'Scène Libre',         NULL);

-- Affectation des 4 premiers artistes
UPDATE `artists` SET `troupe_id` = 1 WHERE `id` IN (1, 2);
UPDATE `artists` SET `troupe_id` = 2 WHERE `id` = 3;
UPDATE `artists` SET `troupe_id` = 3 WHERE `id` = 4;
```

---

## 2. Backend — Java / Spring Boot

### Entité `Troupe`
**Fichier :** `src/main/java/be/event/smartbooking/model/Troupe.java`

```java
@Data @NoArgsConstructor
@Entity @Table(name = "troupes")
public class Troupe {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 60)
    private String name;

    @Column(name = "logo_url", length = 255)
    private String logoUrl;

    @JsonManagedReference
    @OneToMany(mappedBy = "troupe")
    private List<Artist> artists = new ArrayList<>();
}
```

### Modification de `Artist`
**Fichier :** `src/main/java/be/event/smartbooking/model/Artist.java`

```java
@JsonBackReference
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "troupe_id")
private Troupe troupe;
```

> `Troupe` est le **côté inverse** (`mappedBy="troupe"`).  
> `Artist` est le **propriétaire** de la relation (il porte `@JoinColumn`).  
> `@JsonBackReference` évite la boucle infinie JSON lors de la sérialisation.

### Repository
**Fichier :** `src/main/java/be/event/smartbooking/repository/TroupeRepository.java`

```java
public interface TroupeRepository extends JpaRepository<Troupe, Long> {
    Optional<Troupe> findByName(String name);
    boolean existsByName(String name);
}
```

### Service
**Fichier :** `src/main/java/be/event/smartbooking/service/TroupeService.java`

```java
@Transactional(readOnly = true)
public List<Troupe> getAll() { ... }

@Transactional(readOnly = true)
public Troupe get(Long id) { ... } // 404 si absent

/**
 * Affecte ou désaffilier un artiste.
 * troupeId == null → désaffiliation (Non affilié)
 */
@Transactional
public Artist assignArtistToTroupe(Long artistId, Long troupeId) {
    Artist artist = artistRepository.findById(artistId)
            .orElseThrow(() -> new BusinessException("Artiste introuvable", 404));

    if (troupeId == null) {
        artist.setTroupe(null);
    } else {
        Troupe troupe = get(troupeId);
        artist.setTroupe(troupe);
    }
    return artistRepository.save(artist);
}
```

### DTO
**Fichier :** `src/main/java/be/event/smartbooking/dto/TroupeDTO.java`
```java
public class TroupeDTO {
    private Long id;
    private String name;
    private String logoUrl;
}
```

### Contrôleurs REST

**`TroupeApiController`** — `src/.../api/controller/TroupeApiController.java`

| Méthode | URL | Accès | Description |
|---------|-----|-------|-------------|
| `GET` | `/api/troupes` | Public | Liste toutes les troupes |
| `PUT` | `/api/troupes/artists/{artistId}` | **ADMIN** | Affecte ou désaffilier un artiste |

Body du PUT :
```json
{ "troupeId": 1 }       ← affecter à la troupe 1
{ "troupeId": null }    ← désaffilier (Non affilié)
```

**Modification de `ArtistApiController`** — `GET /api/artists/{id}` inclut maintenant la troupe :

```json
{
  "id": 1,
  "firstname": "Marie",
  "lastname": "Dupont",
  "types": ["comédien"],
  "languages": [...],
  "troupe": {
    "id": 1,
    "name": "Théâtre du Parc",
    "logoUrl": "troupe_parc.jpg"
  }
}
```
> Si l'artiste n'est affilié à aucune troupe : `"troupe": null`

### Sécurité (`SpringSecurityConfig`)
```java
// Lecture publique
.requestMatchers(HttpMethod.GET, "/api/troupes/**").permitAll()

// Écriture réservée à l'ADMIN
.requestMatchers(HttpMethod.PUT, "/api/troupes/**").hasAnyRole("admin", "ADMIN")
```
La méthode `assignArtist` porte également `@PreAuthorize("hasAnyRole('ADMIN', 'admin')")` (double sécurité).

---

## 3. Frontend — React / TypeScript

### Type (models.ts)
```typescript
export interface Troupe {
  id: number;
  name: string;
  logoUrl: string | null;
}
```

Interface locale dans `ArtistProfile.tsx` :
```typescript
interface TroupeInfo {
  id: number;
  name: string;
  logoUrl: string | null;
}

interface ArtistDetail {
  id: number;
  firstname: string;
  lastname: string;
  types: string[];
  languages?: LanguageInfo[];
  troupe?: TroupeInfo | null;   // ← ajouté
}
```

### API client (api.ts)
```typescript
export const troupeApi = {
  getAll: async (): Promise<Troupe[]> => {
    const res = await secureFetch(`/api/troupes`);
    return res.json();
  },
  assignArtist: async (artistId: number, troupeId: number | null): Promise<void> => {
    await secureFetch(`/api/troupes/artists/${artistId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ troupeId }),
    });
  },
};
```

### Page `ArtistProfile`
**Fichier :** `frontend/src/pages/artist/ArtistProfile.tsx`

**Chargement au montage :**
```typescript
useEffect(() => {
    fetch(`/api/artists/${id}`)         // → artist + troupe + langues
        .then(res => res.json())
        .then(data => {
            setArtist(data);
            setSelectedTroupeId(data.troupe?.id?.toString() ?? "");
        });

    fetch("/api/languages")             // → dropdown langues
        .then(res => res.ok ? res.json() : [])
        .then(data => setAvailableLanguages(Array.isArray(data) ? data : []));

    troupeApi.getAll()                  // → dropdown troupes
        .then(setAvailableTroupes);
}, [id]);
```

**Affichage de la troupe** — visible par tous :
- Logo affiché en **50px de largeur** (`/uploads/{logoUrl}`) si présent
- Nom de la troupe en jaune
- Texte **"Non affilié"** si `artist.troupe === null`

**Formulaire d'affiliation** — visible uniquement si `isAdmin` :
- `<select>` pré-rempli avec la troupe actuelle de l'artiste
- Option "— Non affilié —" en tête de liste pour désaffilier
- Liste dynamique des troupes depuis `GET /api/troupes`
- Message de succès (vert) / erreur (jaune) après soumission
- Rechargement automatique des données après succès

```typescript
const isAdmin = user?.role?.toUpperCase() === "ADMIN";

const handleAssignTroupe = async (e: React.FormEvent) => {
    e.preventDefault();
    const troupeId = selectedTroupeId ? parseInt(selectedTroupeId) : null;
    await troupeApi.assignArtist(parseInt(id), troupeId);
    loadArtist(); // Recharge pour afficher la nouvelle troupe
};
```

---

## 4. Résumé des fichiers créés / modifiés

### Fichiers créés
| Fichier | Description |
|---------|-------------|
| `db/migration/V19_1__create_troupes_table.sql` | Table `troupes` |
| `db/migration/V19_2__add_troupe_id_to_artists.sql` | FK `troupe_id` dans `artists` |
| `db/migration/V19_3__insert_troupes.sql` | 4 troupes de test + affectation |
| `model/Troupe.java` | Entité JPA |
| `repository/TroupeRepository.java` | Repository Spring Data |
| `service/TroupeService.java` | Logique métier (affectation/désaffiliation) |
| `dto/TroupeDTO.java` | DTO de transfert |
| `api/controller/TroupeApiController.java` | Endpoints REST |

### Fichiers modifiés
| Fichier | Modification |
|---------|-------------|
| `model/Artist.java` | Ajout `@ManyToOne troupe` + `@JoinColumn(name="troupe_id")` |
| `api/controller/ArtistApiController.java` | `GET /api/artists/{id}` inclut le champ `troupe` |
| `config/SpringSecurityConfig.java` | Règles sécurité pour `/api/troupes/**` |
| `frontend/types/models.ts` | Interface `Troupe` |
| `frontend/services/api.ts` | `troupeApi` |
| `frontend/.../ArtistProfile.tsx` | Section troupe + formulaire admin |
| `frontend/.../ArtistProfile.module.css` | Styles `.alertSuccess` + espacement sections |
