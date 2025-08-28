package com.condoflow.condo.apartment.service;

import com.condoflow.condo.apartment.Tower;
import com.condoflow.condo.apartment.dto.ApartmentRequest;
import com.condoflow.condo.apartment.dto.ApartmentResponse;
import com.condoflow.condo.common.PageResponse;
import com.condoflow.condo.resident.dto.ResidentResponse;
import org.springframework.security.oauth2.jwt.Jwt;

import java.math.BigDecimal;
import java.util.List;

public interface ApartmentService {
    PageResponse<ApartmentResponse> findMyApartments(Jwt jwt, int page, int size);

    ApartmentResponse findApartmentById(Jwt jwt, int apartmentId);

    List<ResidentResponse> findResidentsByApartmentId(Jwt jwt, int apartmentId);

    PageResponse<ApartmentResponse> findAllApartments(int page, int size, Tower tower);

    ApartmentResponse findApartmentById(int apartmentId);

    Integer createApartment(ApartmentRequest request);

    ApartmentResponse updateApartment(ApartmentRequest request);

    void updateBalanceFromPayment(Integer apartmentId, BigDecimal amount);

    void updateBalanceFromInvoice(Integer apartmentId, BigDecimal amount);

    void deleteApartmentById(int apartmentId);

    PageResponse<ResidentResponse> findApartmentResidents(int apartmentId, int page, int size);

    PageResponse<ApartmentResponse> findApartmentsByResidentId(int residentId, int page, int size);

    void addResidentToApartment(int apartmentId, int residentId);

    void removeResidentFromApartment(int apartmentId, int residentId);
}
