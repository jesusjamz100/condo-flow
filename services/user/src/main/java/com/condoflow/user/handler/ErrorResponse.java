package com.condoflow.user.handler;

import java.util.Map;

public record ErrorResponse(
        Map<String, String> errors
) {
}
