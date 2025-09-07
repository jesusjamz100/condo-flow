package com.condoflow.billing.invoice;

import com.condoflow.billing.invoice.dto.InvoiceResponse;
import com.condoflow.billing.invoice.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/billing")
public class InvoiceController {

    private final InvoiceService service;

    @GetMapping("/myInvoices")
    public ResponseEntity<List<InvoiceResponse>> getMyInvoices(
            @RequestParam(name = "apartmentId", required = false) Integer apartmentId,
            @RequestParam(name = "startDate", required = false) LocalDate startDate,
            @RequestParam(name = "endDate", required = false) LocalDate endDate
    ) {
        return ResponseEntity.ok(service.getMyInvoices(apartmentId, startDate, endDate));
    }

    @GetMapping("/myInvoices/{invoiceId}")
    public ResponseEntity<InvoiceResponse> getOneOfMyInvoices(
            @PathVariable("invoiceId") Integer invoiceId
    ) {
        return ResponseEntity.ok(service.getMyInvoiceById(invoiceId));
    }

    // ADMIN
    @PostMapping("/admin")
    public ResponseEntity<Void> generateInvoices(
            @RequestParam(name = "startDate") LocalDate startDate,
            @RequestParam(name = "endDate") LocalDate endDate
    ) {
        service.generateInvoices(startDate, endDate);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/admin")
    public ResponseEntity<List<InvoiceResponse>> getAllInvoices(
            @RequestParam(name = "apartmentId", required = false) Integer apartmentId,
            @RequestParam(name = "startDate", required = false) LocalDate startDate,
            @RequestParam(name = "endDate", required = false) LocalDate endDate
    ) {
        return ResponseEntity.ok(service.getAllInvoices(apartmentId, startDate, endDate));
    }

    @GetMapping("/admin/{invoiceId}")
    public ResponseEntity<InvoiceResponse> getInvoiceById(
            @PathVariable("invoiceId") Integer invoiceId
    ) {
        return ResponseEntity.ok(service.getInvoiceById(invoiceId));
    }
}
