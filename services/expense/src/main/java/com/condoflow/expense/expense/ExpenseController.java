package com.condoflow.expense.expense;

import com.condoflow.expense.common.PageResponse;
import com.condoflow.expense.exception.ExpenseAlreadyBilledException;
import com.condoflow.expense.expense.dto.ExpenseRequest;
import com.condoflow.expense.expense.dto.ExpenseResponse;
import com.condoflow.expense.expense.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequiredArgsConstructor
@RequestMapping("/expenses")
public class ExpenseController {

    private final ExpenseService service;

    @GetMapping("/")
    public ResponseEntity<PageResponse<ExpenseResponse>> getAllExpensesForInvoice(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size,
            @RequestParam(name = "billed", required = false) Boolean billed,
            @RequestParam(name = "tower", required = false) Tower tower,
            @RequestParam(name = "startDate", required = false) LocalDate startDate,
            @RequestParam(name = "endDate", required = false) LocalDate endDate
    ) {
        return ResponseEntity.ok(service.findExpensesByInvoice(page, size, billed, startDate, endDate, tower));
    }

    @GetMapping("/admin")
    public ResponseEntity<PageResponse<ExpenseResponse>> getAllExpenses(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size,
            @RequestParam(name = "billed", required = false) Boolean billed,
            @RequestParam(name = "tower", required = false) Tower tower,
            @RequestParam(name = "startDate", required = false) LocalDate startDate,
            @RequestParam(name = "endDate", required = false) LocalDate endDate
            ) {
        return ResponseEntity.ok(service.findAllExpenses(page, size, billed, startDate, endDate, tower));
    }

    @GetMapping("/admin/{expenseId}")
    public ResponseEntity<ExpenseResponse> getExpenseById(
            @PathVariable("expenseId") Integer expenseId
    ) {
        return ResponseEntity.ok(service.findExpenseById(expenseId));
    }

    @PostMapping("/admin")
    public ResponseEntity<Void> createExpense(
            @RequestBody @Valid ExpenseRequest request
    ) {
        service.createExpense(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/admin/update")
    public ResponseEntity<ExpenseResponse> updateExpense(
            @RequestBody @Valid ExpenseRequest request
    ) {
        return ResponseEntity.ok(service.updateExpense(request));
    }

    @DeleteMapping("/admin/{expenseId}")
    public ResponseEntity<Void> deleteExpense(
            @PathVariable("expenseId") Integer expenseId
    ) {
        service.deleteExpenseById(expenseId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/admin/{expenseId}/makeBilled")
    public ResponseEntity<Void> makeExpenseBilled(
            @PathVariable("expenseId") Integer expenseId
    ) {
        service.makeExpenseBilled(expenseId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
