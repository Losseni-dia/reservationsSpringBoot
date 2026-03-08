package be.event.smartbooking.api.controller.externalApi;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import be.event.smartbooking.dto.externalApi.ExternalLocationDTO;

@FeignClient(name = "external-locations-api", url = "https://api.exemple.com/v1")
public interface LocationClient {
    @GetMapping("/venues")
    List<ExternalLocationDTO> fetchAllVenues();
}
