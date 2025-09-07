package com.condoflow.payment.payment.dto;

import com.condoflow.payment.payment.PaymentType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentResponse(
        Integer id,
        BigDecimal amount,
        String description,
        PaymentType type,
        String reference,
        Integer apartmentId,
        Integer residentId,
        boolean approved,
        LocalDateTime createdDate
) {
}
