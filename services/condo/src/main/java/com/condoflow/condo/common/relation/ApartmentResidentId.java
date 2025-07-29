package com.condoflow.condo.common.relation;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Data
@AllArgsConstructor
public class ApartmentResidentId implements Serializable {
    private Integer apartmentId;
    private Integer residentId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ApartmentResidentId that = (ApartmentResidentId) o;
        return Objects.equals(apartmentId, that.apartmentId) &&
                Objects.equals(residentId, that.residentId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(apartmentId, residentId);
    }
}
