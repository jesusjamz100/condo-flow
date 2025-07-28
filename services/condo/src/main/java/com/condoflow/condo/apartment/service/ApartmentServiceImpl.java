package com.condoflow.condo.apartment.service;

import com.condoflow.condo.apartment.Apartment;
import com.condoflow.condo.apartment.ApartmentMapper;
import com.condoflow.condo.apartment.ApartmentRepository;
import com.condoflow.condo.apartment.dto.ApartmentResponse;
import com.condoflow.condo.common.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApartmentServiceImpl implements ApartmentService {

    private final ApartmentRepository repository;
    private final ApartmentMapper mapper;

    @Override
    public PageResponse<ApartmentResponse> findAllApartments(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
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
}
