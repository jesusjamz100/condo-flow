package com.condoflow.payment.apartment;

import com.condoflow.payment.config.feign.FeignClientConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;
import java.util.Optional;

@FeignClient(
        name = "apartment-client",
        url = "http://gateway-service:8222/condo",
        configuration = FeignClientConfig.class
)
public interface ApartmentClient {

    @GetMapping("/admin/findApartmentById/{apartmentId}")
    Optional<ApartmentResponse> findApartmentById(@PathVariable("apartmentId") int apartmentId);

    @PatchMapping("/admin/{apartmentId}/updateBalanceFromPayment?paymentAmount={amount}")
    void updateBalanceFromPayment(@PathVariable("apartmentId") Integer apartmentId, @RequestParam("paymentAmount") BigDecimal amount);
}
