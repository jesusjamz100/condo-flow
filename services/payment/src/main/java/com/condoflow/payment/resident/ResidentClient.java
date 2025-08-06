package com.condoflow.payment.resident;

import com.condoflow.payment.config.feign.FeignClientConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Optional;

@FeignClient(
        name = "resident-client",
        url = "${application.config.resident-url}",
        configuration = FeignClientConfig.class
)
public interface ResidentClient {

    @GetMapping("/me")
    Optional<ResidentResponse> getMe();
}
