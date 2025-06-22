package com.condoflow.user.user;

import com.condoflow.user.apartment.ApartmentRefResponse;

import java.util.List;

public record UserResponse (
        Long id,
        String firstName,
        String lastName,
        String email,
        String document,
        Role role,
        List<ApartmentRefResponse> apartments
) {
}
