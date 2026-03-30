package be.event.smartbooking.api.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import be.event.smartbooking.repository.LocationRepos;
import be.event.smartbooking.repository.ReservationRepository;
import be.event.smartbooking.repository.ShowRepos;
import be.event.smartbooking.repository.UserRepos;
import be.event.smartbooking.service.ReservationService;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/admin/stats")
@RequiredArgsConstructor
public class AdminStatsController {

    private final UserRepos userRepo;
    private final ShowRepos showRepo;
    private final LocationRepos locRepo;
    private final ReservationRepository resRepo;
    private final ReservationService reservationService;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepo.count());
        stats.put("totalShows", showRepo.count());
        stats.put("totalLocations", locRepo.count());
        stats.put("totalReservations", resRepo.count());
        stats.put("totalRevenue", reservationService.getTotalRevenueConfirmed().doubleValue());
        return ResponseEntity.ok(stats);
    }
 
    
}
