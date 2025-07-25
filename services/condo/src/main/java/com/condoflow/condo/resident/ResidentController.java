package com.condoflow.condo.resident;

import com.condoflow.condo.resident.dto.ResidentResponse;
import com.condoflow.condo.resident.service.ResidentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/residents")
public class ResidentController {

    private final ResidentService service;

    @GetMapping("/me")
    public ResponseEntity<ResidentResponse> me(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(service.getMe(jwt.getSubject()));
    }
}
