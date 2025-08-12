package com.condoflow.expense.expense.service;

import com.condoflow.expense.common.PageResponse;
import com.condoflow.expense.exception.ExpenseAlreadyBilledException;
import com.condoflow.expense.exception.ExpenseNotFoundException;
import com.condoflow.expense.expense.*;
import com.condoflow.expense.expense.dto.ExpenseRequest;
import com.condoflow.expense.expense.dto.ExpenseResponse;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.EnumSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository repository;
    private final ExpenseMapper mapper;

    @Override
    public PageResponse<ExpenseResponse> findAllExpenses(
            int page, int size,
            LocalDate startDate, LocalDate endDate
    ) {

        Specification<Expense> spec = Specification.allOf(
                (startDate != null && endDate != null) ? byCreatedBetween(startDate, endDate) : null,
                (startDate != null && endDate == null) ? byCreatedAfter(startDate) : null,
                (startDate == null && endDate != null) ? byCreatedBefore(endDate) : null
        );

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
    @Transactional
    public ExpenseResponse updateExpense(ExpenseRequest request) {
        Expense expense = repository.findById(request.id())
                .orElseThrow(() -> new ExpenseNotFoundException("Expense not found with with ID:: " + request.id()));

        mergeExpense(expense, request);

        Set<Tower> normalizedTowers = normalizeApplicableTowers(request.scopeType(), request.applicableTowers());
        expense.setApplicableTowers(normalizedTowers);

        repository.save(expense);
        return mapper.toExpenseResponse(expense);
    }

    @Override
    public void deleteExpenseById(Integer expenseId) {

        Expense expense = repository.findById(expenseId)
                .orElseThrow(() -> new ExpenseNotFoundException("Expense not found with with ID:: " + expenseId));

        if (expense.isBilled()) {
            throw new ExpenseAlreadyBilledException("Billed expense cannot be deleted");
        }

        repository.deleteById(expenseId);
    }

    @Override
    @Transactional
    public void makeExpenseBilled(Integer expenseId) {
        Expense expense = repository.findById(expenseId)
                .orElseThrow(() -> new ExpenseNotFoundException("Expense not found with with ID:: " + expenseId));
        if (expense.isBilled()) throw new IllegalArgumentException("Expense already billed with ID:: " + expenseId);
        expense.setBilled(true);
        repository.save(expense);
    }

    private static Set<Tower> normalizeApplicableTowers(ScopeType scopeType, Set<Tower> towers) {
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

    private static void mergeExpense(Expense expense, ExpenseRequest request) {

        if (StringUtils.isNotBlank(request.description())) {
            expense.setDescription(request.description());
        }

        if (Objects.nonNull(request.scopeType())) {
            expense.setScopeType(request.scopeType());
        }

        if (Objects.nonNull(request.amount())) {
            if (expense.isBilled() && !Objects.equals(expense.getAmount(), request.amount())) {
                throw new ExpenseAlreadyBilledException("Amount cannot be changed on billed expenses");
            } else {
                expense.setAmount(request.amount());
            }
        }
    }

    public static Specification<Expense> byCreatedBetween(LocalDate startDate, LocalDate endDate) {
        return (root, query, cb) -> cb.between(
                root.get("createdDate"),
                startDate.atStartOfDay(),
                endDate.plusDays(1).atStartOfDay()
        );
    }

    public static Specification<Expense> byCreatedAfter(LocalDate startDate) {
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("createdDate"), startDate.atStartOfDay());
    }

    public static Specification<Expense> byCreatedBefore(LocalDate end) {
        return (root, query, cb) -> cb.lessThan(root.get("createdDate"), end.plusDays(1).atStartOfDay());
    }
}
