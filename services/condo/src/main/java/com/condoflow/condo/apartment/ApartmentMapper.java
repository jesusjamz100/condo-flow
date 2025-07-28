package com.condoflow.condo.apartment;

import com.condoflow.condo.apartment.dto.ApartmentRequest;
import com.condoflow.condo.apartment.dto.ApartmentResponse;
import com.condoflow.condo.parking.dto.ParkingSlotResponse;
import com.condoflow.condo.resident.Resident;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApartmentMapper {
    public ApartmentResponse toApartmentResponse(Apartment apartment) {

        List<ParkingSlotResponse> parkingSlots = apartment.getParkingSlots()
                .stream()
                .map(ps -> new ParkingSlotResponse(
                        ps.getId(),
                        ps.getSlotNumber(),
                        ps.getLocation()
                )).toList();

        // todo
//        List<ApartmentResidentResponse> residents = apartment.getApartmentResidents().stream()
//                .map(ar -> {
//                    Resident r = ar.getResident();
//                    return new ApartmentResidentResponse(
//                            r.getId(),
//                            r.getKeycloakUserId(),
//                            ar.getRoleType(),        // OWNER, OCCUPANT, MAIN_OCCUPANT…
//                            ar.getAssignedDate()
//                    );
//                })
//                .toList();

        return new ApartmentResponse(
                apartment.getId(),
                apartment.getCode(),
                apartment.getTower(),
                apartment.getBalance(),
                apartment.getSqm(),
                apartment.getAliquot(),
                parkingSlots
                // residents
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
