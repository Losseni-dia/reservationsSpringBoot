package be.event.smartbooking.api.controller;

import be.event.smartbooking.dto.ReviewDTO;
import be.event.smartbooking.model.Review;
import be.event.smartbooking.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
public class ReviewApiController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/show/{showId}")
    public List<ReviewDTO> getByShow(@PathVariable Long showId) {
        return reviewService.getValidatedReviewsByShow(showId).stream()
                .map(r -> ReviewDTO.builder()
                        .id(r.getId())
                        .authorLogin(r.getUser().getLogin())
                        .comment(r.getComment())
                        .stars(r.getStars())
                        .createdAt(r.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}