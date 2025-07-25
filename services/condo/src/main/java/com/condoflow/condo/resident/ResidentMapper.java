package com.condoflow.condo.resident;

import com.condoflow.condo.resident.dto.PublicResidentResponse;
import com.condoflow.condo.resident.dto.ResidentRequest;
import com.condoflow.condo.resident.dto.ResidentResponse;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Service
public class ResidentMapper {

    public ResidentResponse toResidentResponse(Resident resident, Jwt jwt) {
        return new ResidentResponse(
                resident.getId(),
                resident.getKeycloakUserId(),
                jwt.getClaim("given_name"),
                jwt.getClaim("family_name"),
                jwt.getClaim("preferred_username"),
                jwt.getClaim("email"),
                resident.getPhoneNumber(),
                resident.getEmergencyContactName(),
                resident.getEmergencyContactPhone(),
                resident.isPrimaryResident()
                // todo implement apartment management
                // resident.getApartmentResidents(),
                // resident.getOwnedApartments()
        );
    }

    public PublicResidentResponse toPublicResidentResponse(Resident resident) {
        return new PublicResidentResponse(
                resident.getId(),
                resident.getKeycloakUserId(),
                resident.getPhoneNumber(),
                resident.getEmergencyContactName(),
                resident.getEmergencyContactPhone(),
                resident.isPrimaryResident()
        );
    }

    public Resident toResident(ResidentRequest request) {
        return Resident.builder()
                .keycloakUserId(request.keycloakUserId())
                .emergencyContactName(request.emergencyContactName())
                .emergencyContactPhone(request.emergencyContactPhone())
                .phoneNumber(request.phoneNumber())
                .primaryResident(request.isPrimaryResident()).build();
    }
}
