package com.condoflow.condo.apartment;

import com.condoflow.condo.apartment.dto.ApartmentRequest;
import com.condoflow.condo.apartment.dto.ApartmentResponse;
import com.condoflow.condo.apartment.service.ApartmentService;
import com.condoflow.condo.common.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

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

    @DeleteMapping("/admin/deleteById/{apartmentId}")
    public ResponseEntity<Void> deleteApartmentById(
            @PathVariable("apartmentId") int apartmentId
    ) {
        service.deleteApartmentById(apartmentId);
        return ResponseEntity.noContent().build();
    }
}
