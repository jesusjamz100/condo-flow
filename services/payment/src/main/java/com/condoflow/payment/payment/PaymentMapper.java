package com.condoflow.payment.payment;

import com.condoflow.payment.payment.dto.PaymentRequest;
import com.condoflow.payment.payment.dto.PaymentResponse;
import org.springframework.stereotype.Service;

@Service
public class PaymentMapper {

    public PaymentResponse toPaymentResponse(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getAmount(),
                payment.getDescription(),
                payment.getApartmentId(),
                payment.getResidentId(),
                payment.isApproved(),
                payment.getCreatedDate()
        );
    }

    public Payment toPayment(PaymentRequest request) {
        return Payment.builder()
                .amount(request.amount())
                .apartmentId(request.apartmentId())
                .residentId(request.residentId())
                .build();
    }
}
