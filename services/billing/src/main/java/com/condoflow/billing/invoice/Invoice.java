package com.condoflow.billing.invoice;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@EntityListeners(AuditingEntityListener.class)
@Table(name = "invoice")
public class Invoice {

    @Id
    @GeneratedValue
    private Integer id;

    @Column(updatable = false, nullable = false)
    private BigDecimal amount;

    @Column(updatable = false, nullable = false)
    private BigDecimal discountAmount;

    @Column(updatable = false, nullable = false)
    private BigDecimal penaltyAmount;

    @Column(updatable = false, nullable = false)
    private BigDecimal finalAmount = amount.subtract(discountAmount).add(penaltyAmount);

    @Column(updatable = false, nullable = false)
    private Integer apartmentId;

    @CreatedDate
    @Column(updatable = false, nullable = false)
    private LocalDateTime createdDate;
    @LastModifiedDate
    @Column(insertable = false)
    private LocalDateTime lastModifiedDate;
}
