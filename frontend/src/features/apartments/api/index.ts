import httpClient from "../../../services/httpClient";
import type { ApartmentRequest, ApartmentResponse, PageResponse, ResidentResponse } from "../../../types/api";

// Publicas
export async function getMyApartments(page: number = 0, size: number = 10) {
    const { data } = await httpClient.get<PageResponse<ApartmentResponse>>(`/apartments/myApartments?page=${page}&size=${size}`);
    return data;
}

export async function getOneOfMyApartments(apartmentId: number) {
    const { data } = await httpClient.get<ApartmentResponse>(`/apartments/myApartments/${apartmentId}`);
    return data;
}

export async function getMyApartmentResidents(apartmentId: number) {
    const { data } = await httpClient.get<ResidentResponse[]>(`/apartments/myApartments/${apartmentId}/residents`);
    return data;
}

// Admin
export async function getAllApartments(page: number = 0, size: number = 10, tower?: string) {
    const { data } = await httpClient.get<PageResponse<ApartmentResponse>>(`/apartments/admin?page=${page}&size=${size}${tower ? "&tower="+ tower : ''}`);
    return data;
}

export async function getApartmentById(apartmentId: number) {
    const { data } = await httpClient.get<ApartmentResponse>(`/apartments/admin/findApartmentById/${apartmentId}`);
    return data;
}

export async function createApartment(apartment: ApartmentRequest) {
    const { data } = await httpClient.post<number>("/apartments/admin/createApartment", apartment);
    return data;
}

export async function updateApartment(apartment: ApartmentRequest) {
    const { data } = await httpClient.put<ApartmentResponse>("/apartments/admin/updateApartment", apartment);
    return data;
}

export async function deleteApartmentById(apartmentId: number) {
    const { data } = await httpClient.delete(`/apartments/admin/deleteById/${apartmentId}`);
    return data;
}

export async function getApartmentsByResidentId(residentId: number, page: number = 0, size: number = 10) {
    const { data } = await httpClient.get<PageResponse<ApartmentResponse>>(`/apartments/admin/${residentId}?page=${page}&size=${size}`);
    return data;
}

export async function getApartmentResidents(apartmentId: number, page: number = 0, size: number = 10) {
    const { data } = await httpClient.get<PageResponse<ResidentResponse>>(`/apartments/admin/${apartmentId}/residents?page=${page}&size=${size}`);
    return data;
}

export async function addResidentToApartment(apartmentId: number, residentId: number) {
    const { data } = await httpClient.post<void>(`/apartments/admin/${apartmentId}/residents/${residentId}`);
    return data;
}

export async function removeResidentFromApartment(apartmentId: number, residentId: number) {
    const { data } = await httpClient.delete<void>(`/apartments/admin/${apartmentId}/residents/${residentId}`);
    return data;
}