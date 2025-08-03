package com.condoflow.condo.resident;

import com.condoflow.condo.common.relation.ApartmentResidentMapper;
import com.condoflow.condo.resident.dto.ResidentResponse;
import com.condoflow.condo.resident.dto.ResidentRequest;
import com.condoflow.condo.resident.dto.ResidentProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ResidentMapper {

    private final ApartmentResidentMapper apartmentResidentMapper;

    public ResidentProfileResponse toResidentProfileResponse(Resident resident, Jwt jwt) {
        return new ResidentProfileResponse(
                resident.getId(),
                resident.getKeycloakUserId(),
                jwt.getClaim("preferred_username"),
                jwt.getClaim("email"),
                jwt.getClaim("given_name"),
                jwt.getClaim("family_name"),
                resident.getDocument(),
                resident.getPhoneNumber(),
                resident.getEmergencyContactName(),
                resident.getEmergencyContactPhone(),
                resident.getApartmentResidents().stream()
                        .map(apartmentResidentMapper::toApartmentResidentResponse)
                        .toList()
        );
    }

    public ResidentResponse toResidentResponse(Resident resident) {
        return new ResidentResponse(
                resident.getId(),
                resident.getKeycloakUserId(),
                resident.getDocument(),
                resident.getPhoneNumber(),
                resident.getEmergencyContactName(),
                resident.getEmergencyContactPhone(),
                resident.getApartmentResidents().stream()
                        .map(apartmentResidentMapper::toApartmentResidentResponse)
                        .toList()
        );
    }

    public Resident toResident(ResidentRequest request) {
        return Resident.builder()
                .keycloakUserId(request.keycloakUserId())
                .document(request.document())
                .emergencyContactName(request.emergencyContactName())
                .emergencyContactPhone(request.emergencyContactPhone())
                .phoneNumber(request.phoneNumber()).build();
    }
}
