import { useEffect, useState } from "react";
import type { ApartmentResponse, PaymentResponse, ResidentResponse } from "../../../types/api";
import { getPaymentById, getMyPaymentById } from "../api";
import Loading from "../../../components/Loading";
import { getApartmentById, getOneOfMyApartments, getResidentFromMyApartment } from "../../apartments/api";
import formatDate from "../../../utils/formatDate";
import { getResidentById } from "../../residents/api";
import { Card } from "@mui/material";

interface PaymentDetailsProps {
    paymentId: number,
    isAdmin: boolean
}

const PaymentDetails = ({paymentId, isAdmin} : PaymentDetailsProps) => {

    const [payment, setPayment] = useState<PaymentResponse | null>(null);
    const [apartment, setApartment] = useState<ApartmentResponse | null>(null);
    const [resident, setResident] = useState<ResidentResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = isAdmin ? await getPaymentById(paymentId) : await getMyPaymentById(paymentId);
                setPayment(data);
                const dataApartment = isAdmin ? await getApartmentById(data.apartmentId) : await getOneOfMyApartments(data.apartmentId);
                setApartment(dataApartment);
                const dataResident = isAdmin ? await getResidentById(data.residentId) : await getResidentFromMyApartment(data.apartmentId, data.residentId);
                setResident(dataResident);
                setLoading(false);
            } catch (error) {
                console.log(error)
            }
        }

        fetchData();

    }, [isAdmin, paymentId]);

    if (loading) {
        return <Loading text="Cargando Pago..." />
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
                        Detalles del Pago
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
                                {payment ? formatDate(payment.createdDate) : "Cargando"}
                            </p>
                        </div>
                        <div>
                            <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>Cantidad</span>
                            <p
                                style={{
                                    fontWeight: 600,
                                    color: (payment?.amount ?? 0) < 0 ? "#dc2626" : "#16a34a"
                                }}
                            >
                                ${payment?.amount}
                            </p>
                        </div>
                        <div>
                            <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>Tipo</span>
                            <p style={{ fontWeight: 500 }}>
                                {payment?.type === "CASH" ? "Efectivo" : "Transferencia"}
                            </p>
                        </div>
                        <div>
                            <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>Referencia</span>
                            <p style={{ fontWeight: 500 }}>
                                {payment?.reference || "N/A"}
                            </p>
                        </div>
                        <div>
                            <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>Apartamento</span>
                            <p style={{ fontWeight: 500 }}>{apartment?.code}</p>
                        </div>
                        <div>
                            <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>Creado por</span>
                            <p style={{ fontWeight: 500 }}>
                                {resident?.firstName} {resident?.lastName}
                            </p>
                        </div>
                        <div>
                            <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>Aprobado</span>
                            <p
                                style={{
                                    fontWeight: 600,
                                    color: payment?.approved ? "#16a34a" : "#dc2626"
                                }}
                            >
                                {payment?.approved ? "Sí" : "No"}
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </>
    )
}

export default PaymentDetails;