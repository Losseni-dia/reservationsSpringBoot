package be.event.smartbooking.api.controller.externalApi;

import be.event.smartbooking.dto.externalApi.LocationApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "digital-wallonia-api", url = "https://digitalwallonia.opendatasoft.com/api/explore/v2.1")
public interface LocationClient {

    // On récupère les 20 premiers résultats (on peut monter jusqu'à 100 avec limit)
    @GetMapping("/catalog/datasets/8212000/records")
    LocationApiResponse fetchAllVenues(@RequestParam("limit") int limit);
}
