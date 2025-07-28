package com.condoflow.condo.exception;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class ApartmentAlreadyExists extends RuntimeException {
    private final String msg;
}
