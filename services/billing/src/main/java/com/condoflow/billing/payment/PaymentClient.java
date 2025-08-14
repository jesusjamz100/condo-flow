package com.condoflow.billing.payment;

import com.condoflow.billing.config.feign.FeignClientConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Optional;

@FeignClient(
        name = "apartment-client",
        url = "${application.config.payment-url}",
        configuration = FeignClientConfig.class
)
public interface PaymentClient {

    @GetMapping("/admin/{apartmentId}")
    Optional<PaymentResponse> getLastPaymentByApartmentId(
            @PathVariable(name = "apartmentId") Integer apartmentId
    );
}
