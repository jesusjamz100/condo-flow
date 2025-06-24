package com.condoflow.user.security;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.List;

@Component("auth")
public class AuthorizationChecks {
    public boolean isAdminOrOwner(Long idToUpdate, Jwt jwt) {
        Long userId = Long.valueOf(jwt.getClaim("user_id"));
        List<String> roles = jwt.getClaimAsStringList("roles");
        return userId.equals(idToUpdate) || roles.contains("ADMIN");
    }

    public boolean isAdmin(Jwt jwt) {
        List<String> roles = jwt.getClaimAsStringList("roles");
        return roles.contains("ADMIN");
    }
}
