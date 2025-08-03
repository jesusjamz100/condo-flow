package com.condoflow.condo.resident.dto;

import com.condoflow.condo.common.relation.dto.ApartmentResidentResponse;

import java.util.List;

public record ResidentProfileResponse(
        // IDENTIFICATION DATA
        Integer id,
        String keycloakUserId,
        // JWT DATA (KEYCLOAK)
        String username,
        String email,
        String firstName,
        String lastName,
        // RESIDENT EXTRA DATA
        String document,
        String phoneNumber,
        String emergencyContactName,
        String emergencyContactPhone,
        List<ApartmentResidentResponse> apartmentResidents
) {
}
