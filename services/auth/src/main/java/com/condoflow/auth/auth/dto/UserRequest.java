package com.condoflow.auth.auth.dto;

import com.condoflow.auth.user.Role;

public record UserRequest(
        String firstName,
        String lastName,
        String document,
        String email,
        Role role
) {
}
