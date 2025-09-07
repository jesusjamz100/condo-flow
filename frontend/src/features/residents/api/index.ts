import httpClient from "../../../services/httpClient";
import type { PageResponse, ResidentProfileResponse, ResidentRequest, ResidentResponse } from "../../../types/api";

// Publicas
export async function getMe() {
    const { data } = await httpClient.get<ResidentProfileResponse>("/residents/me");
    return data;
}

// Administrador

export async function getAllResidents(page: number = 0, size: number = 10) {
    const { data } = await httpClient.get<PageResponse<ResidentResponse>>(`/residents/admin?page=${page}&size=${size}`);
    return data;
}

export async function getResidentById(residentId: number) {
    const { data } = await httpClient.get<ResidentResponse>(`/residents/admin/findResidentById/${residentId}`);
    return data;
}

export async function getResidentByKeycloakId(keycloakUserId: number) {
    const { data } = await httpClient.get<ResidentResponse>(`/residents/admin/findResidentByKeycloakUserId/${keycloakUserId}`);
    return data;
}

export async function getResidentDocument(document: number) {
    const { data } = await httpClient.get<ResidentResponse>(`/residents/admin/findResidentBydocument/${document}`);
    return data;
}

export async function createResident(resident: ResidentRequest) {
    const { data } = await httpClient.post<number>("/residents/admin/createResident", resident);
    return data;
}

export async function updateResident(resident: ResidentRequest) {
    const { data } = await httpClient.put<ResidentResponse>("/residents/admin/updateResident", resident);
    return data;
}

export async function updateKeycloakUserId(residentId: number, keycloakUserId: string) {
    const { data } = await httpClient.patch<void>(`/residents/admin/updateKeycloakUserId/${residentId}/${keycloakUserId}`);
    return data;
}

export async function updateDocument(residentId: number, document: string) {
    const { data } = await httpClient.patch<void>(`/residents/admin/updateDocument/${residentId}/${document}`);
    return data;
}

export async function deleteResidentById(residentId: number) {
    const { data } = await httpClient.delete<void>(`/residents/admin/deleteById/${residentId}`);
    return data;
}