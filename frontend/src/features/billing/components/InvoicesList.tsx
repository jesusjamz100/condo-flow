import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Autocomplete, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from "@mui/material";
import { Lightbulb } from "@mui/icons-material"
import { getAllInvoices, getAllMyInvoices } from "../api";
import type { ApartmentResponse, InvoiceResponse } from "../../../types/api";
import Loading from "../../../components/Loading";
import formatDate from "../../../utils/formatDate";
import { getAllApartments, getMyApartments } from "../../apartments/api";

const InvoicesList = ({ isAdmin }: { isAdmin: boolean }) => {

    const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
    const [apartments, setApartments] = useState<ApartmentResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [apartmentId, setApartmentId] = useState("");

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const fetchData = async () => {
        const dataInvoices = isAdmin
            ? await getAllInvoices(
                apartmentId ? Number(apartmentId) : undefined,
                startDate || undefined,
                endDate || undefined
            )
            : await getAllMyInvoices(
                apartmentId ? Number(apartmentId) : undefined,
                startDate || undefined,
                endDate || undefined
            );

        setInvoices(dataInvoices);

        const dataApartments = isAdmin
            ? await getAllApartments(0, 250)
            : await getMyApartments(0, 250);

        setApartments(dataApartments.content);
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, [isAdmin])

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const normalize = (str: string) =>
        str
            .normalize("NFD") // separa acentos
            .replace(/[\u0300-\u036f]/g, "") // elimina acentos
            .toLowerCase();

    if (loading) {
        return <Loading text="Cargando Facturas..." />
    }

    return (
        <>
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
                    <Autocomplete
                        options={[{ id: "", code: "Todos" }, ...apartments]}
                        getOptionLabel={(option) =>
                            option.code || (option.id ? `Apartamento ${option.id}` : "Todos")
                        }
                        value={
                            apartmentId === ""
                            ? { id: "", code: "Todos" }
                            : apartments.find((apt) => apt.id === Number(apartmentId)) || null
                        }
                        onChange={(_, newValue) => {
                            setApartmentId(newValue?.id?.toString() || "");
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Apartamento" sx={{ minWidth: 250 }} />
                        )}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        filterOptions={(options, { inputValue }) => {
                            const search = normalize(inputValue);
                            return options.filter((opt) =>
                            normalize(opt.code || `Apartamento ${opt.id}`).includes(search)
                            );
                        }}
                    />

                    <TextField
                        label="Desde"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Hasta"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />

                    <Button variant="contained" onClick={fetchData} sx={{ height: 40, alignSelf: "center" }}>
                        Filtrar
                    </Button>
                </div>
            </div>
            { invoices.length > 0 ?
            
                <Paper
                    sx={{
                        width: "100%",
                        overflow: "hidden",
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
                            overflow: "hidden"
                        }}
                    >
                        <Table sx={{ minWidth: 650 }} aria-label="Facturas">
                            <TableHead sx={{ backgroundColor: "#f9fafb" }}>
                                <TableRow>
                                    {[
                                        "ID",
                                        "Fecha",
                                        "Subtotal",
                                        "Total",
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
                                {invoices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(inv => {return (
                                    <TableRow
                                        key={inv.id}
                                        hover
                                        sx={{
                                            "&:last-child td, &:last-child th": { border: 0 },
                                            transition: "background-color 0.2s ease",
                                            "&:hover": { backgroundColor: "#f3f4f6" }
                                        }}
                                    >
                                        <TableCell>{inv.id}</TableCell>
                                        <TableCell>{ formatDate(inv.createdDate) }</TableCell>
                                        <TableCell>${ inv.amount }</TableCell>
                                        <TableCell>${ inv.finalAmount }</TableCell>
                                        <TableCell>
                                            <Link to={isAdmin ? `/admin/dashboard/facturas/${inv.id}` : `/dashboard/facturas/${inv.id}`}>
                                                <Button variant="outlined" size="small" startIcon={<Lightbulb />}>Detalles</Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                )})}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        count={invoices.length}
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
            : <>No hay Facturas</>}
        </>
    )
}

export default InvoicesList;