import { useState, useEffect } from "react";
import Loading from "../../../components/Loading";
import type { ApartmentResponse, ExpenseResponse, InvoiceResponse } from "../../../types/api";
import formatDate from "../../../utils/formatDate";
import { getInvoiceById } from "../api";
import { getApartmentById, getOneOfMyApartments } from "../../apartments/api";
import { getAllExpenses } from "../../expenses/api";
import { Card, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

const InvoiceDetails = ({ invoiceId, isAdmin }: { invoiceId: number; isAdmin: boolean }) => {

    const [invoice, setInvoice] = useState<InvoiceResponse | null>(null);
    const [apartment, setApartment] = useState<ApartmentResponse | null>(null);
    const [expenses, setExpenses] = useState<ExpenseResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataInvoice = await getInvoiceById(invoiceId);
                setInvoice(dataInvoice);

                const dataApartment = isAdmin
                    ? await getApartmentById(dataInvoice.apartmentId)
                    : await getOneOfMyApartments(dataInvoice.apartmentId);
                setApartment(dataApartment);

                if (dataInvoice.period) {
                    const [year, month] = dataInvoice.period.split("-").map(Number);

                    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
                    const lastDay = new Date(year, month, 0).getDate();
                    const endDate = `${year}-${String(month).padStart(2, "0")}-${lastDay}`;

                    const dataExpenses = await getAllExpenses(0, 5000, startDate, endDate, true);
                    setExpenses(dataExpenses.content || []);
                }
            } catch (error) {
                console.error("Error cargando datos de factura:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [invoiceId, isAdmin])

    if (loading) {
        return <Loading text="Cargando Factura..." />
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
                        Detalles de la Factura
                    </p>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                            gap: "0.75rem"
                        }}
                    >
                        <div>
                            <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>Subtotal</span>
                            <p style={{ fontWeight: 500 }}>${invoice?.amount}</p>
                        </div>
                        <div>
                            <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>Descuento (10%)</span>
                            <p style={{
                                    fontWeight: 500,
                                    color: invoice?.discountAmount ? "#16a34a" : "#000"
                                }}
                            >
                                {invoice?.discountAmount ? `$${invoice?.discountAmount}` : "N/A" }
                            </p>
                        </div>
                        <div>
                            <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>Multa (10%)</span>
                            <p
                                style={{
                                    fontWeight: 600,
                                    color: invoice?.penaltyAmount ? "#dc2626" : "#000"
                                }}
                            >
                                <p style={{ fontWeight: 500 }}>{invoice?.penaltyAmount ? `$${invoice?.penaltyAmount}` : "N/A" }</p>
                            </p>
                        </div>
                        <div>
                            <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>Total</span>
                            <p style={{ fontWeight: 500 }}>${invoice?.finalAmount}</p>
                        </div>
                        <div>
                            <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>Apartamento</span>
                            <p style={{ fontWeight: 500 }}>{apartment?.code}</p>
                        </div>
                        <div>
                            <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>Fecha</span>
                            <p style={{ fontWeight: 500 }}>{ invoice ? formatDate(invoice.createdDate) : "Cargando" }</p>
                        </div>
                    </div>
                </div>
            </Card>
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 600,
                    color: "#111827",
                    mb: 1,
                    textAlign: "left"
                }}
            >
                    Gastos Incluidos
            </Typography>
            {expenses.length > 0 ? (
                <TableContainer
                        component={Paper}
                        elevation={0}
                        sx={{
                            borderRadius: 2,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                            overflow: "hidden"
                        }}
                    >
                    <Table sx={{ minWidth: 650 }} aria-label="Últimos pagos">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#f9fafb" }}>
                                {["Fecha", "Descripción", "Monto", "Tipo"].map((head) => (
                                    <TableCell
                                        key={head}
                                        align="center"
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: "0.9rem",
                                            color: "#374151",
                                            borderBottom: "1px solid #e5e7eb"
                                        }}
                                    >
                                        {head}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {expenses.map((expense) => (
                                <TableRow
                                    key={expense.id}
                                    hover
                                    sx={{
                                        "&:last-child td, &:last-child th": { border: 0 },
                                        transition: "background-color 0.2s ease",
                                        "&:hover": { backgroundColor: "#f3f4f6" }
                                    }}
                                >
                                    <TableCell align="center">{formatDate(expense.createdDate)}</TableCell>
                                    <TableCell align="center">{expense.description}</TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{
                                        color: expense.amount < 0 ? "error.main" : "success.main",
                                        fontWeight: 500
                                        }}
                                    >
                                        ${expense.amount}
                                    </TableCell>
                                    <TableCell align="center">
                                        {expense.scopeType === "SECTOR" ? "Sector" : expense.scopeType === "TOWER" ? "Torre" : "General" }
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : <>No hay pagos en este apartamento</>}
        </>
    )
}

export default InvoiceDetails;