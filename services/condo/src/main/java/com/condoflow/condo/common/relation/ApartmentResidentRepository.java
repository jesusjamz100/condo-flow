package com.condoflow.condo.common.relation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApartmentResidentRepository extends JpaRepository<ApartmentResident, ApartmentResidentId> {
    boolean existsByApartmentIdAndResidentId(int apartmentId, int residentId);
}
