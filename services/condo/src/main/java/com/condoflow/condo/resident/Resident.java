package com.condoflow.condo.resident;


import com.condoflow.condo.common.relation.ApartmentResident;
import com.condoflow.condo.common.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.HashSet;
import java.util.Set;

@Entity
@NoArgsConstructor
@SuperBuilder
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public class Resident extends BaseEntity {

    // Identification data
    @Column(unique = true, nullable = false)
    private String keycloakUserId;

    // Attributes
    @Pattern(regexp = "^\\+?[0-9]{7,15}$", message = "Invalid phone number")
    private String phoneNumber;

    private String emergencyContactName;
    @Pattern(regexp = "^\\+?[0-9]{7,15}$", message = "Invalid phone number")
    private String emergencyContactPhone;

    // Relations
    @OneToMany(mappedBy = "resident", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ApartmentResident> apartmentResidents = new HashSet<>(); // Many To Many with apartments
}
