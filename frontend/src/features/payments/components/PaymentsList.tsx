import { useEffect, useState } from "react";
import { Button, ButtonGroup, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Delete, Lightbulb, ModeEdit } from "@mui/icons-material";
import type { PaymentResponse } from "../../../types/api";
import { approvePayment, getAllMyPayments, getAllPayments } from "../api";
import Loading from "../../../components/Loading";
import { Link } from "react-router";
import formatDate from "../../../utils/formatDate";

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

    const handleApproveClick = async (paymentId: number) => {
        await approvePayment(paymentId);
        location.reload();
    }

    if (loading) {
        return <Loading text="Cargando Pagos..." />;
    }

    return (
        <>
            {payments.length < 1 ? (<p>No hay Pagos</p>) : (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth:650, textAlign:"center"}} aria-label="Apartamentos">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{fontWeight: "bold"}}>ID</TableCell>
                                <TableCell sx={{fontWeight: "bold"}}>Fecha</TableCell>
                                <TableCell sx={{fontWeight: "bold"}}>Descripción</TableCell>
                                <TableCell sx={{fontWeight: "bold"}}>Monto</TableCell>
                                <TableCell sx={{fontWeight: "bold"}}>Aprobado</TableCell>
                                <TableCell sx={{fontWeight: "bold"}}>Tipo</TableCell>
                                <TableCell sx={{fontWeight: "bold"}}>Referencia</TableCell>
                                <TableCell sx={{fontWeight: "bold"}}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {payments.map(payment => {return (
                                <TableRow key={payment.id}>
                                    <TableCell>{payment.id}</TableCell>
                                    <TableCell>{formatDate(payment.createdDate)}</TableCell>
                                    <TableCell>{payment.description}</TableCell>
                                    <TableCell>{payment.amount}</TableCell>
                                    <TableCell>{payment.approved ? "Sí" : "No"}</TableCell>
                                    <TableCell>{payment.type === "CASH" ? "Efectivo" : "Transferencia"}</TableCell>
                                    <TableCell>{payment.reference ? payment.reference : "N/A"}</TableCell>
                                    <TableCell>
                                        {isAdmin ?
                                        <>
                                            <ButtonGroup variant="text" aria-label="Botones de Acción">
                                                <Link to={`/admin/dashboard/pagos/${payment.id}`}>
                                                    <Button size="small" startIcon={<Lightbulb />}>Detalles</Button>
                                                </Link>
                                                <Link to={`/admin/dashboard/pagos/${payment.id}/editar`}>
                                                    <Button size="small" startIcon={<ModeEdit />}>Editar</Button>
                                                </Link>
                                                <Button onClick={() => handleApproveClick(payment.id)} startIcon={<Delete />} size="small">Aprobar</Button>
                                            </ButtonGroup>
                                        </> : <>
                                            <Link to={`/dashboard/pagos/${payment.id}`}>
                                                <Button variant="outlined" size="small" startIcon={<Lightbulb />}>Detalles</Button>
                                            </Link>
                                        </>}
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </>
    );
}

export default PaymentsList;