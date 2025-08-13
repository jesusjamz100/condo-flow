package com.condoflow.billing.apartment;

import java.math.BigDecimal;

public record ApartmentResponse(
        Integer id,
        String tower,
        BigDecimal balance,
        BigDecimal aliquot
) {
}
