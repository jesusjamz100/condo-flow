import { useEffect, useState } from "react";
import type { ExpenseResponse } from "../../../types/api";
import Loading from "../../../components/Loading";
import { getExpenseById } from "../api";
import formatDate from "../../../utils/formatDate";
import { Card } from "@mui/material";

const ExpenseDetails = ({ expenseId }: { expenseId: number }) => {

    const [expense, setExpense] = useState<ExpenseResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getExpenseById(expenseId);
            setExpense(data);
            setLoading(false);
        };
        fetchData();
    }, [expenseId])

    if (loading) {
        return <Loading text="Cargando Gasto..." />
    }

    return (
        <>
            <Card
                sx={{
                    borderRadius: 2,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 3
                }}
            >
                <div>
                    <p style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 8 }}>
                        Detalles del Gasto
                    </p>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                            gap: "0.75rem"
                        }}
                    >
                        <div>
                            <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>Fecha</span>
                            <p style={{ fontWeight: 500 }}>
                                {expense ? formatDate(expense.createdDate) : "Cargando"}
                            </p>
                        </div>
                        <div>
                            <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>Descripción</span>
                            <p style={{ fontWeight: 600 }}>
                                {expense?.description}
                            </p>
                        </div>
                        <div>
                            <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>Monto</span>
                            <p style={{ fontWeight: 600, color: "#dc2626" }}>
                                ${expense?.amount}
                            </p>
                        </div>
                        <div>
                            <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>Facturado</span>
                            <p style={{ fontWeight: 500 }}>
                                {expense?.billed ? "Sí" : "No"}
                            </p>
                        </div>
                        <div>
                            <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>Tipo de Gasto</span>
                            <p style={{ fontWeight: 500 }}>
                                {expense?.scopeType === "SECTOR"
                                    ? "Sector"
                                    : expense?.scopeType === "TOWER"
                                    ? "Torre"
                                    : "General"}
                            </p>
                        </div>
                        <div>
                            <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>Torres</span>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                                    {expense?.scopeType === "GENERAL" ? (
                                        <span style={{ color: "#6b7280" }}>Todas</span>
                                    ) : (
                                        Array.from(expense?.applicableTowers || [])
                                        .reverse()
                                        .map((t) => (
                                            <Card
                                                key={t}
                                                sx={{
                                                    px: 1.5,
                                                    py: 0.5,
                                                    borderRadius: 5,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                    backgroundColor: "#f9fafb"
                                                }}
                                            >
                                                <span>{t}</span>
                                            </Card>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </>
    )
}

export default ExpenseDetails;