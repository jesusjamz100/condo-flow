package com.condoflow.user.user;

import com.condoflow.user.apartment.ApartmentRefResponse;
import org.springframework.stereotype.Service;

@Service
public class UserMapper {

    public UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getDocument(),
                user.getRole(),
                user.getApartmentIds()
                        .stream()
                        .map(apt -> new ApartmentRefResponse(apt.getApartmentId(), apt.isOwner()))
                        .toList()
        );
    }
}
