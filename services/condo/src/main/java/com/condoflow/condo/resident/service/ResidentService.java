package com.condoflow.condo.resident.service;

import com.condoflow.condo.resident.dto.ResidentResponse;
import org.springframework.security.oauth2.jwt.Jwt;

public interface ResidentService {
    ResidentResponse getMe(Jwt jwt);
    void createIfNotExists(String keycloakId);
}
