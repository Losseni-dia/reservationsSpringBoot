package be.event.smartbooking.api.controller;

import be.event.smartbooking.model.Locality;
import be.event.smartbooking.service.LocalityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/localities")
public class LocalityApiController {

    @Autowired
    private LocalityService localityService;

    @GetMapping
    public List<Locality> getAll() {
        return localityService.getAll();
    }
}