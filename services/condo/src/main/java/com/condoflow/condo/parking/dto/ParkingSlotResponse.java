package com.condoflow.condo.parking.dto;

import com.condoflow.condo.parking.Location;

public record ParkingSlotResponse (
        Integer id,
        Integer slotNumber,
        Location location
) {
}
