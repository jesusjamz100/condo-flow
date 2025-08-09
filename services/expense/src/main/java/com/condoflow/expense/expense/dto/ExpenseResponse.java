package com.condoflow.expense.expense.dto;

import com.condoflow.expense.expense.ScopeType;
import com.condoflow.expense.expense.Tower;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

public record ExpenseResponse(
        Integer id,
        String description,
        BigDecimal amount,
        ScopeType scopeType,
        Set<Tower> applicableTowers,
        LocalDateTime createdDate,
        LocalDateTime lastModifiedDate
) {
}
