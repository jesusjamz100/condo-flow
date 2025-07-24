package com.condoflow.condo.common;

import com.condoflow.condo.apartment.Apartment;
import com.condoflow.condo.resident.Resident;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "apartment_residents")
public class ApartmentResident {

    @EmbeddedId
    private ApartmentResidentId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("apartmentId")
    @JoinColumn(name = "apartment_id")
    private Apartment apartment;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("residentId")
    @JoinColumn(name = "resident_id")
    private Resident resident;

    private boolean mainOccupant;

    public static ApartmentResident create(Apartment apartment, Resident resident, boolean isMainOccupant) {
        ApartmentResident apartmentResident = new ApartmentResident();
        apartmentResident.setApartment(apartment);
        apartmentResident.setResident(resident);
        apartmentResident.setMainOccupant(isMainOccupant);
        apartmentResident.setId(new ApartmentResidentId(apartment.getId(), resident.getId()));

        return apartmentResident;
    }
}
