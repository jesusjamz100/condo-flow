import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Button, Card, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import type { ResidentResponse, ApartmentResponse, PageResponse, PaymentResponse } from "../../../types/api";
import { getApartmentById, getApartmentResidents, getMyApartmentResidents, getOneOfMyApartments, removeResidentFromApartment } from "../api";
import Loading from "../../../components/Loading";
import { getAllPaymentsByApartmentId, getMyPaymentsByApartmentId } from "../../payments/api";
import formatDate from "../../../utils/formatDate";

interface ApartmentDetailsProps {
    apartmentId: number,
    isAdmin: boolean
}

const ApartmentDetails = ({apartmentId, isAdmin} : ApartmentDetailsProps) => {

    const [apartment, setApartment] = useState<ApartmentResponse | null>(null);
    const [residents, setResidents] = useState<ResidentResponse[]>([]);
    const [payments, setPayments] = useState<PaymentResponse[]>([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apartmentData = isAdmin ? await getApartmentById(apartmentId) : await getOneOfMyApartments(apartmentId);
                setApartment(apartmentData);
                const paymentsData: PageResponse<PaymentResponse> = isAdmin ? await getAllPaymentsByApartmentId(apartmentData.id) : await getMyPaymentsByApartmentId(apartmentData.id, 0, 5);
                setPayments(paymentsData.content);
                const residentData = isAdmin ? (await getApartmentResidents(apartmentId, 0, 100)).content : await getMyApartmentResidents(apartmentId);
                setResidents(residentData);
                setLoading(false);
            } catch (error) {
                console.log(error)
            }
        }

        fetchData();

    }, [isAdmin, apartmentId]);

    const handleClickRemoveResident = async (residentId: number) => {
        await removeResidentFromApartment(apartmentId, residentId)
        window.location.reload();
    }

    if (loading) {
        return <Loading text="Cargando Apartamento..." />
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
                        Detalles del Apartamento
                    </p>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                            gap: "0.75rem"
                        }}
                    >
                        <div>
                            <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>Torre</span>
                            <p style={{ fontWeight: 500 }}>{apartment?.tower}</p>
                        </div>
                        <div>
                            <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>Código</span>
                            <p style={{ fontWeight: 500 }}>{apartment?.code}</p>
                        </div>
                        <div>
                            <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>Balance</span>
                            <p
                                style={{
                                    fontWeight: 600,
                                    color:
                                    (apartment?.balance ?? 0) < 0 ? "#dc2626" : "#16a34a"
                                }}
                            >
                                ${apartment?.balance}
                            </p>
                        </div>
                        <div>
                            <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>Área</span>
                            <p style={{ fontWeight: 500 }}>{apartment?.sqm} m²</p>
                        </div>
                    </div>
                </div>

                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <p style={{ fontWeight: 600 }}>Residentes</p>
                    {isAdmin && (
                        <Link to={`/admin/dashboard/apartamentos/${apartmentId}/residente/agregar`}>
                            <Button variant="outlined" color="success" size="small">
                                <Add />
                            </Button>
                        </Link>
                    )}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                        {residents.length > 0 ? (
                            residents.map((r) => (
                                <Card
                                    key={r.id}
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
                                    <span>{r.firstName} {r.lastName}</span>
                                    {isAdmin && (
                                        <Close
                                            fontSize="small"
                                            sx={{
                                            ":hover": { cursor: "pointer", color: "error.main" }
                                            }}
                                            onClick={() => handleClickRemoveResident(r.id)}
                                        />
                                    )}
                                </Card>
                            ))
                        ) : (
                            <span style={{ color: "#6b7280" }}>No hay residentes</span>
                        )}
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
                    Últimos pagos
            </Typography>
            {payments.length > 0 ? (
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
                                {["Fecha", "Descripción", "Monto", "Aprobado", "Tipo", "Referencia"].map((head) => (
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
                            {payments.map((payment) => (
                                <TableRow
                                    key={payment.id}
                                    hover
                                    sx={{
                                        "&:last-child td, &:last-child th": { border: 0 },
                                        transition: "background-color 0.2s ease",
                                        "&:hover": { backgroundColor: "#f3f4f6" }
                                    }}
                                >
                                    <TableCell align="center">{formatDate(payment.createdDate)}</TableCell>
                                    <TableCell align="center">{payment.description}</TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{
                                        color: payment.amount < 0 ? "error.main" : "success.main",
                                        fontWeight: 500
                                        }}
                                    >
                                        ${payment.amount}
                                    </TableCell>
                                    <TableCell align="center">{payment.approved ? "Sí" : "No"}</TableCell>
                                    <TableCell align="center">
                                        {payment.type === "CASH" ? "Efectivo" : "Transferencia"}
                                    </TableCell>
                                    <TableCell align="center">{payment.reference || "N/A"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : <>No hay pagos en este apartamento</>}
        </>
    )
}

export default ApartmentDetails;