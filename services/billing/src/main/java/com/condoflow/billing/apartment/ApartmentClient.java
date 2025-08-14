package com.condoflow.billing.apartment;

import com.condoflow.billing.common.PageResponse;
import com.condoflow.billing.config.feign.FeignClientConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;

@FeignClient(
    name = "apartment-client",
    url = "${application.config.apartment-url}",
    configuration = FeignClientConfig.class
)
public interface ApartmentClient {

    @GetMapping("/admin")
    PageResponse<ApartmentResponse> getAllApartments(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    );

    @PutMapping("/admin/{apartmentId}/updateBalanceFromInvoice")
    void updateBalanceFromInvoice(
            @PathVariable("apartmentId") Integer apartmentId,
            @RequestParam(name = "invoiceAmount") BigDecimal amount
    );
}
