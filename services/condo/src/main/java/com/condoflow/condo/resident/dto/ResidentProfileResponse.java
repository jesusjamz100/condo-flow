package com.condoflow.condo.resident.dto;

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
        String phoneNumber,
        String emergencyContactName,
        String emergencyContactPhone,
        boolean primaryResident
        // todo implement Apartment management
        // List<ApartmentResidentResponse> apartmentResidents,
        // List<ApartmentResponse>
) {
}
