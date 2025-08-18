import httpClient from "../../../services/httpClient";

export async function generateInvoices(startDate: Date, endDate: Date) {
    const { data } = await httpClient.post<void>(`/billing/admin?startDate=${startDate}&endDate=${endDate}`);
    return data;
}