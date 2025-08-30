package com.condoflow.billing.invoice.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;

public record InvoiceResponse(
        Integer id,
        BigDecimal amount,
        BigDecimal discountAmount,
        BigDecimal penaltyAmount,
        BigDecimal finalAmount,
        Integer apartmentId,
        YearMonth period,
        LocalDateTime createdDate,
        LocalDateTime lastModifiedDate
) {
}
