package com.condoflow.billing.payment;

import java.time.LocalDateTime;

public record PaymentResponse(
        boolean approved,
        LocalDateTime createdDate
) {
}
