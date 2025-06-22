package com.condoflow.user.apartment;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApartmentRef {

    @Column(name = "apartment_id", nullable = false)
    private Long apartmentId;

    @Column(name = "is_owner", nullable = false)
    private boolean isOwner;
}
