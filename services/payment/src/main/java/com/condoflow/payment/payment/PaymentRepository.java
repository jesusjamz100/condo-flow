package com.condoflow.payment.payment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer>, JpaSpecificationExecutor<Payment> {
    Page<Payment> findByResidentId(Integer residentId, Pageable pageable);

    Page<Payment> findByApartmentId(Integer apartmentId, Pageable pageable);

    List<Payment> findByApartmentIdOrderByCreatedDateDesc(Integer apartmentId);
}
