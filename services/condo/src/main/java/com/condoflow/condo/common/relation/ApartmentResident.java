package com.condoflow.condo.common.relation;

import com.condoflow.condo.apartment.Apartment;
import com.condoflow.condo.resident.Resident;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import static jakarta.persistence.EnumType.STRING;
import static lombok.AccessLevel.PROTECTED;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor(access = PROTECTED)
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

    @Enumerated(STRING)
    private RoleType roleType;

    public static ApartmentResident create(Apartment apartment, Resident resident, RoleType roleType) {
        ApartmentResident apartmentResident = new ApartmentResident();
        apartmentResident.setApartment(apartment);
        apartmentResident.setResident(resident);
        apartmentResident.setRoleType(roleType);

        // Bi-directional
        apartment.getApartmentResidents().add(apartmentResident);
        resident.getApartmentResidents().add(apartmentResident);
        return apartmentResident;
    }
}
