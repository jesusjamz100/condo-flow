package com.condoflow.payment.resident;

import com.condoflow.payment.config.feign.FeignClientConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Optional;

@FeignClient(
        name = "resident-client",
        url = "http://gateway-service:8222/residents",
        configuration = FeignClientConfig.class
)
public interface ResidentClient {

    @GetMapping("/me")
    Optional<ResidentResponse> getMe();
}
