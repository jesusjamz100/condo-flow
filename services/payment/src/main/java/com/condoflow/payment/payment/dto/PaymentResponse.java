package com.condoflow.payment.payment.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentResponse(
        Integer id,
        BigDecimal amount,
        String description,
        Integer apartmentId,
        Integer residentId,
        boolean approved,
        LocalDateTime createdDate
) {
}
