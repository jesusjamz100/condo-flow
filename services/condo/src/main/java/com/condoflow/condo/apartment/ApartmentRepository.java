package com.condoflow.condo.apartment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ApartmentRepository extends JpaRepository<Apartment, Integer> {

    @Query("""
            select a
            from ApartmentResident ar
            join ar.apartment a
            join ar.resident r
            where r.keycloakUserId = :keycloakUserId
            """)
    Page<Apartment> findAllByResidentKeycloakUserId(Pageable pageable,
                                                    @Param("keycloakUserId") String keycloakUserId);
}
