package com.condoflow.payment.payment.service;

import com.condoflow.payment.common.PageResponse;
import com.condoflow.payment.payment.Payment;
import com.condoflow.payment.payment.PaymentMapper;
import com.condoflow.payment.payment.PaymentRepository;
import com.condoflow.payment.payment.dto.PaymentRequest;
import com.condoflow.payment.payment.dto.PaymentResponse;
import com.condoflow.payment.resident.ResidentClient;
import com.condoflow.payment.resident.ResidentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository repository;
    private final PaymentMapper mapper;
    private final ResidentClient residentClient;

    @Override
    public PageResponse<PaymentResponse> findMyPayments(int page, int size) {
        ResidentResponse resident = residentClient.getMe()
                .orElseThrow(() -> new RuntimeException("Resident not found"));
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<Payment> payments = repository.findByResidentId(resident.id(), pageable);
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
        ResidentResponse resident = residentClient.getMe()
                .orElseThrow(() -> new RuntimeException("Resident Not Found"));
        Payment payment = repository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Resident not found"));
        if (resident.id() != payment.getResidentId())
            throw new AccessDeniedException("You don't have permissions to see this payment");
        return mapper.toPaymentResponse(payment);
    }

    @Override
    public PageResponse<PaymentResponse> findMyPaymentsByApartment(Integer apartmentId, int page, int size) {
        ResidentResponse resident = residentClient.getMe()
                .orElseThrow(() -> new RuntimeException("Resident Not Found"));
        boolean hasRelation = resident.apartmentResidents().stream()
                .anyMatch(ar ->
                        ar.apartmentId().equals(apartmentId) &&
                        ar.residentId().equals(resident.id())
                );
        if (!hasRelation)
            throw new AccessDeniedException("No tienes permisos para consultar pagos de este apartamento");

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
            throw new AccessDeniedException("No tienes permisos para consultar pagos de este apartamento");
        Payment payment = mapper.toPayment(request);
        repository.save(payment);
    }
}
