package com.condoflow.condo.apartment;

import com.condoflow.condo.apartment.parking.ParkingSlot;
import com.condoflow.condo.common.ApartmentResident;
import com.condoflow.condo.common.BaseEntity;
import com.condoflow.condo.resident.Resident;
import jakarta.persistence.*;
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
    private String tower;

    @Column(nullable = false)
    private BigDecimal balance = BigDecimal.ZERO;

    @Column(nullable = false)
    private BigDecimal sqm;

    @Column(precision = 5, scale = 4)
    private BigDecimal aliquot;

    @Column(nullable = false)
    private Integer dueDay = 5; // limit day to pay without fine

    @Column(nullable = false, precision = 5, scale = 4)
    private BigDecimal discountRate = new BigDecimal("0.10"); // 10% discount for early pay

    @Column(nullable = false, precision = 5, scale = 4)
    private BigDecimal penaltyRate = new BigDecimal("0.10"); // 10% fine for late pay

    @Column(nullable = false)
    private Integer discountWindowDays = 5; // days from month start for discount

    @Column(nullable = false)
    private Integer penaltyStartOffsetDays = 1; // days after dueDay for penalty start

    // Relations
    @OneToMany(mappedBy = "apartment", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private Set<ParkingSlot> parkingSlots = new HashSet<>(); // Relation to parking slots as an apartment can have more than one

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_resident_id")
    private Resident ownerResident;

    @OneToMany(mappedBy = "apartment", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ApartmentResident> apartmentResidents = new HashSet<>();
}
