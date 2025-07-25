package com.condoflow.condo.resident.dto;

import jakarta.validation.constraints.NotNull;

public record ResidentRequest(
        @NotNull
        String keycloakUserId,
        String phoneNumber,
        String emergencyContactName,
        String emergencyContactPhone,
        @NotNull
        boolean isPrimaryResident
) {
}
