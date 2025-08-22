import { useEffect, useState } from "react";
import type { PaymentResponse } from "../../../types/api";
import { getAllMyPayments, getAllPayments } from "../api";
import Loading from "../../../components/Loading";
import { Link } from "react-router";

interface PaymentsListProps {
    isAdmin: boolean
}

const PaymentsList = ({isAdmin}: PaymentsListProps) => {

    const [payments, setPayments] = useState<PaymentResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = isAdmin ? await getAllPayments() : await getAllMyPayments();
                setPayments(data.content ?? []);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [isAdmin]);

    if (loading) {
        return <Loading text="Cargando Pagos..." />;
    }

    return (
        <>
            {payments.length === 0 ? (<p>No hay Pagos</p>) : (
                <table className="text-center mt-10">
                    <thead className="table-header-group">
                        <tr>
                            <th>Fecha</th>
                            <th>Descripción</th>
                            <th>Monto</th>
                            <th>Aprobado</th>
                            <th>Tipo</th>
                            <th>Referencia</th>
                        </tr>
                    </thead>
                    <tbody className="table-row-group">
                        {payments.map(payment => {
                            return (
                                <tr key={payment.id}>
                                    <td>
                                        {/* {payment.createdDate.getDay()}-
                                        {payment.createdDate.getMonth()}-
                                        {payment.createdDate.getFullYear()} */}
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
                                    <td>
                                        {payment.reference ? payment.reference : "N/A"}
                                    </td>
                                    <td className="flex gap-2 items-center justify-center">
                                        <Link to={`/dashboard/pagos/${payment.id}`}>
                                            <button className="p-2 bg-blue-300 rounded-lg my-5 hover:cursor-pointer">Detalles</button>
                                        </Link>
                                        {isAdmin ? <></> : <></>}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            )}
        </>
    );
}

export default PaymentsList;