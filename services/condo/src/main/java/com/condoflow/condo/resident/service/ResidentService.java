package com.condoflow.condo.resident.service;

import com.condoflow.condo.common.PageResponse;
import com.condoflow.condo.resident.dto.PublicResidentResponse;
import com.condoflow.condo.resident.dto.ResidentRequest;
import com.condoflow.condo.resident.dto.ResidentResponse;
import org.springframework.security.oauth2.jwt.Jwt;

public interface ResidentService {
    ResidentResponse getMe(Jwt jwt);
    void createIfNotExists(String keycloakId);
    PageResponse<PublicResidentResponse> findAllUsers(int page, int size);
    Integer createResident(ResidentRequest request);
}
