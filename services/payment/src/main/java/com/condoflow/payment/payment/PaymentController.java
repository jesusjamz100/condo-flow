package com.condoflow.payment.payment;

import com.condoflow.payment.common.PageResponse;
import com.condoflow.payment.payment.dto.PaymentRequest;
import com.condoflow.payment.payment.dto.PaymentResponse;
import com.condoflow.payment.payment.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(("/payments"))
public class PaymentController {

    private final PaymentService service;

    @GetMapping("/myPayments")
    public ResponseEntity<PageResponse<PaymentResponse>> getAllMyPayments(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(service.findMyPayments(page, size));
    }

    @GetMapping("/myPayments/{paymentId}")
    public ResponseEntity<PaymentResponse> getMyPaymentById(
            @PathVariable("paymentId") Integer paymentId
    ) {
        return ResponseEntity.ok(service.findById(paymentId));
    }

    @GetMapping("/myPayments/findByApartment/{apartmentId}")
    public ResponseEntity<PageResponse<PaymentResponse>> getMyPaymentsByApartment(
            @PathVariable("apartmentId") Integer apartmentId,
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(service.findMyPaymentsByApartment(apartmentId, page, size));
    }

    @PostMapping("/myPayments/register")
    public ResponseEntity<Void> registerPayment(
            @RequestBody @Valid PaymentRequest request
    ) {
        service.registerPayment(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

}
