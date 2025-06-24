package com.condoflow.user.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

public record UserRequest (
        Long id,
        @NotNull(message = "First name is mandatory")
        String firstName,
        @NotNull(message = "Last name is mandatory")
        String lastName,
        String document,
        @NotNull(message = "Email is mandatory")
        @Email(message = "Not valid email address")
        String email,
        Role role
) {
}
