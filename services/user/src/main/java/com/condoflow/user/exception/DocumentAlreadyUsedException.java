package com.condoflow.user.exception;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class DocumentAlreadyUsedException extends RuntimeException {

    private final String msg;
}
