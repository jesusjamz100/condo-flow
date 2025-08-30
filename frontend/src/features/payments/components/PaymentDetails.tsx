import { useEffect, useState } from "react";
import type { ApartmentResponse, PaymentResponse, ResidentResponse } from "../../../types/api";
import { getPaymentById, getMyPaymentById } from "../api";
import Loading from "../../../components/Loading";
import { getApartmentById, getOneOfMyApartments, getResidentFromMyApartment } from "../../apartments/api";
import formatDate from "../../../utils/formatDate";
import { getResidentById } from "../../residents/api";

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
            <div className="flex flex-col gap-5 w-full">
                <p className="text-lg">
                    <span className="font-semibold">Fecha: </span>
                    { payment ? formatDate(payment.createdDate) : "Cargando" }
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
                    <span className="font-semibold">Apartamento: </span>
                    {apartment?.code}
                </p>
                <p className="text-lg">
                    <span className="font-semibold">Creado por: </span>
                    {resident?.firstName} {resident?.lastName}
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