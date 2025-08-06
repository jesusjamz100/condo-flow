package com.condoflow.payment.payment.service;

import com.condoflow.payment.apartment.ApartmentClient;
import com.condoflow.payment.apartment.ApartmentResponse;
import com.condoflow.payment.common.PageResponse;
import com.condoflow.payment.payment.Payment;
import com.condoflow.payment.payment.PaymentMapper;
import com.condoflow.payment.payment.PaymentRepository;
import com.condoflow.payment.payment.PaymentType;
import com.condoflow.payment.payment.dto.PaymentRequest;
import com.condoflow.payment.payment.dto.PaymentResponse;
import com.condoflow.payment.resident.ResidentClient;
import com.condoflow.payment.resident.ResidentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository repository;
    private final PaymentMapper mapper;
    private final ResidentClient residentClient;
    private final ApartmentClient apartmentClient;

    @Override
    public PageResponse<PaymentResponse> findMyPayments(int page, int size, PaymentType type) {
        ResidentResponse resident = residentClient.getMe()
                .orElseThrow(() -> new RuntimeException("Resident not found"));

        Specification<Payment> spec = Specification
                .allOf(
                        byResidentId(resident.id()),
                        type != null ? byPaymentType(type) : null
                );

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<Payment> payments = repository.findAll(spec, pageable);
        List<PaymentResponse> paymentResponse = payments
                .stream()
                .map(mapper::toPaymentResponse)
                .toList();
        return new PageResponse<>(
                paymentResponse,
                payments.getNumber(),
                payments.getSize(),
                payments.getTotalElements(),
                payments.getTotalPages(),
                payments.isFirst(),
                payments.isLast()
        );
    }

    @Override
    public PaymentResponse findMyPaymentById(Integer paymentId) {
        ResidentResponse resident = residentClient.getMe()
                .orElseThrow(() -> new RuntimeException("Resident Not Found"));
        Payment payment = repository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found with ID:: " + paymentId));
        if (resident.id() != payment.getResidentId())
            throw new AccessDeniedException("You don't have permissions to see this payment");
        return mapper.toPaymentResponse(payment);
    }

    @Override
    public PageResponse<PaymentResponse> findMyPaymentsByApartment(Integer apartmentId, int page, int size) {
        ResidentResponse resident = residentClient.getMe()
                .orElseThrow(() -> new RuntimeException("Resident Not Found"));
        ApartmentResponse apartment = apartmentClient.findApartmentById(apartmentId)
                .orElseThrow(() -> new RuntimeException("Apartment Not Found"));
        boolean hasRelation = resident.apartmentResidents().stream()
                .anyMatch(ar ->
                        ar.apartmentId().equals(apartmentId) &&
                        ar.residentId().equals(resident.id())
                );
        if (!hasRelation)
            throw new AccessDeniedException("You can't access payments of this apartment");

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<Payment> payments = repository.findByApartmentId(apartmentId, pageable);
        List<PaymentResponse> paymentResponse = payments
                .stream()
                .map(mapper::toPaymentResponse)
                .toList();

        return new PageResponse<>(
                paymentResponse,
                payments.getNumber(),
                payments.getSize(),
                payments.getTotalElements(),
                payments.getTotalPages(),
                payments.isFirst(),
                payments.isLast()
        );
    }

    @Override
    public void registerPayment(PaymentRequest request) {
        ResidentResponse resident = residentClient.getMe()
                .orElseThrow(() -> new RuntimeException("Resident Not Found"));
        boolean hasRelation = resident.apartmentResidents().stream()
                .anyMatch(ar ->
                        ar.apartmentId().equals(request.apartmentId()) &&
                                ar.residentId().equals(resident.id())
                );
        if (!hasRelation)
            throw new AccessDeniedException("You can't access payments of this apartment");
        if (
                request.type().equals(PaymentType.WIRE) &&
                        request.reference().isEmpty()
        ) {
            throw new RuntimeException("Wire payments should include a reference");
        }
        Payment payment = mapper.toPayment(request);
        repository.save(payment);
    }

    @Override
    public PageResponse<PaymentResponse> findAllPayments(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<Payment> payments = repository.findAll(pageable);
        List<PaymentResponse> paymentResponse = payments
                .stream()
                .map(mapper::toPaymentResponse)
                .toList();
        return new PageResponse<>(
                paymentResponse,
                payments.getNumber(),
                payments.getSize(),
                payments.getTotalElements(),
                payments.getTotalPages(),
                payments.isFirst(),
                payments.isLast()
        );
    }

    @Override
    public PaymentResponse findById(Integer paymentId) {
        Payment payment = repository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found with ID:: " + paymentId));
        return mapper.toPaymentResponse(payment);
    }

    @Override
    public void approvePayment(Integer paymentId) {
        Payment payment = repository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found with ID:: " + paymentId));
        if (payment.isApproved()) throw new RuntimeException("Payment is already approved");
        payment.setApproved(true);
        apartmentClient.updateBalanceFromPayment(payment.getApartmentId(), payment.getAmount());
        repository.save(payment);
    }

    Specification<Payment> byResidentId(Integer residentId) {
        return (root, query, cb) -> cb.equal(root.get("residentId"), residentId);
    }

    Specification<Payment> byPaymentType(PaymentType type) {
        return (root, query, cb) -> cb.equal(root.get("type"), type);
    }
}
