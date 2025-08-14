package com.condoflow.billing.expense;

import com.condoflow.billing.common.PageResponse;
import com.condoflow.billing.config.feign.FeignClientConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;

@FeignClient(
    name = "expense-client",
    url = "${application.config.expense-url}",
    configuration = FeignClientConfig.class
)
public interface ExpenseClient {

    @GetMapping("/admin")
    PageResponse<ExpenseResponse> getAllExpenses(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size,
            @RequestParam(name = "startDate", required = false) LocalDate startDate,
            @RequestParam(name = "endDate", required = false) LocalDate endDate
    );

    @PutMapping("/admin/{expenseId}/makeBilled")
    void makeExpenseBilled(@PathVariable("expenseId") Integer expenseId);
}
