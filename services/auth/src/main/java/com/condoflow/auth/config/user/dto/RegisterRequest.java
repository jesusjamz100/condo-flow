package com.condoflow.auth.config.user.dto;

public record RegisterRequest(
        String email,
        String password,
        Boolean enabled
) {

}
