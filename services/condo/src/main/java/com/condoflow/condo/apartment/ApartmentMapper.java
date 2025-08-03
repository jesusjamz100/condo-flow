package com.condoflow.condo.apartment;

import com.condoflow.condo.apartment.dto.ApartmentRequest;
import com.condoflow.condo.apartment.dto.ApartmentResponse;
import com.condoflow.condo.common.relation.ApartmentResidentMapper;
import com.condoflow.condo.common.relation.dto.ApartmentResidentResponse;
import com.condoflow.condo.parking.dto.ParkingSlotResponse;
import com.condoflow.condo.resident.Resident;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApartmentMapper {

    private final ApartmentResidentMapper apartmentResidentMapper;

    public ApartmentResponse toApartmentResponse(Apartment apartment) {

        List<ParkingSlotResponse> parkingSlots = apartment.getParkingSlots()
                .stream()
                .map(ps -> new ParkingSlotResponse(
                        ps.getId(),
                        ps.getSlotNumber(),
                        ps.getLocation()
                )).toList();

        return new ApartmentResponse(
                apartment.getId(),
                apartment.getCode(),
                apartment.getTower(),
                apartment.getBalance(),
                apartment.getSqm(),
                apartment.getAliquot(),
                parkingSlots,
                apartment.getApartmentResidents().stream()
                        .map(apartmentResidentMapper::toApartmentResidentResponse)
                        .toList()
        );
    }

    public Apartment toApartment(ApartmentRequest request) {
        return Apartment.builder()
                .code(request.code())
                .tower(request.tower())
                .sqm(request.sqm())
                .aliquot(request.aliquot())
                .build();
    }
}
