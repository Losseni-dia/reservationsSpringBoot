package be.event.smartbooking.api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
public class PublicShowApiController {

    @GetMapping("/test")
    public Map<String, String> testApiKey() {
        return Map.of(
            "status", "success",
            "message", "Authentification par clé API réussie !"
        );
    }
}