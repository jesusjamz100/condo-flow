package com.condoflow.condo.apartment;

import com.condoflow.condo.apartment.dto.ApartmentRequest;
import com.condoflow.condo.apartment.dto.ApartmentResponse;
import com.condoflow.condo.apartment.service.ApartmentService;
import com.condoflow.condo.common.PageResponse;
import com.condoflow.condo.resident.dto.ResidentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequiredArgsConstructor
@RequestMapping("/condo")
public class ApartmentController {

    private final ApartmentService service;

    @GetMapping("/myApartments")
    public ResponseEntity<PageResponse<ApartmentResponse>> findMyApartments(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(service.findMyApartments(jwt, page, size));
    }

    @GetMapping("/myApartments/{apartmentId}")
    public ResponseEntity<ApartmentResponse> findOneOfMyApartments(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable("apartmentId") int apartmentId
    ) {
        return ResponseEntity.ok(service.findApartmentById(jwt, apartmentId));
    }

    // ADMIN ROUTES
    @GetMapping("/admin")
    public ResponseEntity<PageResponse<ApartmentResponse>> findAllApartments(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(service.findAllApartments(page, size));
    }

    @GetMapping("/admin/findApartmentById/{apartmentId}")
    public ResponseEntity<ApartmentResponse> findApartmentById(
            @PathVariable("apartmentId") int apartmentId
    ) {
        return ResponseEntity.ok(service.findApartmentById(apartmentId));
    }

    @PostMapping("/admin/createApartment")
    public ResponseEntity<Integer> createApartment(
            @RequestBody ApartmentRequest request
    ) {
        return ResponseEntity.ok(service.createApartment(request));
    }

    @PutMapping("/admin/updateApartment")
    public ResponseEntity<ApartmentResponse> updateApartment(
            @RequestBody ApartmentRequest request
    ) {
        return ResponseEntity.ok(service.updateApartment(request));
    }

    @PatchMapping("/admin/{apartmentId}/updateBalanceFromPayment")
    public ResponseEntity<Void> updateBalanceFromPayment(
            Integer apartmentId,
            @RequestParam("paymentAmount") BigDecimal amount
    ) {
        service.updateBalanceFromPayment(apartmentId, amount);
        return ResponseEntity.accepted().build();
    }

    @DeleteMapping("/admin/deleteById/{apartmentId}")
    public ResponseEntity<Void> deleteApartmentById(
            @PathVariable("apartmentId") int apartmentId
    ) {
        service.deleteApartmentById(apartmentId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/admin/residents/{residentId}")
    public ResponseEntity<PageResponse<ApartmentResponse>> getApartmentsByResident(
            @PathVariable("residentId") int residentId,
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(service.findApartmentsByResidentId(residentId, page, size));
    }

    @GetMapping("/admin/{apartmentId}/residents")
    public ResponseEntity<PageResponse<ResidentResponse>> getApartmentResidents(
            @PathVariable("apartmentId") int apartmentId,
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(service.findApartmentResidents(apartmentId, page, size));
    }

    @PostMapping("/admin/{apartmentId}/residents/{residentId}")
    public ResponseEntity<Void> addResidentToApartment(
            @PathVariable("apartmentId") int apartmentId,
            @PathVariable("residentId") int residentId
    ) {
        service.addResidentToApartment(apartmentId, residentId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/admin/{apartmentId}/residents/{residentId}")
    public ResponseEntity<Void> removeResidentFromApartment(
            @PathVariable("apartmentId") int apartmentId,
            @PathVariable("residentId") int residentId
    ) {
        service.removeResidentFromApartment(apartmentId, residentId);
        return ResponseEntity.noContent().build();
    }
}
