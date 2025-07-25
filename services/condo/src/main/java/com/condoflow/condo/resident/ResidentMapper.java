package com.condoflow.condo.resident;

import com.condoflow.condo.resident.dto.ResidentResponse;
import org.springframework.stereotype.Service;

@Service
public class ResidentMapper {

    public ResidentResponse toResidentResponse(Resident resident) {
        return new ResidentResponse(
                resident.getId(),
                resident.getKeycloakUserId(),
                resident.getPhoneNumber(),
                resident.getEmergencyContactName(),
                resident.getEmergencyContactPhone(),
                resident.isPrimaryResident()
                // todo implement apartment management
                // resident.getApartmentResidents(),
                // resident.getOwnedApartments()
        );
    }
}
