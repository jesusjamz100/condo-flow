package com.condoflow.auth.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

public record LoginRequest(
        @NotNull(message = "Email is mandatory")
        @Email(message = "Not a valid email address")
        String email,
        @NotNull(message = "Password is mandatory")
        String password
) {
}
