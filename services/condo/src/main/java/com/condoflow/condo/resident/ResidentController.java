package com.condoflow.condo.resident;

import com.condoflow.condo.common.PageResponse;
import com.condoflow.condo.resident.dto.PublicResidentResponse;
import com.condoflow.condo.resident.dto.ResidentRequest;
import com.condoflow.condo.resident.dto.ResidentResponse;
import com.condoflow.condo.resident.service.ResidentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/residents")
public class ResidentController {

    private final ResidentService service;

    @GetMapping("/me")
    public ResponseEntity<ResidentResponse> me(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(service.getMe(jwt));
    }

    @GetMapping("/admin")
    public ResponseEntity<PageResponse<PublicResidentResponse>> findAllResidents(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(service.findAllUsers(page, size));
    }

    @PostMapping("/admin/createResident")
    public ResponseEntity<Integer> createResident(
            @RequestBody @Valid ResidentRequest request
    ) {
        return ResponseEntity.ok(service.createResident(request));
    }
}
