package be.event.smartbooking.service;

import be.event.smartbooking.errorHandler.BusinessException;
import be.event.smartbooking.model.Show;
import be.event.smartbooking.model.Tag;
import be.event.smartbooking.repository.ShowRepos;
import be.event.smartbooking.repository.TagRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
public class TagService {

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private ShowRepos showRepository;

    @Transactional(readOnly = true)
    public List<Tag> getAll() {
        return tagRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Tag get(Long id) {
        return tagRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Tag introuvable avec l'ID : " + id, HttpStatus.NOT_FOUND));
    }

    /**
     * Ajoute un tag à un spectacle.
     * Réutilise un tag existant (par son nom) ou en crée un nouveau.
     */
    @Transactional
    public Tag addTagToShow(Long showId, String tagName) {
        Show show = showRepository.findById(showId)
                .orElseThrow(() -> new BusinessException("Spectacle introuvable avec l'ID : " + showId, HttpStatus.NOT_FOUND));

        Tag tag = tagRepository.findByTag(tagName.trim())
                .orElseGet(() -> tagRepository.save(new Tag(tagName.trim())));

        if (show.getTags().contains(tag)) {
            throw new BusinessException("Ce tag est déjà associé à ce spectacle.", HttpStatus.CONFLICT);
        }

        show.addTag(tag);
        showRepository.save(show);
        log.info("Tag '{}' ajouté au spectacle '{}'", tag.getTag(), show.getTitle());
        return tag;
    }
}
