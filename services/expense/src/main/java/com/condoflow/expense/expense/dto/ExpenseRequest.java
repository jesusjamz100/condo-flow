package com.condoflow.expense.expense.dto;

import com.condoflow.expense.expense.ScopeType;
import com.condoflow.expense.expense.Tower;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.Set;

public record ExpenseRequest (
        Integer id,
        @NotNull
        @NotBlank
        String description,
        @NotNull
        @DecimalMin(value = "0.00", inclusive = false)
        BigDecimal amount,
        @NotNull
        ScopeType scopeType,
        Set<Tower> applicableTowers
) {
}
