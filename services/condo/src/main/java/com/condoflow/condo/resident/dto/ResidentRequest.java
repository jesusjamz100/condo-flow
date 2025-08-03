package com.condoflow.condo.resident.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record ResidentRequest(
        Integer id,
        @NotNull
        String keycloakUserId,
        @NotNull
        @NotBlank
        @Pattern(
                regexp = "^[VE]\\\\d{8}$",
                message = "Document must start with V or E followed by 8 digits"
        )
        String document,
        String phoneNumber,
        String emergencyContactName,
        String emergencyContactPhone,
        @NotNull
        boolean isPrimaryResident
) {
}
