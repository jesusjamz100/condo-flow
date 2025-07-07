package com.condoflow.auth.user.dto;

import com.condoflow.auth.user.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

public record RegisterRequest(
        @NotNull(message = "First name is mandatory")
        String firstName,
        @NotNull(message = "Last name is mandatory")
        String lastName,
        String document,
        @NotNull(message = "Email is mandatory")
        @Email(message = "Not a valid email address")
        String email,
        @NotNull(message = "Password is mandatory")
        String password,
        Role role
) {

}
