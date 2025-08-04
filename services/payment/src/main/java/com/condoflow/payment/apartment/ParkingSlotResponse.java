package com.condoflow.payment.apartment;

public record ParkingSlotResponse (
        Integer id,
        Integer slotNumber,
        String location
) {
}
