package com.condoflow.condo.apartment.dto;

import com.condoflow.condo.apartment.Tower;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ApartmentRequest(
        Integer id,
        @NotBlank
        @NotNull
        String code,
        @NotNull
        Tower tower,
        @NotNull
        BigDecimal sqm,
        @NotNull
        BigDecimal aliquot
) {
}
