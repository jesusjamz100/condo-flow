package com.condoflow.expense.expense;

import com.condoflow.expense.expense.dto.ExpenseRequest;
import com.condoflow.expense.expense.dto.ExpenseResponse;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Service
public class ExpenseMapper {
    public ExpenseResponse toExpenseResponse(Expense expense) {
        return new ExpenseResponse(
                expense.getId(),
                expense.getDescription(),
                expense.getAmount(),
                expense.isBilled(),
                expense.getScopeType(),
                expense.getApplicableTowers(),
                expense.getCreatedDate(),
                expense.getLastModifiedDate()
        );
    }

    public Expense toExpense(ExpenseRequest request, Set<Tower> normalizedTowers) {
        return Expense.builder()
                .id(request.id())
                .description(request.description())
                .amount(request.amount())
                .scopeType(request.scopeType())
                .applicableTowers(normalizedTowers)
                .build();
    }
}
