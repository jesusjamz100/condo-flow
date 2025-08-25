import httpClient from "../../../services/httpClient";
import type { ExpenseRequest, ExpenseResponse, PageResponse } from "../../../types/api";

// Admin
export async function getAllExpenses(page: number = 0, size: number = 10, startDate?: string, endDate?: string) {
    const { data } = await httpClient.get<PageResponse<ExpenseResponse>>(
        `/expenses/admin?page=${page}&size=${size}`+
        `${startDate ? "&startDate="+ startDate : ""}`+
        `${endDate ? "&endDate="+ endDate : ""}`
    )
    return data;
}

export async function getExpenseById(expenseId: number) {
    const { data } = await httpClient.get(`/expense/admin/${expenseId}`);
    return data;
}

export async function createExpense(expense: ExpenseRequest) {
    const { data } = await httpClient.post<void>("/expenses/admin", expense);
    return data;
}

export async function updateExpense(expense: ExpenseRequest) {
    const { data } = await httpClient.put<ExpenseResponse>("/expenses/admin/update", expense);
    return data;
}

export async function deleteExpenseById(expenseId: number) {
    const { data } = await httpClient.delete<void>(`/expenses/admin/${expenseId}`);
    return data;
}