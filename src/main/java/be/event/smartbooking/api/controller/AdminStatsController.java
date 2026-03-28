package be.event.smartbooking.api.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import be.event.smartbooking.repository.LocationRepos;
import be.event.smartbooking.repository.ReservationRepository;
import be.event.smartbooking.repository.ShowRepos;
import be.event.smartbooking.repository.UserRepos;
import lombok.RequiredArgsConstructor;


@RequestMapping("/api/admin/stats")
@RequiredArgsConstructor
public class AdminStatsController {

    private final UserRepos userRepo;
    private final ShowRepos showRepo;
    private final LocationRepos locRepo;
    private final ReservationRepository resRepo;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Long>> getSummary() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", userRepo.count()); // .count() est ultra rapide et sûr
        stats.put("totalShows", showRepo.count());
        stats.put("totalLocations", locRepo.count());
        stats.put("totalReservations", resRepo.count());
        return ResponseEntity.ok(stats);
    }
 
    
}
