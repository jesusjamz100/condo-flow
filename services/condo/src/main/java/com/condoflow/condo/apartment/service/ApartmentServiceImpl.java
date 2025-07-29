package com.condoflow.condo.apartment.service;

import com.condoflow.condo.apartment.Apartment;
import com.condoflow.condo.apartment.ApartmentMapper;
import com.condoflow.condo.apartment.ApartmentRepository;
import com.condoflow.condo.apartment.dto.ApartmentRequest;
import com.condoflow.condo.apartment.dto.ApartmentResponse;
import com.condoflow.condo.common.PageResponse;
import com.condoflow.condo.common.relation.ApartmentResident;
import com.condoflow.condo.common.relation.ApartmentResidentId;
import com.condoflow.condo.common.relation.ApartmentResidentRepository;
import com.condoflow.condo.common.relation.RoleType;
import com.condoflow.condo.exception.ApartmentAlreadyExists;
import com.condoflow.condo.exception.ApartmentNotFoundException;
import com.condoflow.condo.exception.ResidentNotFoundException;
import com.condoflow.condo.resident.Resident;
import com.condoflow.condo.resident.ResidentMapper;
import com.condoflow.condo.resident.ResidentRepository;
import com.condoflow.condo.resident.dto.ResidentResponse;
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

import static com.condoflow.condo.common.relation.RoleType.OCCUPANT;

@Service
@RequiredArgsConstructor
public class ApartmentServiceImpl implements ApartmentService {

    private final ApartmentRepository apartmentRepository;
    private final ApartmentMapper apartmentMapper;
    private final ResidentRepository residentRepository;
    private final ResidentMapper residentMapper;
    private final ApartmentResidentRepository arRepository;

    @Override
    public PageResponse<ApartmentResponse> findMyApartments(Jwt jwt, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("code").ascending());
        Page<Apartment> apartments = apartmentRepository.findByApartmentResidentsResidentKeycloakUserId(jwt.getSubject(), pageable);
        List<ApartmentResponse> apartmentResponse = apartments.stream()
                .map(apartmentMapper::toApartmentResponse)
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

        Apartment apartment = apartmentRepository.findApartmentByIdAndResidentId(apartmentId, resident.getId())
                .orElseThrow(() -> new ApartmentNotFoundException("Apartment not found with ID:: " + apartmentId));
        return apartmentMapper.toApartmentResponse(apartment);
    }

    @Override
    public PageResponse<ApartmentResponse> findAllApartments(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("code").ascending());
        Page<Apartment> apartments = apartmentRepository.findAll(pageable);
        List<ApartmentResponse> apartmentResponse = apartments.stream()
                .map(apartmentMapper::toApartmentResponse)
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
        Apartment apartment = apartmentRepository.findById(apartmentId)
                .orElseThrow(() -> new ApartmentNotFoundException("Apartment not found with ID:: " + apartmentId));
        return apartmentMapper.toApartmentResponse(apartment);
    }

    @Override
    @Transactional
    public Integer createApartment(ApartmentRequest request) {
        if (apartmentRepository.existsByCode(request.code()))
            throw new ApartmentAlreadyExists("Apartment already exists with code:: " + request.code());
        Apartment apartment = apartmentMapper.toApartment(request);
        return apartmentRepository.save(apartment).getId();
    }

    @Override
    public ApartmentResponse updateApartment(ApartmentRequest request) {
        Apartment apartment = apartmentRepository.findById(request.id())
                .orElseThrow(() -> new ApartmentNotFoundException("Apartment not found with ID:: " + request.id()));
        mergeApartment(apartment, request);
        apartmentRepository.save(apartment);
        return apartmentMapper.toApartmentResponse(apartment);
    }

    @Override
    public void deleteApartmentById(int apartmentId) {
        Apartment apartment = apartmentRepository.findById(apartmentId)
                .orElseThrow(() -> new ApartmentNotFoundException("Apartment not found with ID:: " + apartmentId));
        apartmentRepository.deleteById(apartmentId);
    }

    @Override
    public PageResponse<ResidentResponse> findApartmentResidents(int apartmentId, int page, int size) {
        Apartment apartment = apartmentRepository.findById(apartmentId)
                .orElseThrow(() -> new ApartmentNotFoundException("Apartment not found with ID:: " + apartmentId));
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<Resident> residents = residentRepository.findByApartmentResidentsApartmentId(apartmentId, pageable);
        List<ResidentResponse> residentResponse = residents.stream()
                .map(residentMapper::toResidentResponse)
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
    @Transactional
    public void addResidentToApartment(int apartmentId, int residentId) {
        Apartment apartment = apartmentRepository.findById(apartmentId)
                .orElseThrow(() -> new ApartmentNotFoundException("Apartment not found with ID:: " + apartmentId));

        Resident resident = residentRepository.findById(residentId)
                .orElseThrow(() -> new ResidentNotFoundException("Resident not found with keycloak user ID:: " + residentId));

        boolean alreadyLinked = arRepository.existsByApartmentIdAndResidentId(apartmentId, residentId);

        if (alreadyLinked) {
            return;
        }

        ApartmentResident link = ApartmentResident.create(apartment, resident, OCCUPANT);

        arRepository.save(link);
    }

    @Override
    @Transactional
    public void removeResidentFromApartment(int apartmentId, int residentId) {
        Apartment apartment = apartmentRepository.findById(apartmentId)
                .orElseThrow(() -> new ApartmentNotFoundException("Apartment not found with ID:: " + apartmentId));
        apartment.getApartmentResidents()
                .removeIf(ar -> ar.getResident().getId() == residentId);
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
