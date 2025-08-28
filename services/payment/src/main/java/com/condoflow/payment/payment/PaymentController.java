package com.condoflow.payment.payment;

import com.condoflow.payment.common.PageResponse;
import com.condoflow.payment.payment.dto.PaymentRequest;
import com.condoflow.payment.payment.dto.PaymentResponse;
import com.condoflow.payment.payment.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentService service;

    @GetMapping("/myPayments")
    public ResponseEntity<PageResponse<PaymentResponse>> getAllMyPayments(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size,
            @RequestParam(name = "type", required = false) PaymentType type
    ) {
        return ResponseEntity.ok(service.findMyPayments(page, size, type));
    }

    @GetMapping("/myPayments/{paymentId}")
    public ResponseEntity<PaymentResponse> getMyPaymentById(
            @PathVariable("paymentId") Integer paymentId
    ) {
        return ResponseEntity.ok(service.findMyPaymentById(paymentId));
    }

    @GetMapping("/myPayments/findByApartment/{apartmentId}")
    public ResponseEntity<PageResponse<PaymentResponse>> getMyPaymentsByApartment(
            @PathVariable("apartmentId") Integer apartmentId,
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size,
            @RequestParam(name = "type", required = false) PaymentType type
    ) {
        return ResponseEntity.ok(service.findMyPaymentsByApartment(apartmentId, page, size, type));
    }

    @PostMapping("/myPayments/register")
    public ResponseEntity<Void> registerPayment(
            @RequestBody @Valid PaymentRequest request
    ) {
        service.registerPayment(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // ADMIN ROUTES
    @GetMapping("/admin")
    public ResponseEntity<PageResponse<PaymentResponse>> getAllPayments(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size,
            @RequestParam(name = "type", required = false) PaymentType type,
            @RequestParam(name = "approved", required = false) Boolean approved,
            @RequestParam(name = "startDate", required = false) LocalDate startDate,
            @RequestParam(name = "endDate", required = false) LocalDate endDate
    ) {
        return ResponseEntity.ok(service.findAllPayments(page, size, type, approved, startDate, endDate));
    }

    @GetMapping("/admin/{paymentId}")
    public ResponseEntity<PaymentResponse> getPaymentById(
            @PathVariable("paymentId") Integer paymentId
    ) {
        return ResponseEntity.ok(service.findById(paymentId));
    }

    @PatchMapping("/admin/approve/{paymentId}")
    public ResponseEntity<Void> approvePayment(
            @PathVariable("paymentId") Integer paymentId
    ) {
        service.approvePayment(paymentId);
        return ResponseEntity.accepted().build();
    }

    @GetMapping("/admin/apartments/byId/{apartmentId}")
    public ResponseEntity<PageResponse<PaymentResponse>> getPaymentsByApartmentId(
            @PathVariable(name = "apartmentId") Integer apartmentId,
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(service.findAllPaymentsByApartmentId(apartmentId, page, size));
    }

    @GetMapping("/admin/apartments/{apartmentId}")
    public ResponseEntity<Optional<PaymentResponse>> getLastPaymentByApartmentId(
            @PathVariable(name = "apartmentId") Integer apartmentId
    ) {
        return ResponseEntity.ok(service.findLastPaymentByApartmentId(apartmentId));
    }

}
