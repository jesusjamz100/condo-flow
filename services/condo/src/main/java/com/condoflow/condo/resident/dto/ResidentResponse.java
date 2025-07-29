package com.condoflow.condo.resident.dto;

import com.condoflow.condo.common.relation.dto.ApartmentResidentResponse;

import java.util.List;

public record ResidentResponse(
        // IDENTIFICATION DATA
        Integer id,
        String keycloakUserId,
        // RESIDENT EXTRA DATA
        String phoneNumber,
        String emergencyContactName,
        String emergencyContactPhone,
        // APARTMENTS
        List<ApartmentResidentResponse> apartmentResidents
) {
}
