package com.condoflow.condo.apartment.service;

import com.condoflow.condo.apartment.dto.ApartmentRequest;
import com.condoflow.condo.apartment.dto.ApartmentResponse;
import com.condoflow.condo.common.PageResponse;
import org.springframework.security.oauth2.jwt.Jwt;

public interface ApartmentService {
    PageResponse<ApartmentResponse> findMyApartments(Jwt jwt, int page, int size);
    ApartmentResponse findApartmentById(Jwt jwt, int apartmentId);
    PageResponse<ApartmentResponse> findAllApartments(int page, int size);
    ApartmentResponse findApartmentById(int apartmentId);
    Integer createApartment(ApartmentRequest request);
    ApartmentResponse updateApartment(ApartmentRequest request);
    void deleteApartmentById(int apartmentId);
}
