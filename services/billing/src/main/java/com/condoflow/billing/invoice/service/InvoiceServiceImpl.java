package com.condoflow.billing.invoice.service;

import com.condoflow.billing.apartment.ApartmentClient;
import com.condoflow.billing.apartment.ApartmentResponse;
import com.condoflow.billing.expense.ExpenseClient;
import com.condoflow.billing.expense.ExpenseResponse;
import com.condoflow.billing.invoice.Invoice;
import com.condoflow.billing.invoice.InvoiceRepository;
import com.condoflow.billing.invoice.dto.InvoiceResponse;
import com.condoflow.billing.payment.PaymentClient;
import com.condoflow.billing.payment.PaymentResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.MathContext;
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
    public List<InvoiceResponse> getMyInvoices(Integer apartmentId, LocalDate startDate, LocalDate endDate) {
        List<ApartmentResponse> apartments = apartmentClient.getMyApartments(0, 250).getContent();
        List<Integer> apartmentIds = apartments.stream()
                .map(ApartmentResponse::id)
                .toList();

        if (apartmentIds.isEmpty()) {
            return List.of();
        }

        Specification<Invoice> spec = Specification.allOf(
                byApartmentIdIn(apartmentIds),
                apartmentId != null ? byApartmentId(apartmentId) : null,
                (startDate != null && endDate != null) ? byCreatedBetween(startDate, endDate) : null,
                (startDate != null && endDate == null) ? byCreatedAfter(startDate) : null,
                (startDate == null && endDate != null) ? byCreatedBefore(endDate) : null
        );

        List<Invoice> invoices = repository.findAll(spec);

        return invoices.stream()
                .map(invoice -> new InvoiceResponse(
                        invoice.getId(),
                        invoice.getAmount(),
                        invoice.getDiscountAmount(),
                        invoice.getPenaltyAmount(),
                        invoice.getFinalAmount(),
                        invoice.getApartmentId(),
                        invoice.getPeriod(),
                        invoice.getCreatedDate(),
                        invoice.getLastModifiedDate()
                ))
                .toList();
    }

    @Override
    public InvoiceResponse getMyInvoiceById(Integer invoiceId) {
        List<ApartmentResponse> apartments = apartmentClient.getMyApartments(0, 250).getContent();
        List<Integer> apartmentIds = apartments.stream()
                .map(ApartmentResponse::id)
                .toList();

        if (apartmentIds.isEmpty()) {
            throw new AccessDeniedException("No tiene apartamentos asignados");
        }

        Invoice invoice = repository.findById(invoiceId)
                .orElseThrow(() -> new EntityNotFoundException("Invoice no encontrado"));

        if (!apartmentIds.contains(invoice.getApartmentId())) {
            throw new AccessDeniedException("No tiene permiso para ver este invoice");
        }

        return new InvoiceResponse(
                invoice.getId(),
                invoice.getAmount(),
                invoice.getDiscountAmount(),
                invoice.getPenaltyAmount(),
                invoice.getFinalAmount(),
                invoice.getApartmentId(),
                invoice.getPeriod(),
                invoice.getCreatedDate(),
                invoice.getLastModifiedDate()
        );
    }

    @Override
    @Transactional
    public void generateInvoices(LocalDate startDate, LocalDate endDate) {
        List<ExpenseResponse> expenses = expenseClient.getAllExpenses(0, 1000, startDate, endDate).getContent();
        List<ApartmentResponse> apartments = apartmentClient.getAllApartments(0, 250).getContent();
        YearMonth period = YearMonth.from(startDate);
        MathContext mc = new MathContext(3);

        for (ApartmentResponse apartment : apartments) {

            boolean exists = repository.existsByApartmentIdAndPeriod(apartment.id(), period);
            if (exists) {
                continue;
            }

            BigDecimal balance = apartment.balance();
            Optional<PaymentResponse> lastPayment = paymentClient.getLastPaymentByApartmentId(apartment.id());
            BigDecimal finalAmount;
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
                                                        .multiply(TWO)
                                                )
                                        );
                            }
                        }
                        case "TOWER" -> {
                            if (expense.applicableTowers().contains(apartment.tower())) {
                                amount = amount
                                        .add(expense.amount()
                                                .multiply(apartment.aliquot()
                                                        .multiply(FOUR)
                                                )
                                        );
                            }
                        }
                        default -> throw new RuntimeException("Scope not supported: " + expense.scopeType());
                    }
                }
            }

            if (balance.compareTo(BigDecimal.ZERO) < 0) {
                penaltyAmount = amount.multiply(TEN_PERCENT).round(mc);
                discountAmount = ZERO;
            } else if (lastPayment
                    .filter(PaymentResponse::approved)
                    .map(PaymentResponse::createdDate)
                    .map(date -> date.isBefore(startDate.plusDays(5).atStartOfDay()))
                    .orElse(false)
            ) {
                penaltyAmount = ZERO;
                discountAmount = amount.multiply(TEN_PERCENT).round(mc);
            } else {
                penaltyAmount = ZERO;
                discountAmount = ZERO;
            }

            finalAmount = amount.add(penaltyAmount).subtract(discountAmount).round(mc);

            apartmentClient.updateBalanceFromInvoice(apartment.id(), finalAmount);
            repository.save(
                    Invoice.builder()
                            .apartmentId(apartment.id())
                            .amount(amount.round(mc))
                            .discountAmount(discountAmount)
                            .penaltyAmount(penaltyAmount)
                            .finalAmount(finalAmount)
                            .period(period)
                            .build()
            );
        }

        for (ExpenseResponse expense : expenses) {
            expenseClient.makeExpenseBilled(expense.id());
        }
    }

    @Override
    public List<InvoiceResponse> getAllInvoices(Integer apartmentId, LocalDate startDate, LocalDate endDate) {

        Specification<Invoice> spec = Specification.allOf(
                apartmentId != null ? byApartmentId(apartmentId) : null,
                (startDate != null && endDate != null) ? byCreatedBetween(startDate, endDate) : null,
                (startDate != null && endDate == null) ? byCreatedAfter(startDate) : null,
                (startDate == null && endDate != null) ? byCreatedBefore(endDate) : null
        );

        List<Invoice> invoices = repository.findAll(spec);

        return invoices.stream()
                .map(invoice -> new InvoiceResponse(
                        invoice.getId(),
                        invoice.getAmount(),
                        invoice.getDiscountAmount(),
                        invoice.getPenaltyAmount(),
                        invoice.getFinalAmount(),
                        invoice.getApartmentId(),
                        invoice.getPeriod(),
                        invoice.getCreatedDate(),
                        invoice.getLastModifiedDate()
                ))
                .toList();
    }

    @Override
    public InvoiceResponse getInvoiceById(Integer invoiceId) {
        Invoice invoice = repository.findById(invoiceId)
                .orElseThrow(() -> new EntityNotFoundException("Invoice no encontrado"));
        return new InvoiceResponse(
                invoice.getId(),
                invoice.getAmount(),
                invoice.getDiscountAmount(),
                invoice.getPenaltyAmount(),
                invoice.getFinalAmount(),
                invoice.getApartmentId(),
                invoice.getPeriod(),
                invoice.getCreatedDate(),
                invoice.getLastModifiedDate()
        );
    }

    private Specification<Invoice> byApartmentIdIn(List<Integer> apartmentIds) {
        return (root, query, cb) -> root.get("apartmentId").in(apartmentIds);
    }

    private Specification<Invoice> byApartmentId(Integer apartmentId) {
        return (root, query, cb) -> cb.equal(root.get("apartmentId"), apartmentId);
    }

    private Specification<Invoice> byCreatedBetween(LocalDate startDate, LocalDate endDate) {
        return (root, query, cb) -> cb.between(
                root.get("createdDate"),
                startDate.atStartOfDay(),
                endDate.plusDays(1).atStartOfDay()
        );
    }

    private Specification<Invoice> byCreatedAfter(LocalDate startDate) {
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("createdDate"), startDate.atStartOfDay());
    }

    public static Specification<Invoice> byCreatedBefore(LocalDate end) {
        return (root, query, cb) -> cb.lessThan(root.get("createdDate"), end.plusDays(1).atStartOfDay());
    }
}
