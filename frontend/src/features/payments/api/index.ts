import httpClient from "../../../services/httpClient";
import type { PageResponse, PaymentResponse, PaymentRequest } from "../../../types/api";


// Publicas
export async function getAllMyPayments(page: number = 0, size: number = 10, type?: string) {
    const { data } = await httpClient.get<PageResponse<PaymentResponse>>(
        `/payments/myPayments?page=${page}&size=${size}
        ${type ? "&type="+ type : ''}`
    );
    return data;
}

export async function getMyPaymentById(paymentId: number) {
    const { data } = await httpClient.get<PaymentResponse>(`/payments/myPayments/${paymentId}`);
    return data;
}

export async function getMyPaymentsByApartmentId(apartmentId: number, page: number = 0, size: number = 10, type?: string) {
    const { data } = await httpClient.get<PageResponse<PaymentResponse>>(
        `/payments/myPayments/findByApartment/${apartmentId}?page=${page}&size=${size}
        ${type ? "&type="+ type : ''}`
    )
    return data;
}

export async function registerPayment(payment: PaymentRequest) {
    const { data } = await httpClient.post<void>("/payments/myPayments/register", payment);
    return data;
}

// Admin
export async function getAllPayments(page: number = 0, size: number = 10, type?: string, approved?: boolean, startDate?: string, endDate?: string) {
    const { data } = await httpClient.get<PageResponse<PaymentResponse>>(
        `/payments/admin?page=${page}&size=${size}`+
        `${type ? "&type="+ type : ''}`+
        `${approved !== undefined ? "&approved="+ approved : ''}`+
        `${startDate ? "&startDate="+ startDate : ''}`+
        `${endDate ? "&endDate="+ endDate : ''}`
    );
    return data;
}

export async function getPaymentById(paymentId: number) {
    const { data } = await httpClient.get<PaymentResponse>(`/payments/admin/${paymentId}`);
    return data;
}

export async function getAllPaymentsByApartmentId(apartmentId: number) {
    const { data } = await httpClient.get<PageResponse<PaymentResponse>>(`/payments/admin/apartments/byId/${apartmentId}`);
    return data;
}

export async function approvePayment(paymentId: number) {
    const { data } = await httpClient.patch<void>(`/payments/admin/approve/${paymentId}`);
    return data;
}