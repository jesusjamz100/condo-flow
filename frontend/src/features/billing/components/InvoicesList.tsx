import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Autocomplete, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
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
            <div className="flex gap-2">
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

                <Button variant="contained" onClick={fetchData}>
                    Filtrar
                </Button>
            </div>
            { invoices.length > 0 ?
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth:650, textAlign:"center"}} aria-label="Apartamentos">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Subtotal</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {invoices.map(inv => {return (
                                <TableRow key={inv.id}>
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
            : <>No hay Facturas</>}
        </>
    )
}

export default InvoicesList;