package com.condoflow.condo.apartment.service;

import com.condoflow.condo.apartment.dto.ApartmentResponse;
import com.condoflow.condo.common.PageResponse;

public interface ApartmentService {
    PageResponse<ApartmentResponse> findAllApartments(int page, int size);
}
