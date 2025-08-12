package com.condoflow.expense.exception;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class ExpenseAlreadyBilledException extends RuntimeException {

    private final String msg;
}
