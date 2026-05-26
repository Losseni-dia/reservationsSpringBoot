package be.event.smartbooking.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import be.event.smartbooking.errorHandler.BusinessException;
import be.event.smartbooking.model.Show;
import be.event.smartbooking.model.Video;
import be.event.smartbooking.repository.ShowRepos;
import be.event.smartbooking.repository.VideoRepository;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class VideoService {
    @Autowired
    private VideoRepository videoRepository;
    @Autowired
    private ShowRepos showRepository;

    @Transactional(readOnly = true)
    public List<Video> getByShow(Long showId) {
        return videoRepository.findByShowId(showId);
    }

    @Transactional
    public Video addVideoToShow(Long showId, String title, String videoUrl) {
        Show show = showRepository.findById(showId)
                .orElseThrow(() -> new BusinessException("Spectacle introuvable", HttpStatus.NOT_FOUND));
        Video video = Video.builder().title(title).videoUrl(videoUrl).show(show).build();
        log.info("Vidéo '{}' ajoutée au spectacle '{}'", title, show.getTitle());
        return videoRepository.save(video);
    }

    @Transactional(readOnly = true)
    public List<Video> getVideosByArtistLastname(String lastname) {
        return videoRepository.findVideosByArtistLastname(lastname);
    }
}
