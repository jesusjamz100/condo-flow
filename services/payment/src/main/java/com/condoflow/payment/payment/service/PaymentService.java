package com.condoflow.payment.payment.service;

import com.condoflow.payment.common.PageResponse;
import com.condoflow.payment.payment.PaymentType;
import com.condoflow.payment.payment.dto.PaymentRequest;
import com.condoflow.payment.payment.dto.PaymentResponse;

import java.util.Optional;

public interface PaymentService {
    PageResponse<PaymentResponse> findMyPayments(int page, int size, PaymentType type);

    PaymentResponse findMyPaymentById(Integer paymentId);

    PageResponse<PaymentResponse> findMyPaymentsByApartment(Integer apartmentId, int page, int size, PaymentType type);

    void registerPayment(PaymentRequest request);

    PageResponse<PaymentResponse> findAllPayments(int page, int size, PaymentType type);

    PaymentResponse findById(Integer paymentId);

    void approvePayment(Integer paymentId);

    Optional<PaymentResponse> findLastPaymentByApartmentId(Integer apartmentId);

    PageResponse<PaymentResponse> findAllPaymentsByApartmentId(Integer apartmentId, int page, int size);
}
