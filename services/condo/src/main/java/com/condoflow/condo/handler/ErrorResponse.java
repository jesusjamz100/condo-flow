package com.condoflow.condo.handler;

import java.util.Map;

public record ErrorResponse(
        Map<String, String> errors
) {
}
