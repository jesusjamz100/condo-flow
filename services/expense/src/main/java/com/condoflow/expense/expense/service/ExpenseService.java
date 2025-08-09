package com.condoflow.expense.expense.service;

import com.condoflow.expense.common.PageResponse;
import com.condoflow.expense.expense.dto.ExpenseRequest;
import com.condoflow.expense.expense.dto.ExpenseResponse;

public interface ExpenseService {
    PageResponse<ExpenseResponse> findAllExpenses(int page, int size);

    ExpenseResponse findExpenseById(Integer expenseId);

    void createExpense(ExpenseRequest request);

    ExpenseResponse updateExpense(ExpenseRequest request);

    void deleteExpenseById(Integer expenseId);
}
