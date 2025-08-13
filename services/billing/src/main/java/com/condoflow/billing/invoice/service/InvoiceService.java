package com.condoflow.billing.invoice.service;

import java.time.LocalDate;

public interface InvoiceService {
    void generateInvoices(LocalDate startDate, LocalDate endDate);
}
