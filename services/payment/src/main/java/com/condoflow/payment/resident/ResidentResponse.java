package com.condoflow.payment.resident;

import com.condoflow.payment.common.ApartmentResidentResponse;

import java.util.List;

public record ResidentResponse(
        // IDENTIFICATION DATA
        Integer id,
        String keycloakUserId,
        // RESIDENT EXTRA DATA
        String document,
        String phoneNumber,
        String emergencyContactName,
        String emergencyContactPhone,
        // APARTMENTS
        List<ApartmentResidentResponse> apartmentResidents
) {
}
