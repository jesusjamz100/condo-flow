package com.condoflow.payment.payment.dto;

import com.condoflow.payment.payment.PaymentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record PaymentRequest(
        Integer id,
        @NotNull
        @Positive
        BigDecimal amount,
        @NotNull
        PaymentType type,
        String reference,
        @NotBlank
        @NotNull
        String description,
        @NotNull
        @Positive
        Integer apartmentId,
        @NotNull
        @Positive
        Integer residentId
) {
}
