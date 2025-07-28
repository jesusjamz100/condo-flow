package com.condoflow.condo.apartment;

import com.condoflow.condo.apartment.dto.ApartmentResponse;
import com.condoflow.condo.apartment.service.ApartmentService;
import com.condoflow.condo.common.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/apartments")
public class ApartmentController {

    private final ApartmentService service;

    // ADMIN ROUTES
    @GetMapping("/admin")
    public ResponseEntity<PageResponse<ApartmentResponse>> findAllApartments(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(service.findAllApartments(page, size));
    }
}
