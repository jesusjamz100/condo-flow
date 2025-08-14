package com.condoflow.billing.invoice.service;

import com.condoflow.billing.apartment.ApartmentClient;
import com.condoflow.billing.apartment.ApartmentResponse;
import com.condoflow.billing.expense.ExpenseClient;
import com.condoflow.billing.expense.ExpenseResponse;
import com.condoflow.billing.invoice.Invoice;
import com.condoflow.billing.invoice.InvoiceRepository;
import com.condoflow.billing.payment.PaymentClient;
import com.condoflow.billing.payment.PaymentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository repository;
    private final ExpenseClient expenseClient;
    private final ApartmentClient apartmentClient;
    private final PaymentClient paymentClient;

    private static final BigDecimal ZERO = BigDecimal.ZERO;
    private static final BigDecimal TEN_PERCENT = new BigDecimal("0.10");
    private static final BigDecimal TWO = new BigDecimal("2");
    private static final BigDecimal FOUR = new BigDecimal("4");

    @Override
    @Transactional
    public void generateInvoices(LocalDate startDate, LocalDate endDate) {
        List<ExpenseResponse> expenses = expenseClient.getAllExpenses(0, 1000, startDate, endDate).getContent();
        List<ApartmentResponse> apartments = apartmentClient.getAllApartments(0, 250).getContent();
        YearMonth period = YearMonth.from(startDate);

        for (ApartmentResponse apartment : apartments) {

            boolean exists = repository.existsByApartmentIdAndPeriod(apartment.id(), period);
            if (exists) {
                continue;
            }

            BigDecimal balance = apartment.balance();
            Optional<PaymentResponse> lastPayment = paymentClient.getLastPaymentByApartmentId(apartment.id());
            BigDecimal newBalance;
            BigDecimal amount = ZERO;
            BigDecimal discountAmount;
            BigDecimal penaltyAmount;

            for (ExpenseResponse expense : expenses) {
                if (!expense.billed()) {
                    switch (expense.scopeType()) {
                        case "GENERAL" -> amount = amount.add(expense.amount().multiply(apartment.aliquot()));
                        case "SECTOR" -> {
                            if (expense.applicableTowers().contains(apartment.tower())) {
                                amount = amount
                                        .add(expense.amount()
                                                .multiply(apartment.aliquot()
                                                        .multiply(TWO
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
                                                        .multiply(FOUR
                                                        )
                                                )
                                        );
                            }
                        }
                        default -> throw new RuntimeException("Scope not supported: " + expense.scopeType());
                    }
                }
            }

            if (balance.compareTo(BigDecimal.ZERO) < 0) {
                penaltyAmount = amount.multiply(TEN_PERCENT);
                discountAmount = ZERO;
            } else if (lastPayment
                    .map(PaymentResponse::createdDate)
                    .map(date -> date.isBefore(startDate.plusDays(5).atStartOfDay()))
                    .orElse(false)
            ) {
                penaltyAmount = ZERO;
                discountAmount = amount.multiply(TEN_PERCENT);;
            } else {
                penaltyAmount = ZERO;
                discountAmount = ZERO;
            }

            newBalance = apartment.balance().subtract(amount).subtract(penaltyAmount).add(discountAmount);

            apartmentClient.updateBalance(apartment.id(), newBalance);
            repository.save(
                    Invoice.builder()
                            .apartmentId(apartment.id())
                            .amount(amount)
                            .discountAmount(discountAmount)
                            .penaltyAmount(penaltyAmount)
                            .period(period)
                            .build()
            );
        }

        for (ExpenseResponse expense : expenses) {
            expenseClient.makeExpenseBilled(expense.id());
        }
    }
}
