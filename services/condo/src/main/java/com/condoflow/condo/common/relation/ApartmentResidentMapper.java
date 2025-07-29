package com.condoflow.condo.common.relation;

import com.condoflow.condo.common.relation.dto.ApartmentResidentResponse;
import org.springframework.stereotype.Service;

@Service
public class ApartmentResidentMapper {

    public ApartmentResidentResponse toApartmentResidentResponse(ApartmentResident apartmentResident) {
        return new ApartmentResidentResponse(
                apartmentResident.getApartment().getId(),
                apartmentResident.getResident().getId(),
                apartmentResident.getRoleType()
        );
    }
}
