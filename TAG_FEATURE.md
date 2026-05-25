# Fonctionnalité Tags (Mots-clés) — SmartBooking

> **Projet** : SmartBooking — Gestion de réservations de spectacles  
> **Stack** : Spring Boot 3.4.3 · React 19 · MySQL · Flyway

---

## Vue d'ensemble

Un **tag** (mot-clé) est une étiquette textuelle associée à un spectacle.  
- Un spectacle peut avoir **zéro ou plusieurs tags**  
- Un tag peut être associé à **zéro ou plusieurs spectacles**  
- → Relation **Many-to-Many**

**Fonctionnalités implémentées :**
| ID | Acteur | Description |
|----|--------|-------------|
| F1 | Utilisateur | Rechercher des spectacles par mot-clé |
| A1 | Administrateur | Ajouter un mot-clé à un spectacle |
| F2 | Utilisateur | Voir les tags d'un spectacle |
| F3 | Utilisateur | Accéder aux spectacles *sans* un tag donné (route personnalisée) |

---

## 1. Base de données (Flyway)

### Table `tags`
```sql
CREATE TABLE `tags` (
  `id`  BIGINT       NOT NULL AUTO_INCREMENT,
  `tag` VARCHAR(30)  NOT NULL UNIQUE,
  PRIMARY KEY(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Table de jointure `show_tag`
```sql
CREATE TABLE `show_tag` (
  `show_id` BIGINT NOT NULL,
  `tag_id`  BIGINT NOT NULL,
  PRIMARY KEY (`show_id`, `tag_id`),
  CONSTRAINT fk_show   FOREIGN KEY (show_id) REFERENCES shows(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_tag    FOREIGN KEY (tag_id)  REFERENCES tags(id)  ON UPDATE CASCADE ON DELETE RESTRICT
);
```

> **Contraintes :** CASCADE en mise à jour, RESTRICT en suppression  
> **Fichiers :** `V18_1__create_tags_table.sql`, `V18_2__create_show_tag_table.sql`, `V18_3__insert_tags_table.sql`

### Données de test
8 tags insérés : `théâtre`, `comédie`, `danse`, `musique`, `jeune public`, `humour`, `contemporain`, `classique`  
Chacun des 4 spectacles existants reçoit 2 tags.

---

## 2. Backend — Java / Spring Boot

### Entité `Tag`
**Fichier :** `src/main/java/be/event/smartbooking/model/Tag.java`

```java
@Entity @Table(name = "tags")
public class Tag {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 30)
    private String tag;

    @JsonBackReference
    @ManyToMany(mappedBy = "tags")
    private List<Show> shows = new ArrayList<>();
}
```

### Modification de `Show`
**Fichier :** `src/main/java/be/event/smartbooking/model/Show.java`

```java
@Builder.Default
@ManyToMany
@JoinTable(
    name = "show_tag",
    joinColumns = @JoinColumn(name = "show_id"),
    inverseJoinColumns = @JoinColumn(name = "tag_id")
)
private List<Tag> tags = new ArrayList<>();

// Méthodes utilitaires
public void addTag(Tag tag) { tags.add(tag); tag.getShows().add(this); }
public void removeTag(Tag tag) { tags.remove(tag); tag.getShows().remove(this); }
```

> `Show` est le **propriétaire** de la relation (il porte `@JoinTable`).  
> `Tag` porte `mappedBy="tags"` et `@JsonBackReference` pour éviter la boucle infinie JSON.

### Repository
**Fichier :** `src/main/java/be/event/smartbooking/repository/TagRepository.java`

```java
public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByTag(String tag);
    boolean existsByTag(String tag);
}
```

**Nouvelles requêtes dans `ShowRepos` :**
```java
// Spectacles dont un tag contient le mot-clé (recherche partielle, insensible à la casse)
@Query("SELECT DISTINCT s FROM Show s JOIN s.tags t " +
       "WHERE LOWER(t.tag) LIKE LOWER(CONCAT('%', :keyword, '%')) AND s.status = :status")
List<Show> findByTagKeyword(@Param("keyword") String keyword, @Param("status") ShowStatus status);

// Spectacles qui N'ONT PAS le tag exact
@Query("SELECT s FROM Show s WHERE s.status = :status " +
       "AND s NOT IN (SELECT s2 FROM Show s2 JOIN s2.tags t WHERE LOWER(t.tag) = LOWER(:tag))")
