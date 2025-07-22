package com.condoflow.user.user;

import com.condoflow.user.common.PageResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@RestController
public class UserController {

    @Autowired
    UserService service;

//    @GetMapping("/me")
//    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
//        return ResponseEntity.ok(service.getCurrentUser(jwt));
//    }

    @GetMapping("/whoami")
    public String whoami(@AuthenticationPrincipal Jwt jwt) {
        return jwt.getClaims().toString();
    }

    @GetMapping("/roles")
    public Collection<? extends GrantedAuthority> roles(Authentication authentication) {
        return authentication.getAuthorities();
    }

    @GetMapping
    public ResponseEntity<PageResponse<UserResponse>> getAllUsers(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(service.findAllUsers(page, size));
    }

    @GetMapping("/{user-id}")
    public ResponseEntity<UserResponse> findUserById(
            @PathVariable("user-id") Long userId
    ) {
        return ResponseEntity.ok(service.findById(userId));
    }

    @PostMapping("/register")
    public ResponseEntity<Long> createUser(
            @RequestBody @Valid UserRequest request
    ) {
        return ResponseEntity.ok(service.createUser(request));
    }

    @GetMapping("/document/exists/{document}")
    public Boolean existsByDocument(@PathVariable("document") String document) {
        return service.existsByDocument(document);
    }

    @PreAuthorize("@auth.isAdmin(principal)")
    @PatchMapping("/makeAdmin/{user-id}")
    public ResponseEntity<Void> makeAdmin(
            @PathVariable("user-id") Long userId
    ) {
        service.makeAdmin(userId);
        return ResponseEntity.accepted().build();
    }

    @PreAuthorize("@auth.isAdminOrOwner(#userId, principal)")
    @PutMapping("/update/{user-id}")
    public ResponseEntity<Void> updateUser(
            @PathVariable("user-id") Long userId,
            @RequestBody @Valid UserRequest request
    ) {
        service.updateUser(userId, request);
        return ResponseEntity.accepted().build();
    }

    @PreAuthorize("@auth.isAdmin(principal)")
    @DeleteMapping("/delete/{user-id}")
    public ResponseEntity<Void> deleteById(
            @PathVariable("user-id") Long userId
    ) {
        service.deleteUserById(userId);
        return ResponseEntity.noContent().build();
    }
}
