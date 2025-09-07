package com.condoflow.expense.handler;

import java.util.Map;

public record ErrorResponse(
        Map<String, String> errors
) {
}
