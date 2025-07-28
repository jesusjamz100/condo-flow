package com.condoflow.condo.exception;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class ApartmentNotFoundException extends RuntimeException {
    private final String msg;
}
