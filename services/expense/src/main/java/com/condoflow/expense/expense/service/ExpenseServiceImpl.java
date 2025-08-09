package com.condoflow.expense.expense.service;

import com.condoflow.expense.common.PageResponse;
import com.condoflow.expense.exception.ExpenseNotFoundException;
import com.condoflow.expense.expense.*;
import com.condoflow.expense.expense.dto.ExpenseRequest;
import com.condoflow.expense.expense.dto.ExpenseResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository repository;
    private final ExpenseMapper mapper;

    @Override
    public PageResponse<ExpenseResponse> findAllExpenses(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<Expense> expenses = repository.findAll(pageable);
        List<ExpenseResponse> pageResponse = expenses
                .stream()
                .map(mapper::toExpenseResponse)
                .toList();
        return new PageResponse<>(
                pageResponse,
                expenses.getNumber(),
                expenses.getSize(),
                expenses.getTotalElements(),
                expenses.getTotalPages(),
                expenses.isFirst(),
                expenses.isLast()
        );
    }

    @Override
    public ExpenseResponse findExpenseById(Integer expenseId) {
        Expense expense = repository.findById(expenseId)
                .orElseThrow(() -> new ExpenseNotFoundException("Expense not found with with ID:: " + expenseId));
        return mapper.toExpenseResponse(expense);
    }

    @Override
    @Transactional
    public void createExpense(ExpenseRequest request) {
        Set<Tower> normalizedTowers = normalizeApplicableTowers(request.scopeType(), request.applicableTowers());
        Expense expense = mapper.toExpense(request, normalizedTowers);
        repository.save(expense);
    }

    @Override
    public ExpenseResponse updateExpense(ExpenseRequest request) {
        Expense expense = repository.findById(request.id())
                .orElseThrow(() -> new ExpenseNotFoundException("Expense not found with with ID:: " + request.id()));
        Set<Tower> normalizedTowers = normalizeApplicableTowers(request.scopeType(), request.applicableTowers());

        expense.setDescription(request.description());
        expense.setAmount(request.amount());
        expense.setScopeType(request.scopeType());
        expense.setApplicableTowers(normalizedTowers);
        repository.save(expense);
        return mapper.toExpenseResponse(expense);
    }

    @Override
    public void deleteExpenseById(Integer expenseId) {
        if (!repository.existsById(expenseId)) throw new ExpenseNotFoundException("Expense not found with with ID:: " + expenseId);
        repository.deleteById(expenseId);
    }

    private Set<Tower> normalizeApplicableTowers(ScopeType scopeType, Set<Tower> towers) {
        Set<Tower> input = (towers == null) ? EnumSet.noneOf(Tower.class) : EnumSet.copyOf(towers);

        switch (scopeType) {
            case GENERAL -> {
                return EnumSet.noneOf(Tower.class);
            }
            case TOWER -> {
                if (input.size() != 1) {
                    throw new IllegalArgumentException("For TOWER Scope you need exactly 1 tower.");
                }
                return input;
            }
            case SECTOR -> {
                Set<Tower> sectorAB = EnumSet.copyOf(Tower.sectorAB());
                Set<Tower> sectorCD = EnumSet.copyOf(Tower.sectorCD());
                if (!(input.equals(sectorAB) || input.equals(sectorCD))) {
                    throw new IllegalArgumentException("SECTOR Scope only accepts Sectors AB or CD");
                }
                return input;
            }
            default -> throw new IllegalArgumentException("Scope not supported:: " + scopeType);
        }
    }
}
