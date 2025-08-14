package com.condoflow.billing.invoice;

import com.condoflow.billing.invoice.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequiredArgsConstructor
@RequestMapping("/billing")
public class InvoiceController {

    private final InvoiceService service;

    @PostMapping("/admin")
    public ResponseEntity<Void> generateInvoices(
            @RequestParam(name = "startDate") LocalDate startDate,
            @RequestParam(name = "endDate") LocalDate endDate
    ) {
        service.generateInvoices(startDate, endDate);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
