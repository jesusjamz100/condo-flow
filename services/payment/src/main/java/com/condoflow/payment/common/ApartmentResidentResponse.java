package com.condoflow.payment.common;

public record ApartmentResidentResponse(
        Integer apartmentId,
        Integer residentId,
        String roleType
) {
}
