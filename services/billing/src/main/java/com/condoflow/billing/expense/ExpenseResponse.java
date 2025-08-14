package com.condoflow.billing.expense;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

public record ExpenseResponse(
        Integer id,
        BigDecimal amount,
        boolean billed,
        String scopeType,
        Set<String> applicableTowers,
        LocalDateTime createdDate
) {
}
