package com.condoflow.user.user;

import com.condoflow.user.common.PageResponse;
import com.condoflow.user.exception.DocumentAlreadyUsedException;
import com.condoflow.user.exception.EmailAlreadyUsedException;
import com.condoflow.user.exception.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserMapper userMapper;

    public PageResponse<UserResponse> findAllUsers(int page, int size) {
        // Creamos el objeto pageable como parámetro para la búsqueda
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        // Hacemos la búsqueda en la base de datos
        Page<User> users = userRepository.findAll(pageable);
        // Extraemos la lista de usuarios de la página
        List<UserResponse> userResponse = users.stream()
                .map(userMapper::toUserResponse)
                .toList();
        return new PageResponse<>(
                userResponse,
                users.getNumber(),
                users.getSize(),
                users.getTotalElements(),
                users.getTotalPages(),
                users.isFirst(),
                users.isLast()
        );
    }

    public UserResponse getCurrentUser(Jwt jwt) {
        // Extraemos el userId del claim "user_id"
        Long userId = extractUserId(jwt);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID:: " + userId));
        return userMapper.toUserResponse(user);
    }

    public UserResponse findById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID:: " + userId));
        return userMapper.toUserResponse(user);
    }

    private Long extractUserId(Jwt jwt) {
        Object claim = jwt.getClaim("user_id");
        if (claim instanceof Number) {
            return ((Number) claim).longValue();
        }
        return Long.valueOf(claim.toString());
    }

    public Long createUser(UserRequest request) {

        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new EmailAlreadyUsedException("User email is already in use");
        }
        if (userRepository.findByDocument(request.document().toUpperCase()).isPresent()) {
            throw new DocumentAlreadyUsedException("User document is already in use");
        }

        User newUser = userMapper.toUser(request);

        return userRepository.save(newUser).getId();
    }
}