List<Show> findShowsWithoutTag(@Param("tag") String tag, @Param("status") ShowStatus status);
```

### Service
**Fichier :** `src/main/java/be/event/smartbooking/service/TagService.java`

Méthode principale :
```java
@Transactional
public Tag addTagToShow(Long showId, String tagName) {
    // Récupère le show (404 si absent)
    // Réutilise un tag existant ou en crée un nouveau
    // Empêche les doublons (409 Conflict)
    // Sauvegarde la relation
}
```

**Nouvelles méthodes dans `ShowService` :**
```java
public List<Show> searchByTag(String keyword)       // → findByTagKeyword
public List<Show> getShowsWithoutTag(String tag)    // → findShowsWithoutTag
```

### DTO
**Fichier :** `src/main/java/be/event/smartbooking/dto/TagDTO.java`
```java
public class TagDTO {
    private Long id;
    private String tag;
}
```
Le champ `List<TagDTO> tags` a été ajouté dans `ShowDTO`.

### Contrôleurs REST

**`TagApiController`** — `src/.../api/controller/TagApiController.java`

| Méthode | URL | Accès | Description |
|---------|-----|-------|-------------|
| `GET` | `/api/tags` | Public | Liste tous les tags |
| `POST` | `/api/tags/shows/{showId}` | **ADMIN** | Ajoute un tag à un spectacle |

Body du POST :
```json
{ "tag": "théâtre" }
```

**Nouveaux endpoints dans `ShowApiController`**

| Méthode | URL | Accès | Description |
|---------|-----|-------|-------------|
| `GET` | `/api/shows/search-by-tag?keyword=xxx` | Public | Recherche par mot-clé |
| `GET` | `/api/shows/without-tag/{tag}` | Public | Route personnalisée |

Réponse de ces deux endpoints :
```json
{
  "total": 2,
  "keyword": "théâtre",
  "shows": [ { "id": 1, "title": "Ayiti", "tags": [...], ... } ]
}
```

### Sécurité (`SpringSecurityConfig`)
```java
// Lecture publique
.requestMatchers(HttpMethod.GET, "/api/tags/**").permitAll()

// Écriture réservée à l'ADMIN
.requestMatchers(HttpMethod.POST, "/api/tags/**").hasAnyRole("admin", "ADMIN")
```
La méthode `addTagToShow` porte également `@PreAuthorize("hasAnyRole('ADMIN', 'admin')")` (double sécurité).

---

## 3. Frontend — React / TypeScript

### Type (models.ts)
```typescript
export interface Tag {
  id: number;
  tag: string;
}

// Ajouté dans Show :
tags?: Tag[];
```

### API client (api.ts)
```typescript
export const tagApi = {
  getAll: async (): Promise<Tag[]>,
  searchByTag: async (keyword: string): Promise<{ total: number; keyword: string; shows: Show[] }>,
  getShowsWithoutTag: async (tag: string): Promise<{ total: number; excludedTag: string; shows: Show[] }>,
  addTagToShow: async (showId: number, tagName: string): Promise<Tag>,
};
```

### Page ShowList — Recherche par tag
**Fichier :** `frontend/src/pages/show/showList/ShowList.tsx`

- Nouvelle barre de recherche par tag sous le titre
- Appel backend à la soumission du formulaire
- Affichage du compteur : **X résultats pour le mot-clé "xxx"**
- Bouton "✕ Effacer" pour revenir à la liste complète
- Les deux recherches (titre/lieu et tag) sont indépendantes

### Page ShowDetails — Tags + formulaire admin
**Fichier :** `frontend/src/pages/show/showDetails/ShowDetails.tsx`

- Section **"🏷️ Mots-clés"** affichée sous la description, visible par tous
- Les tags s'affichent sous forme de badges jaunes `#théâtre`
- Si aucun tag : message "Aucun mot-clé pour ce spectacle."
- **Formulaire d'ajout** visible **uniquement si `user.role === 'ADMIN'`**
- Après ajout : rechargement automatique des données

### Page ShowsWithoutTag (route personnalisée)
**Fichier :** `frontend/src/pages/show/showsWithoutTag/ShowsWithoutTag.tsx`

- Route : `/shows/without-tag/:tag`
- Affiche tous les spectacles qui **ne possèdent pas** le tag donné en paramètre URL
- Compteur de résultats en en-tête
- Lien de retour vers la programmation

### Route dans App.tsx
```tsx
<Route path="/shows/without-tag/:tag" element={<ShowsWithoutTagPage />} />
```
Route publique, aucune authentification requise.

---

## 4. Résumé des fichiers créés / modifiés

### Fichiers créés
| Fichier | Description |
|---------|-------------|
| `db/migration/V18_1__create_tags_table.sql` | Table `tags` |
| `db/migration/V18_2__create_show_tag_table.sql` | Table de jointure |
| `db/migration/V18_3__insert_tags_table.sql` | Données de test |
| `model/Tag.java` | Entité JPA |
| `repository/TagRepository.java` | Repository Spring Data |
| `service/TagService.java` | Logique métier |
| `api/controller/TagApiController.java` | Endpoints REST |
| `dto/TagDTO.java` | DTO de transfert |
| `frontend/.../ShowsWithoutTag.tsx` | Page route personnalisée |

### Fichiers modifiés
| Fichier | Modification |
|---------|-------------|
| `model/Show.java` | Relation ManyToMany + `addTag/removeTag` |
| `repository/ShowRepos.java` | 2 nouvelles requêtes JPQL |
| `service/ShowService.java` | `searchByTag` + `getShowsWithoutTag` |
| `api/controller/ShowApiController.java` | 2 nouveaux endpoints + tags dans DTO |
| `dto/ShowDTO.java` | Champ `List<TagDTO> tags` |
| `config/SpringSecurityConfig.java` | Règles sécurité pour `/api/tags/**` |
| `frontend/types/models.ts` | Interface `Tag` + champ dans `Show` |
| `frontend/services/api.ts` | `tagApi` |
| `frontend/.../ShowList.tsx` | Barre de recherche par tag |
| `frontend/.../ShowList.module.css` | Styles pour la recherche tag |
| `frontend/.../ShowDetails.tsx` | Affichage tags + formulaire admin |
| `frontend/App.tsx` | Route `/shows/without-tag/:tag` |
