import { useEffect, useState } from "react";
import { Button, ButtonGroup, FormControl, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, type SelectChangeEvent } from "@mui/material";
import { Done, Lightbulb } from "@mui/icons-material";
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
    const [typeFilter, setTypeFilter] = useState<string>("");
    const [approvedFilter, setApprovedFilter] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            if (isAdmin) {
                const data = await getAllPayments(
                    0, 100000,
                    typeFilter || undefined,
                    approvedFilter !== "" ? (approvedFilter === "true" ? true : false) : undefined,
                    startDate || undefined,
                    endDate || undefined
                );
                setPayments(data.content ?? []);
            } else {
                const data = await getAllMyPayments();
                setPayments(data.content ?? []);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
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
        {isAdmin && (
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                {/* Tipo */}
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel id="select-type-label">Tipo</InputLabel>
                    <Select
                        labelId="select-type-label"
                        id="select-type"
                        value={typeFilter}
                        label="Tipo"
                        onChange={(e: SelectChangeEvent) => setTypeFilter(e.target.value)}
                    >
                        <MenuItem value="">Todos</MenuItem>
                        <MenuItem value="CASH">Efectivo</MenuItem>
                        <MenuItem value="WIRE">Transferencia</MenuItem>
                    </Select>
                </FormControl>

                {/* Estado de aprobación */}
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel id="select-approved-label">Aprobado</InputLabel>
                    <Select
                        labelId="select-approved-label"
                        id="select-approved"
                        value={approvedFilter}
                        label="Aprobado"
                        onChange={(e: SelectChangeEvent) => setApprovedFilter(e.target.value)}
                    >
                        <MenuItem value="">Todos</MenuItem>
                        <MenuItem value="true">Sí</MenuItem>
                        <MenuItem value="false">No</MenuItem>
                    </Select>
                </FormControl>

                {/* Fechas */}
                <TextField
                    label="Desde"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <TextField
                    label="Hasta"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <Button variant="contained" size="small" onClick={fetchData}>
                    Filtrar
                </Button>
            </div>
        )}
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
                                                {payment.approved ? <>
                                                    <Link to={`/admin/dashboard/pagos/${payment.id}`}>
                                                        <Button size="small" startIcon={<Lightbulb />}>Detalles</Button>
                                                    </Link>
                                                </> :
                                                    <ButtonGroup variant="text" aria-label="Botones de Acción">
                                                        <Link to={`/admin/dashboard/pagos/${payment.id}`}>
                                                            <Button size="small" startIcon={<Lightbulb />}>
                                                                Detalles
                                                            </Button>
                                                        </Link>
                                                        <Button onClick={() => handleApproveClick(payment.id)} startIcon={<Done />} size="small">
                                                            Aprobar
                                                        </Button> 
                                                    </ButtonGroup>
                                                }
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