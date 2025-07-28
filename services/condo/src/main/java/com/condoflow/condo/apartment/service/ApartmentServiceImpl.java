package com.condoflow.condo.apartment.service;

import com.condoflow.condo.apartment.Apartment;
import com.condoflow.condo.apartment.ApartmentMapper;
import com.condoflow.condo.apartment.ApartmentRepository;
import com.condoflow.condo.apartment.dto.ApartmentRequest;
import com.condoflow.condo.apartment.dto.ApartmentResponse;
import com.condoflow.condo.common.PageResponse;
import com.condoflow.condo.exception.ApartmentAlreadyExists;
import com.condoflow.condo.exception.ApartmentNotFoundException;
import com.condoflow.condo.exception.ResidentNotFoundException;
import com.condoflow.condo.resident.Resident;
import com.condoflow.condo.resident.ResidentRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ApartmentServiceImpl implements ApartmentService {

    private final ApartmentRepository repository;
    private final ApartmentMapper mapper;
    private final ResidentRepository residentRepository;

    @Override
    public PageResponse<ApartmentResponse> findMyApartments(Jwt jwt, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("code").ascending());
        Page<Apartment> apartments = repository.findAllByResidentKeycloakUserId(pageable, jwt.getSubject());
        List<ApartmentResponse> apartmentResponse = apartments.stream()
                .map(mapper::toApartmentResponse)
                .toList();
        return new PageResponse<>(
                apartmentResponse,
                apartments.getNumber(),
                apartments.getSize(),
                apartments.getTotalElements(),
                apartments.getTotalPages(),
                apartments.isFirst(),
                apartments.isLast()
        );
    }

    @Override
    public ApartmentResponse findApartmentById(Jwt jwt, int apartmentId) {
        Resident resident = residentRepository.findByKeycloakUserId(jwt.getSubject())
                .orElseThrow(() -> new ResidentNotFoundException("Resident not found with keycloak user ID:: " + jwt.getSubject()));

        Apartment apartment = repository.findApartmentByIdAndResidentId(apartmentId, resident.getId())
                .orElseThrow(() -> new ApartmentNotFoundException("Apartment not found with ID:: " + apartmentId));
        return mapper.toApartmentResponse(apartment);
    }

    @Override
    public PageResponse<ApartmentResponse> findAllApartments(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("code").ascending());
        Page<Apartment> apartments = repository.findAll(pageable);
        List<ApartmentResponse> apartmentResponse = apartments.stream()
                .map(mapper::toApartmentResponse)
                .toList();
        return new PageResponse<>(
                apartmentResponse,
                apartments.getNumber(),
                apartments.getSize(),
                apartments.getTotalElements(),
                apartments.getTotalPages(),
                apartments.isFirst(),
                apartments.isLast()
        );
    }

    @Override
    public ApartmentResponse findApartmentById(int apartmentId) {
        Apartment apartment = repository.findById(apartmentId)
                .orElseThrow(() -> new ApartmentNotFoundException("Apartment not found with ID:: " + apartmentId));
        return mapper.toApartmentResponse(apartment);
    }

    @Override
    @Transactional
    public Integer createApartment(ApartmentRequest request) {
        if (repository.existsByCode(request.code()))
            throw new ApartmentAlreadyExists("Apartment already exists with code:: " + request.code());
        Apartment apartment = mapper.toApartment(request);
        return repository.save(apartment).getId();
    }

    @Override
    public ApartmentResponse updateApartment(ApartmentRequest request) {
        Apartment apartment = repository.findById(request.id())
                .orElseThrow(() -> new ApartmentNotFoundException("Apartment not found with ID:: " + request.id()));
        mergeApartment(apartment, request);
        repository.save(apartment);
        return mapper.toApartmentResponse(apartment);
    }

    @Override
    public void deleteApartmentById(int apartmentId) {
        Apartment apartment = repository.findById(apartmentId)
                .orElseThrow(() -> new ApartmentNotFoundException("Apartment not found with ID:: " + apartmentId));
        repository.deleteById(apartmentId);
    }

    private static void mergeApartment(Apartment apartment, ApartmentRequest request) {
        if (StringUtils.isNotBlank(request.code())) {
            apartment.setCode(request.code());
        }

        if (Objects.nonNull(request.tower())) {
            apartment.setTower(request.tower());
        }

        if (Objects.nonNull(request.sqm())) {
            apartment.setSqm(request.sqm());
        }

        if (Objects.nonNull(request.aliquot())) {
            apartment.setAliquot(request.aliquot());
        }
    }
}
