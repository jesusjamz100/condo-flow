package com.condoflow.condo.apartment.dto;

import com.condoflow.condo.apartment.Tower;
import com.condoflow.condo.parking.dto.ParkingSlotResponse;

import java.math.BigDecimal;
import java.util.List;

public record ApartmentResponse(
        Integer id,
        String code,
        Tower tower,
        BigDecimal balance,
        BigDecimal sqm,
        BigDecimal aliquot,
        List<ParkingSlotResponse> parkingSlots
        // todo
//        List<ApartmentResidentResponse> residents
) {
}
