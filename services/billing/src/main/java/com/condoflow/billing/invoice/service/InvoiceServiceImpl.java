package com.condoflow.billing.invoice.service;

import com.condoflow.billing.apartment.ApartmentClient;
import com.condoflow.billing.apartment.ApartmentResponse;
import com.condoflow.billing.expense.ExpenseClient;
import com.condoflow.billing.expense.ExpenseResponse;
import com.condoflow.billing.invoice.Invoice;
import com.condoflow.billing.invoice.InvoiceRepository;
import com.condoflow.billing.payment.PaymentClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository repository;
    private final ExpenseClient expenseClient;
    private final ApartmentClient apartmentClient;
    private final PaymentClient paymentClient;

    @Override
    public void generateInvoices(LocalDate startDate, LocalDate endDate) {
        List<ExpenseResponse> expenses = expenseClient.getAllExpenses(0, 1000, startDate, endDate).getContent();
        List<ApartmentResponse> apartments = apartmentClient.getAllApartments(0, 250).getContent();

        for (ApartmentResponse apartment : apartments) {
            BigDecimal balance = apartment.balance();
            LocalDateTime lastPaymentDate = paymentClient.getLastPaymentByApartmentId(apartment.id())
                    .createdDate();
            BigDecimal newBalance;
            BigDecimal amount = new BigDecimal("0");
            BigDecimal discountAmount;
            BigDecimal penaltyAmount;

            for (ExpenseResponse expense : expenses) {
                switch (expense.scopeType()) {
                    case "GENERAL" -> amount = amount.add(expense.amount().multiply(apartment.aliquot()));
                    case "SECTOR" -> {
                        if (expense.applicableTowers().contains(apartment.tower())) {
                            amount = amount
                                    .add(expense.amount()
                                            .multiply(apartment.aliquot()
                                                    .multiply(new BigDecimal("2")
                                                    )
                                            )
                                    );
                        }
                    }
                    case "TOWER" -> {
                        if (expense.applicableTowers().contains(apartment.tower())) {
                            amount = amount
                                    .add(expense.amount()
                                            .multiply(apartment.aliquot()
                                                    .multiply(new BigDecimal("4")
                                                    )
                                            )
                                    );
                        }
                    }
                    default -> throw new RuntimeException("Scope not supported: " + expense.scopeType());
                }
            }

            if (balance.compareTo(BigDecimal.ZERO) < 0) {
                penaltyAmount = amount.multiply(new BigDecimal("0.10"));
                discountAmount = new BigDecimal("0");
            } else if (lastPaymentDate.isBefore(startDate.plusDays(5).atStartOfDay())) {
                penaltyAmount = new BigDecimal("0");
                discountAmount = amount.multiply(new BigDecimal("0.10"));;
            } else {
                penaltyAmount = new BigDecimal("0");
                discountAmount = new BigDecimal("0");
            }

            newBalance = apartment.balance().add(penaltyAmount).subtract(discountAmount);

            apartmentClient.updateBalance(apartment.id(), newBalance);
            repository.save(
                    Invoice.builder()
                            .apartmentId(apartment.id())
                            .amount(amount)
                            .discountAmount(discountAmount)
                            .penaltyAmount(penaltyAmount)
                            .build()
            );
        }
    }
}
