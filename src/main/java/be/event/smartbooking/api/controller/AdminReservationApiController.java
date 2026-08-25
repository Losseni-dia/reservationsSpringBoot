package be.event.smartbooking.api.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import be.event.smartbooking.dto.ReservationAdminDto;
import be.event.smartbooking.service.ReservationService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/reservations")
@RequiredArgsConstructor
public class AdminReservationApiController {

    private final ReservationService reservationService;

    @GetMapping
    public List<ReservationAdminDto> listAll() {
        return reservationService.findAllForAdmin();
    }
}
