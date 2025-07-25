package com.condoflow.condo.resident.service;

import com.condoflow.condo.common.PageResponse;
import com.condoflow.condo.exception.ResidentAlreadyExistsException;
import com.condoflow.condo.exception.ResidentNotFoundException;
import com.condoflow.condo.resident.Resident;
import com.condoflow.condo.resident.ResidentMapper;
import com.condoflow.condo.resident.ResidentRepository;
import com.condoflow.condo.resident.dto.PublicResidentResponse;
import com.condoflow.condo.resident.dto.ResidentRequest;
import com.condoflow.condo.resident.dto.ResidentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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

    @Override
    public PageResponse<PublicResidentResponse> findAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<Resident> residents = repository.findAll(pageable);
        List<PublicResidentResponse> residentResponse = residents.stream()
                .map(mapper::toPublicResidentResponse)
                .toList();
        return new PageResponse<>(
                residentResponse,
                residents.getNumber(),
                residents.getSize(),
                residents.getTotalElements(),
                residents.getTotalPages(),
                residents.isFirst(),
                residents.isLast()
        );
    }

    @Override
    public Integer createResident(ResidentRequest request) {
        boolean userExists = repository.findByKeycloakUserId(request.keycloakUserId()).isPresent();
        if (userExists) {
            throw new ResidentAlreadyExistsException("Resident already exists with keycloakUserId:: " + request.keycloakUserId());
        }
        Resident newResident = mapper.toResident(request);
        return repository.save(newResident).getId();
    }
}