import { useEffect, useState } from "react";
import { Button, ButtonGroup, FormControl, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, type SelectChangeEvent } from "@mui/material";
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

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

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

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (loading) {
        return <Loading text="Cargando Pagos..." />;
    }

    return (
        <>
        {isAdmin && (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    marginBottom: "1rem"
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "1rem"
                    }}
                >
                    {/* Tipo */}
                    <FormControl sx={{ minWidth: 150, flex: 1 }}>
                        <InputLabel id="select-type-label">Tipo</InputLabel>
                        <Select
                            labelId="select-type-label"
                            label="Tipo"
                            value={typeFilter}
                            onChange={(e: SelectChangeEvent) =>
                                setTypeFilter(e.target.value)
                            }
                        >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="CASH">Efectivo</MenuItem>
                            <MenuItem value="WIRE">Transferencia</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Estado de aprobación */}
                    <FormControl sx={{ minWidth: 150, flex: 1 }}>
                        <InputLabel id="select-approved-label">Aprobado</InputLabel>
                        <Select
                            labelId="select-approved-label"
                            label="Aprobado"
                            value={approvedFilter}
                            onChange={(e: SelectChangeEvent) =>
                                setApprovedFilter(e.target.value)
                            }
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
                        sx={{ flex: 1, minWidth: 150 }}
                        lang="es"
                    />
                    <TextField
                        label="Hasta"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        sx={{ flex: 1, minWidth: 150 }}
                        lang="es"
                    />

                    <Button
                        variant="contained"
                        onClick={fetchData}
                        sx={{ height: 40, alignSelf: "center" }}
                    >
                        Filtrar
                    </Button>
                </div>
            </div>
        )}
            {payments.length < 1 ? (<p>No hay Pagos</p>) : (
                <Paper
                    sx={{
                        width: "100%",
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                    }}
                >
                    <TableContainer
                        component={Paper}
                        elevation={0}
                        sx={{
                            borderRadius: 2,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                            overflowX: "auto"
                        }}
                    >
                        <Table sx={{ minWidth: 650 }} aria-label="Pagos">
                            <TableHead sx={{ backgroundColor: "#f9fafb" }}>
                                <TableRow>
                                    {[
                                        "ID",
                                        "Fecha",
                                        "Descripción",
                                        "Monto",
                                        "Aprobado",
                                        "Tipo",
                                        "Referencia",
                                        "Acciones"
                                    ].map((head) => (
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
                                {payments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(payment => {return (
                                    <TableRow 
                                        key={payment.id}
                                        hover
                                        sx={{
                                            "&:last-child td, &:last-child th": { border: 0 },
                                            transition: "background-color 0.2s ease",
                                            "&:hover": { backgroundColor: "#f3f4f6" }
                                        }}
                                    >
                                        <TableCell align="center">{payment.id}</TableCell>
                                        <TableCell align="center">{formatDate(payment.createdDate)}</TableCell>
                                        <TableCell align="center">{payment.description}</TableCell>
                                        <TableCell align="center">{payment.amount}</TableCell>
                                        <TableCell align="center">{payment.approved ? "Sí" : "No"}</TableCell>
                                        <TableCell align="center">{payment.type === "CASH" ? "Efectivo" : "Transferencia"}</TableCell>
                                        <TableCell align="center">{payment.reference ? payment.reference : "N/A"}</TableCell>
                                        <TableCell align="center">
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
                                                            <Button color="success" onClick={() => handleApproveClick(payment.id)} startIcon={<Done />} size="small">
                                                                Aprobar
                                                            </Button> 
                                                        </ButtonGroup>
                                                    }
                                                </> : <>
                                                    <Link to={`/dashboard/pagos/${payment.id}`}>
                                                        <Button size="small" startIcon={<Lightbulb />}>Detalles</Button>
                                                    </Link>
                                                </>}
                                        </TableCell>
                                    </TableRow>
                                )})}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        count={payments.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Filas por página"
                        labelDisplayedRows={({ from, to, count }) =>
                            `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`
                        }
                    />
                </Paper>
            )}
        </>
    );
}

export default PaymentsList;