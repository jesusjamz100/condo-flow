package com.condoflow.payment.payment.service;

import com.condoflow.payment.common.PageResponse;
import com.condoflow.payment.payment.dto.PaymentRequest;
import com.condoflow.payment.payment.dto.PaymentResponse;
import org.springframework.security.oauth2.jwt.Jwt;

public interface PaymentService {
    PageResponse<PaymentResponse> findMyPayments(int page, int size);

    PaymentResponse findById(Integer paymentId);

    PageResponse<PaymentResponse> findMyPaymentsByApartment(Integer apartmentId, int page, int size);

    void registerPayment(PaymentRequest request);
}
