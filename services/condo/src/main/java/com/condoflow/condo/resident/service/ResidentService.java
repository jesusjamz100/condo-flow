package com.condoflow.condo.resident.service;

import com.condoflow.condo.common.PageResponse;
import com.condoflow.condo.resident.dto.ResidentResponse;
import com.condoflow.condo.resident.dto.ResidentRequest;
import com.condoflow.condo.resident.dto.ResidentProfileResponse;
import org.springframework.security.oauth2.jwt.Jwt;

public interface ResidentService {
    ResidentProfileResponse getMe(Jwt jwt);
    void createIfNotExists(String keycloakId);
    ResidentResponse updateResident(ResidentRequest request);
    PageResponse<ResidentResponse> findAllUsers(int page, int size);
    ResidentResponse findResidentById(Integer residentId);
    ResidentResponse findResidentByKeycloakUserId(String keycloakUserId);
    ResidentResponse findResidentByDocument(String document);
    Integer createResident(ResidentRequest request);
    void updateKeycloakUserId(Integer residentId, String keycloakUserId);
    void deleteResidentById(Integer residentId);
}
