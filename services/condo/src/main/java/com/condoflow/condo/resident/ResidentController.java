package com.condoflow.condo.resident;

import com.condoflow.condo.common.PageResponse;
import com.condoflow.condo.resident.dto.ResidentResponse;
import com.condoflow.condo.resident.dto.ResidentRequest;
import com.condoflow.condo.resident.dto.ResidentProfileResponse;
import com.condoflow.condo.resident.service.ResidentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/residents")
public class ResidentController {

    private final ResidentService service;

    @GetMapping("/me")
    public ResponseEntity<ResidentProfileResponse> me(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(service.getMe(jwt));
    }

    @PreAuthorize("hasRole('ADMIN') or #p1.keycloakUserId == authentication.name")
    @PutMapping("/updateResident")
    public ResponseEntity<ResidentResponse> updateResident(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody @Valid ResidentRequest request
    ) {
        return ResponseEntity.ok(service.updateResident(request));
    }

    // ADMIN ROUTES
    @GetMapping("/admin")
    public ResponseEntity<PageResponse<ResidentResponse>> findAllResidents(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(service.findAllUsers(page, size));
    }

    @GetMapping("/admin/findResidentById/{residentId}")
    public ResponseEntity<ResidentResponse> findResidentById(
            @PathVariable("residentId") Integer residentId
    ) {
        return ResponseEntity.ok(service.findResidentById(residentId));
    }

    @GetMapping("/admin/findResidentByKeycloakUserId/{keycloakUserId}")
    public ResponseEntity<ResidentResponse> findResidentByKeycloakUserId(
            @PathVariable("keycloakUserId") String keycloakUserId
    ) {
        return ResponseEntity.ok(service.findResidentByKeycloakUserId(keycloakUserId));
    }

    @GetMapping("/admin/findResidentByDocument/{document}")
    public ResponseEntity<ResidentResponse> findResidentByDocument(
            @PathVariable("document") String document
    ) {
        return ResponseEntity.ok(service.findResidentByDocument(document));
    }

    @PostMapping("/admin/createResident")
    public ResponseEntity<Integer> createResident(
            @RequestBody @Valid ResidentRequest request
    ) {
        return ResponseEntity.ok(service.createResident(request));
    }

    @PatchMapping("/admin/updateDocument/{residentId}/{document}")
    public ResponseEntity<Void> updateDocument(
            @PathVariable("residentId") Integer residentId,
            @PathVariable("document") String document
    ) {
        service.updateDocument(residentId, document);
        return ResponseEntity.accepted().build();
    }

    @PatchMapping("/admin/updateKeycloakUserId/{residentId}/{keycloakUserId}")
    public ResponseEntity<Void> updateKeycloakUserId(
            @PathVariable("residentId") Integer residentId,
            @PathVariable("keycloakUserId") String keycloakUserId
    ) {
        service.updateKeycloakUserId(residentId, keycloakUserId);
        return ResponseEntity.accepted().build();
    }

    @DeleteMapping("/admin/deleteById/{residentId}")
    public ResponseEntity<Void> deleteResidentById(
            @PathVariable("residentId") Integer residentId
    ) {
        service.deleteResidentById(residentId);
        return ResponseEntity.noContent().build();
    }
}
