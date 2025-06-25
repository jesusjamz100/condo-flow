package com.condoflow.user;

import com.condoflow.user.apartment.ApartmentRef;
import com.condoflow.user.apartment.ApartmentRefResponse;
import com.condoflow.user.common.PageResponse;
import com.condoflow.user.exception.DocumentAlreadyUsedException;
import com.condoflow.user.exception.EmailAlreadyUsedException;
import com.condoflow.user.exception.UserNotFoundException;
import com.condoflow.user.user.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserControllerTests {

    @Mock
    private UserRepository repository;
    @Mock
    private UserMapper mapper;
    @InjectMocks
    UserService service;

    private User existing;
    private UserRequest request;

    @BeforeEach
    void setUp() {
        existing = new User();
        existing.setId(1L);
        existing.setFirstName("Jose");
        existing.setLastName("Perez");
        existing.setEmail("jose@test.com");
        existing.setDocument("V123");
        existing.setRole(Role.RESIDENT);
        existing.setApartmentIds(List.of(new ApartmentRef(10L, true)));

        request = new UserRequest(
                1L,
                "Jose",
                "Perez",
                "V123",
                "jose@test.com",
                Role.RESIDENT
        );
    }

    @Test
    void findAllUsers_shouldPageAndMap() {
        // dados
        Page<User> page = new PageImpl<>(List.of(existing),
                PageRequest.of(0, 1, Sort.by("createdDate").descending()),
                5);
        when(repository.findAll(any(Pageable.class))).thenReturn(page);
        UserResponse response = new UserResponse(
                1L,
                "Jose",
                "Perez",
                "V123",
                "jose@test.com",
                Role.RESIDENT,
                Stream.of(new ApartmentRef(10L, true))
                        .map(apt -> new ApartmentRefResponse(apt.getApartmentId(), apt.isOwner()))
                        .toList()
        );
        when(mapper.toUserResponse(existing)).thenReturn(response);

        // cuando
        PageResponse<UserResponse> outcome = service.findAllUsers(0, 1);

        // entonces
        assertThat(outcome.getContent()).hasSize(1).first().isEqualTo(response);
        assertThat(outcome.getNumber()).isZero();
        assertThat(outcome.getSize()).isOne();
        assertThat(outcome.getTotalElements()).isEqualTo(5);
        assertThat(outcome.getTotalPages()).isEqualTo(5);
        verify(repository).findAll(any(Pageable.class));
    }

    @Test
    void getCurrentUser_whenFound() {
        // dado un JWT con claim user_id = 1
        Jwt jwt = Jwt.withTokenValue("t")
                .header("alg", "none")
                .claim("user_id", 1L)
                .build();

        when(repository.findById(1L)).thenReturn(Optional.of(existing));
        UserResponse mapped = new UserResponse(
                1L,
                "Jose",
                "Perez",
                "jose@test.com",
                "V123",
                Role.RESIDENT,
                Stream.of(new ApartmentRef(10L, true))
                        .map(apt -> new ApartmentRefResponse(apt.getApartmentId(), apt.isOwner()))
                        .toList()
        );
        when(mapper.toUserResponse(existing)).thenReturn(mapped);

        UserResponse outcome = service.getCurrentUser(jwt);

        assertThat(outcome).isEqualTo(mapped);
        verify(repository).findById(1L);
    }

    @Test
    void getCurrentUser_whenNotFound_throws() {
        Jwt jwt = Jwt.withTokenValue("t")
                .header("alg", "none")
                .claim("user_id", 99L)
                .build();

        when(repository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.getCurrentUser(jwt))
                .isInstanceOf(UserNotFoundException.class);
    }

    @Test
    void findById_found() {
        when(repository.findById(1L)).thenReturn(Optional.of(existing));
        UserResponse mapped = new UserResponse(
                1L,
                "Jose",
                "Perez",
                "jose@test.com",
                "V123",
                Role.RESIDENT,
                List.of()
        );
        when(mapper.toUserResponse(existing)).thenReturn(mapped);

        UserResponse outcome = service.findById(1L);

        assertThat(outcome).isEqualTo(mapped);
    }

    @Test
    void findById_notFound() {
        when(repository.findById(2L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.findById(2L))
                .isInstanceOf(UserNotFoundException.class);
    }

    @Test
    void createUser_happy() {
        // no existe email ni documento
        when(repository.findByEmail(request.email())).thenReturn(Optional.empty());
        when(repository.findByDocument(request.document())).thenReturn(Optional.empty());

        User saved = new User();
        saved.setId(5L);
        when(mapper.toUser(request)).thenReturn(existing);
        when(repository.save(existing)).thenReturn(saved);

        Long outcome = service.createUser(request);
        assertThat(outcome).isEqualTo(5L);
    }

    @Test
    void createUser_emailExists_trows() {
        when(repository.findByEmail(request.email())).thenReturn(Optional.of(existing));
        assertThatThrownBy(() -> service.createUser(request))
                .isInstanceOf(EmailAlreadyUsedException.class);
    }

    @Test
    void createUser_documentExists_throws() {
        when(repository.findByDocument(request.document())).thenReturn(Optional.of(existing));
        assertThatThrownBy(() -> service.createUser(request))
                .isInstanceOf(DocumentAlreadyUsedException.class);
    }

    @Test
    void makeAdmin_happy() {
        existing.setRole(Role.RESIDENT);
        when(repository.findById(1L)).thenReturn(Optional.of(existing));
        when(repository.save(any())).thenAnswer(i -> i.getArgument(0));

        service.makeAdmin(1L);

        assertThat(existing.getRole()).isEqualTo(Role.ADMIN);
        verify(repository).save(existing);
    }

    @Test
    void makeAdmin_alreadyAdmin_throws() {
        existing.setRole(Role.ADMIN);
        when(repository.findById(1L)).thenReturn(Optional.of(existing));

        assertThatThrownBy(() -> service.makeAdmin(1L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("already an ADMIN");
    }

    @Test
    void updateUser_happy() {
        // request.id() debe coincidir con existing.getId()
        UserRequest upd = new UserRequest(
                1L,
                "Pedro",
                "Gomez",
                "V999",
                "pedro@test.com",
                Role.RESIDENT
        );
        when(repository.findById(1L)).thenReturn(Optional.of(existing));
        // no colisión de email/document
        when(repository.findByDocument("V999")).thenReturn(Optional.empty());
        when(repository.findByEmail("pedro@test.com")).thenReturn(Optional.empty());
        when(repository.save(any())).thenAnswer(i -> i.getArgument(0));

        service.updateUser(1L, upd);

        assertThat(existing.getFirstName()).isEqualTo("Pedro");
        assertThat(existing.getEmail()).isEqualTo("pedro@test.com");
        assertThat(existing.getDocument()).isEqualTo("V999");
    }

    @Test
    void updateUser_notFound() {
        when(repository.findById(1L)).thenReturn(Optional.empty());
        UserRequest upd = request; // id=1
        assertThatThrownBy(() -> service.updateUser(1L, upd))
                .isInstanceOf(UserNotFoundException.class);
    }

    @Test
    void updateUser_emailCollision_throws() {
        UserRequest upd = new UserRequest(
                1L, null, null, null, "otro@test.com", null
        );
        when(repository.findById(1L)).thenReturn(Optional.of(existing));
        when(repository.findByEmail("otro@test.com")).thenReturn(Optional.of(new User()));

        assertThatThrownBy(() -> service.updateUser(1L, upd))
                .isInstanceOf(EmailAlreadyUsedException.class);
    }

    @Test
    void updateUser_documentCollision_throws() {
        UserRequest upd = new UserRequest(
                1L, null, null, "X123", null, null
        );
        when(repository.findById(1L)).thenReturn(Optional.of(existing));
        when(repository.findByDocument("X123")).thenReturn(Optional.of(new User()));

        assertThatThrownBy(() -> service.updateUser(1L, upd))
                .isInstanceOf(DocumentAlreadyUsedException.class);
    }
}
