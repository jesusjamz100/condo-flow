package com.condoflow.condo.resident.service;

import com.condoflow.condo.resident.dto.ResidentResponse;

public interface ResidentService {
    ResidentResponse getMe(String subject);
    void createIfNotExists(String keycloakId);
}
