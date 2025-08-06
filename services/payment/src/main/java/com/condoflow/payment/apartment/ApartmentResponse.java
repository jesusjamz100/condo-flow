package com.condoflow.payment.apartment;

import com.condoflow.payment.common.ApartmentResidentResponse;

import java.math.BigDecimal;
import java.util.List;

public record ApartmentResponse(
        Integer id,
        String code,
        String tower,
        BigDecimal balance,
        BigDecimal sqm,
        BigDecimal aliquot,
        List<ParkingSlotResponse> parkingSlots,
        List<ApartmentResidentResponse> apartmentResidents
) {
}
