package com.condoflow.condo.config.filter;

import com.condoflow.condo.resident.service.ResidentService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class ResidentProfileFilter extends OncePerRequestFilter {

    private final ResidentService residentService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth instanceof JwtAuthenticationToken jwtAuth) {
            String keycloakUserId = jwtAuth.getToken().getSubject();
            String firstName = jwtAuth.getToken().getClaim("given_name");
            String lastName = jwtAuth.getToken().getClaim("family_name");
            residentService.createIfNotExists(keycloakUserId, firstName, lastName);
        }

        filterChain.doFilter(request, response);
    }
}
