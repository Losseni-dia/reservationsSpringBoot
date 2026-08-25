package be.event.smartbooking.api.controller.externalApi;

import be.event.smartbooking.dto.externalApi.LocationApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "odwb-culture-api", url = "https://www.odwb.be/api/explore/v2.1")
public interface LocationClient {

    @GetMapping("/catalog/datasets/centre-culturels-en-communaute-francaise/records")
    LocationApiResponse fetchAllVenues(@RequestParam("limit") int limit);
}
