import dayjs from "dayjs";
import type { ExpenseResponse } from "../types/api";

interface MonthlyExpense {
    month: string;
    total: number;
}

export function aggregateExpenses(expenses: ExpenseResponse[]): MonthlyExpense[] {
    const currentYear = dayjs().year();
    const currentMonth = dayjs().month();

    const months = Array.from({ length: currentMonth + 1 }, (_, i) => ({
        month: dayjs(`${currentYear}-${String(i+1).padStart(2, '0')}-01`).format("YYYY-MM-DD"),
        total: 0
    }));

    expenses
        .filter(e => dayjs(e.createdDate).year() === currentYear)
        .forEach(e => {
            const m = dayjs(e.createdDate).month(); // 0-index
            if (m <= currentMonth) {
                months[m].total += Number(e.amount) || 0;
            }
        });

    return months;
}