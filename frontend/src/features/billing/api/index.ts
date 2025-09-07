import httpClient from "../../../services/httpClient";
import type { InvoiceResponse } from "../../../types/api";

export async function getAllMyInvoices(apartmentId?: number, startDate?: string, endDate?: string) {

    const query =
        "/billing/myInvoices?" +
        (apartmentId ? "&apartmentId=" + apartmentId : "") +
        (startDate ? "&startDate=" + startDate : "") +
        (endDate ? "&endDate=" + endDate : "");

    const { data } = await httpClient.get<InvoiceResponse[]>(query);
    return data;
}

export async function getOneOfMyInvoices(invoiceId: number) {
    const { data } = await httpClient.get<InvoiceResponse>(`/billing/myInvoices/${invoiceId}`);
    return data;
}

// ADMIN ROUTES
export async function generateInvoices(startDate: string, endDate: string) {
    const { data } = await httpClient.post<void>(`/billing/admin?startDate=${startDate}&endDate=${endDate}`);
    return data;
}

export async function getAllInvoices(apartmentId?: number, startDate?: string, endDate?: string) {

    const query =
        "/billing/admin?" +
        (apartmentId ? "&apartmentId=" + apartmentId : "") +
        (startDate ? "&startDate=" + startDate : "") +
        (endDate ? "&endDate=" + endDate : "");

    const { data } = await httpClient.get<InvoiceResponse[]>(query);
    return data;
}

export async function getInvoiceById(invoiceId: number) {
    const { data } = await httpClient.get<InvoiceResponse>(`/billing/admin/${invoiceId}`);
    return data;
}