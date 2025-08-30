package com.condoflow.billing.invoice.service;

import com.condoflow.billing.common.PageResponse;
import com.condoflow.billing.invoice.dto.InvoiceResponse;
import org.springframework.security.oauth2.jwt.Jwt;

import java.time.LocalDate;
import java.util.List;

public interface InvoiceService {
    List<InvoiceResponse> getMyInvoices(Integer apartmentId, LocalDate startDate, LocalDate endDate);

    InvoiceResponse getMyInvoiceById(Integer invoiceId);

    void generateInvoices(LocalDate startDate, LocalDate endDate);

    List<InvoiceResponse> getAllInvoices(Integer apartmentId, LocalDate startDate, LocalDate endDate);

    InvoiceResponse getInvoiceById(Integer invoiceId);
}
