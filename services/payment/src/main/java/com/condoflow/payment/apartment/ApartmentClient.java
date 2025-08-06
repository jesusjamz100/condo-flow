package com.condoflow.payment.apartment;

import com.condoflow.payment.config.feign.FeignClientConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Optional;

@FeignClient(
        name = "apartment-client",
        url = "${application.config.apartment-url}",
        configuration = FeignClientConfig.class
)
public interface ApartmentClient {

    @GetMapping("/admin/findApartmentById/{apartmentId}")
    Optional<ApartmentResponse> findApartmentById(@PathVariable("apartmentId") int apartmentId);

    @PutMapping("/admin/{apartmentId}/updateBalanceFromPayment")
    void updateBalanceFromPayment(@PathVariable("apartmentId") Integer apartmentId, @RequestParam(name = "paymentAmount") BigDecimal amount);
}
