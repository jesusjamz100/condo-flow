package com.condoflow.condo.resident;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResidentRepository extends JpaRepository<Resident, Integer> {
    Optional<Resident> findByKeycloakUserId(String keycloakId);

    Page<Resident> findByApartmentResidentsApartmentId(int apartmentId, Pageable pageable);

    Optional<Resident> findByDocument(String document);
}
