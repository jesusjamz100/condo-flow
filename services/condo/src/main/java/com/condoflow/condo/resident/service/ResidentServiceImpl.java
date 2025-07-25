package com.condoflow.condo.resident.service;

import com.condoflow.condo.exception.ResidentNotFoundException;
import com.condoflow.condo.resident.Resident;
import com.condoflow.condo.resident.ResidentMapper;
import com.condoflow.condo.resident.ResidentRepository;
import com.condoflow.condo.resident.dto.ResidentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ResidentServiceImpl implements ResidentService {

    private final ResidentRepository repository;
    private final ResidentMapper mapper;

    @Override
    public ResidentResponse getMe(Jwt jwt) {
        Resident resident = repository.findByKeycloakUserId(jwt.getSubject())
                .orElseThrow(() -> new ResidentNotFoundException("Resident not found with ID:: " + jwt.getSubject()));
        return mapper.toResidentResponse(resident, jwt);
    }

    @Override
    @Transactional
    public void createIfNotExists(String keycloakUserId) {
        repository.findByKeycloakUserId(keycloakUserId)
                .orElseGet(() -> {
                    Resident resident = Resident.builder()
                            .keycloakUserId(keycloakUserId)
                            .primaryResident(false)
                            .build();
                    return repository.save(resident);
                });
    }
}