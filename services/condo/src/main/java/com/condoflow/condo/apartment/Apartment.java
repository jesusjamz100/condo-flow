package com.condoflow.condo.apartment;

import com.condoflow.condo.parking.ParkingSlot;
import com.condoflow.condo.common.relation.ApartmentResident;
import com.condoflow.condo.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

import static jakarta.persistence.EnumType.STRING;

@Entity
@NoArgsConstructor
@SuperBuilder
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public class Apartment extends BaseEntity {

    @Column(unique = true)
    private String code;

    @Enumerated(STRING)
    private Tower tower;

    @Builder.Default
    @Column(nullable = false)
    private BigDecimal balance = BigDecimal.ZERO;

    @Column(nullable = false)
    private BigDecimal sqm;

    @Column(precision = 5, scale = 4)
    private BigDecimal aliquot;

    @Builder.Default
    @Column(nullable = false)
    private Integer dueDay = 5; // limit day to pay without fine

    @Builder.Default
    @Column(nullable = false, precision = 5, scale = 4)
    private BigDecimal discountRate = new BigDecimal("0.10"); // 10% discount for early pay

    @Builder.Default
    @Column(nullable = false, precision = 5, scale = 4)
    private BigDecimal penaltyRate = new BigDecimal("0.10"); // 10% fine for late pay

    @Builder.Default
    @Column(nullable = false)
    private Integer discountWindowDays = 5; // days from month start for discount

    @Builder.Default
    @Column(nullable = false)
    private Integer penaltyStartOffsetDays = 1; // days after dueDay for penalty start

    // Relations
    @OneToMany(mappedBy = "apartment", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private Set<ParkingSlot> parkingSlots = new HashSet<>(); // Relation to parking slots as an apartment can have more than one

    @OneToMany(mappedBy = "apartment", cascade = { CascadeType.MERGE, CascadeType.REMOVE }, orphanRemoval = true)
    private Set<ApartmentResident> apartmentResidents = new HashSet<>();
}
