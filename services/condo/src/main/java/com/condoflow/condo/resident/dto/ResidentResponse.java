package com.condoflow.condo.resident.dto;

import java.util.List;

public record ResidentResponse (
        Integer id,
        String keycloakUserId,
        String phoneNumber,
        String emergencyContactName,
        String emergencyContactPhone,
        boolean primaryResident
        // todo implement Apartment management
        // List<ApartmentResidentResponse> apartmentResidents,
        // List<ApartmentResponse>
) {
}
