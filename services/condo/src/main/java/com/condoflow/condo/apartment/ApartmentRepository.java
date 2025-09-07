package com.condoflow.condo.apartment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApartmentRepository extends JpaRepository<Apartment, Integer>, JpaSpecificationExecutor<Apartment> {

    Page<Apartment> findByApartmentResidentsResidentKeycloakUserId(String keycloakUserId, Pageable pageable);

    boolean existsByCode(String code);

    @Query("""
            select a
            from Apartment a
            join a.apartmentResidents ar
            where a.id = :apartmentId
                and ar.resident.id = :residentId
            """)
    Optional<Apartment> findApartmentByIdAndResidentId(@Param("apartmentId") int apartmentId,
                                                       @Param("residentId") int residentId);

    Page<Apartment> findByApartmentResidentsResidentId(int residentId, Pageable pageable);

    List<Apartment> findByApartmentResidentsResidentId(int residentId);

    boolean existsByIdAndApartmentResidentsResidentId(int apartmentId, Integer id);
}
