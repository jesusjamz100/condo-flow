import { useEffect, useState } from "react";
import type { ApartmentResponse, PageResponse, PaymentResponse } from "../../../types/api";
import { getApartmentById, getOneOfMyApartments } from "../api";
import Loading from "../../../components/Loading";
import { getMyPaymentsByApartmentId } from "../../payments/api";

interface ApartmentDetailsProps {
    apartmentId: number,
    isAdmin: boolean
}

const ApartmentDetails = ({apartmentId, isAdmin} : ApartmentDetailsProps) => {

    const paymentMock = {
        id: 1,
        amount: 10,
        description: "Pago test",
        type: "CASH",
        apartmentId: 1,
        residentId: 1,
        approved: false,
        createdDate: new Date("2025-10-10")
    }

    const [apartment, setApartment] = useState<ApartmentResponse | null>(null);
    const [payments, setPayments] = useState<PaymentResponse[]>([paymentMock])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apartmentData = isAdmin ? await getApartmentById(apartmentId) : await getOneOfMyApartments(apartmentId);
                setApartment(apartmentData);
                // const paymentsData: PageResponse<PaymentResponse> = isAdmin ? await getMyPaymentsByApartmentId(apartmentData.id) : await getMyPaymentsByApartmentId(apartmentData.id, 0, 5);
                // setPayments(paymentsData.content);
                setLoading(false);
            } catch (error) {
                console.log(error)
            }
        }

        fetchData();

    }, [isAdmin, apartmentId]);

    if (loading) {
        return <Loading text="Cargando Apartamento..." />
    }

    return (
        <>
            <div className="flex flex-col gap-5 w-full">
                <p className="text-lg">Torre {apartment?.tower}</p>
                <p className="text-lg">
                    <span className="font-semibold">Código: </span>
                    {apartment?.code}
                </p>
                <p className="text-lg">
                    <span className="font-semibold">Balance: </span>
                    ${apartment?.balance}</p>
                <p className="text-lg">
                    <span className="font-semibold">Área: </span>
                    {apartment?.sqm}m²
                </p>
                <p className="text-2xl font-semibold mt-5 w-full text-center">Últimos Pagos</p>
                {payments.length > 0 ? (
                    <table className="table-auto text-center">
                        <thead className="table-header-group">
                            <tr>
                                <th>Fecha</th>
                                <th>Descripción</th>
                                <th>Monto</th>
                                <th>Aprobado</th>
                                <th>Tipo</th>
                            </tr>
                        </thead>
                        <tbody className="table-row-group">
                            {payments.map(payment => {
                                return (
                                    <tr>
                                        <td>
                                            {payment.createdDate.getDay()}-
                                            {payment.createdDate.getMonth()}-
                                            {payment.createdDate.getFullYear()}
                                        </td>
                                        <td>
                                            {payment.description}
                                        </td>
                                        <td>
                                            ${payment.amount}
                                        </td>
                                        <td>
                                            {payment.approved ? "Sí" : "No"}
                                        </td>
                                        <td>
                                            {payment.type === "CASH" ? "Efectivo" : "Transferencia"}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                ) : <>No hay pagos en este apartamento</>}
            </div>
        </>
    )
}

export default ApartmentDetails;