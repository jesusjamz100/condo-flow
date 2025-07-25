package com.condoflow.condo.resident.dto;

public record PublicResidentResponse(
        // IDENTIFICATION DATA
        Integer id,
        String keycloakUserId,
        // RESIDENT EXTRA DATA
        String phoneNumber,
        String emergencyContactName,
        String emergencyContactPhone,
        boolean primaryResident
        // todo implement Apartment management
        // List<ApartmentResidentResponse> apartmentResidents,
        // List<ApartmentResponse>
) {
}
