import { useEffect, useState } from "react";
import type { PaymentResponse } from "../../../types/api";
import { getPaymentById, getMyPaymentById } from "../api";
import Loading from "../../../components/Loading";

interface PaymentDetailsProps {
    paymentId: number,
    isAdmin: boolean
}

const PaymentDetails = ({paymentId, isAdmin} : PaymentDetailsProps) => {

    const [payment, setPayment] = useState<PaymentResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = isAdmin ? await getPaymentById(paymentId) : await getMyPaymentById(paymentId);
                setPayment(data);
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
            <div className="flex flex-col gap-5 w-full">
                <p className="text-lg">
                    <span className="font-semibold">Fecha: </span>
                </p>
                <p className="text-lg">
                    <span className="font-semibold">Cantidad: </span>
                    ${payment?.amount}
                </p>
                <p className="text-lg">
                    <span className="font-semibold">Tipo: </span>
                    {payment?.type === "CASH" ? "Efectivo" : "Transferencia"}
                </p>
                <p className="text-lg">
                    <span className="font-semibold">Referencia: </span>
                    {payment?.reference ? payment?.reference : "N/A"}
                </p>
                <p className="text-lg">
                    <span className="font-semibold">Aprobado: </span>
                    {payment?.approved ? "Sí" : "No"}
                </p>
            </div>
        </>
    )
}

export default PaymentDetails;