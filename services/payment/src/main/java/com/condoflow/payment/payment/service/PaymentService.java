package com.condoflow.payment.payment.service;

import com.condoflow.payment.common.PageResponse;
import com.condoflow.payment.payment.PaymentType;
import com.condoflow.payment.payment.dto.PaymentRequest;
import com.condoflow.payment.payment.dto.PaymentResponse;

public interface PaymentService {
    PageResponse<PaymentResponse> findMyPayments(int page, int size, PaymentType type);

    PaymentResponse findMyPaymentById(Integer paymentId);

    PageResponse<PaymentResponse> findMyPaymentsByApartment(Integer apartmentId, int page, int size);

    void registerPayment(PaymentRequest request);

    PageResponse<PaymentResponse> findAllPayments(int page, int size);

    PaymentResponse findById(Integer paymentId);

    void approvePayment(Integer paymentId);
}
