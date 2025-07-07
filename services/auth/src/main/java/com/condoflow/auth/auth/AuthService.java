package com.condoflow.auth.auth;

import com.condoflow.auth.client.UserClient;
import com.condoflow.auth.user.User;
import com.condoflow.auth.user.UserRepository;
import com.condoflow.auth.auth.dto.RegisterRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserClient userClient;
    @Autowired
    private PasswordEncoder encoder;
    @Autowired
    private AuthMapper authMapper;

    public void registerUser(RegisterRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        if (userClient.existsByDocument(request.document())) {
            throw new RuntimeException("Document already in use");
        }

        User newUser = User.builder()
                .email(request.email())
                .password(encoder.encode(request.password()))
                .role(request.role())
                .build();
        userClient.registerUser(authMapper.registerRequestToUserRequest(request));
        userRepository.save(newUser);
    }
}
