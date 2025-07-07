package com.condoflow.auth.auth;

import com.condoflow.auth.auth.dto.RegisterRequest;
import com.condoflow.auth.auth.dto.UserRequest;
import com.condoflow.auth.user.User;
import org.springframework.stereotype.Service;

@Service
public class AuthMapper {

    public UserRequest registerRequestToUserRequest(RegisterRequest request) {
        return new UserRequest(
                request.firstName(),
                request.lastName(),
                request.document(),
                request.email(),
                request.role()
        );
    }
}
