package com.condoflow.expense.expense;

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
import java.util.Set;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@EntityListeners(AuditingEntityListener.class)
@Table(name = "expense")
public class Expense {

    @Id
    @GeneratedValue
    private Integer id;

    private String description;
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private ScopeType scopeType;

    @ElementCollection(targetClass = Tower.class)
    @Enumerated(EnumType.STRING)
    private Set<Tower> applicableTowers;

    @CreatedDate
    @Column(updatable = false, nullable = false)
    private LocalDateTime createdDate;
    @LastModifiedDate
    @Column(insertable = false)
    private LocalDateTime lastModifiedDate;
}
