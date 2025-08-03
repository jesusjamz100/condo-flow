package com.condoflow.condo.common.relation.dto;

import com.condoflow.condo.common.relation.RoleType;

public record ApartmentResidentResponse(
        Integer apartmentId,
        Integer residentId,
        RoleType roleType
) {
}
