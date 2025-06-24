package com.condoflow.user.user;

import com.condoflow.user.common.PageResponse;
import com.condoflow.user.exception.DocumentAlreadyUsedException;
import com.condoflow.user.exception.EmailAlreadyUsedException;
import com.condoflow.user.exception.UserNotFoundException;
import org.apache.commons.lang.StringUtils;
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

    public void updateUser(Long userId, UserRequest request) {
        User user = userRepository.findById(request.id())
                .orElseThrow(() -> new UserNotFoundException("User not found with ID:: " + request.id()));
        mergeUser(user, request);
        userRepository.save(user);
    }

    public void deleteUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID:: " + userId));

        // todo: Enviar mensaje por Kafka hacia servicio de condominio y servicio de auth

        userRepository.deleteById(userId);
    }

    private Long extractUserId(Jwt jwt) {
        Object claim = jwt.getClaim("user_id");
        if (claim instanceof Number) {
            return ((Number) claim).longValue();
        }
        return Long.valueOf(claim.toString());
    }

    private void mergeUser(User user, UserRequest request) {
        if (StringUtils.isNotBlank(request.firstName())) {
            user.setFirstName(request.firstName());
        }
        if (StringUtils.isNotBlank(request.lastName())) {
            user.setLastName(request.lastName());
        }
        if (StringUtils.isNotBlank(request.document())) {
            if (userRepository.findByDocument(request.document().toUpperCase()).isPresent()) {
                throw new DocumentAlreadyUsedException("User document is already in use");
            }
            user.setDocument(request.document().toUpperCase());
        }
        if (StringUtils.isNotBlank(request.email())) {
            if (userRepository.findByEmail(request.email()).isPresent()) {
                throw new EmailAlreadyUsedException("User email is already in use");
            }
            user.setEmail(request.email());
        }
    }
}
