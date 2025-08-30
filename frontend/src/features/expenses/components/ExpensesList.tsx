import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Box, Button, ButtonGroup, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { Lightbulb, Delete } from "@mui/icons-material";
import { deleteExpenseById, getAllExpenses } from "../api";
import Loading from "../../../components/Loading";
import type { ExpenseResponse } from "../../../types/api";
import formatDate from "../../../utils/formatDate";

const ExpensesList = () => {

    const [expenses, setExpenses] = useState<ExpenseResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [billed, setBilled] = useState<string>("");

    const fetchData = async () => {
        const data = await getAllExpenses(
                0,
                200000,
                startDate || undefined,
                endDate || undefined,
                billed !== "" ? billed === "true" : undefined
        );
        setExpenses(data.content);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteClick = async (expenseId: number) => {
            await deleteExpenseById(expenseId);
            location.reload();
        }

    if (loading) {
        return <Loading text="Cargando Gastos..." />;
    }

    return (
        <>
            <Box sx={{ display: "flex", gap: 2 }}>
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
                <TextField
                    select
                    label="Facturado"
                    value={billed}
                    onChange={(e) => setBilled(e.target.value)}
                    sx={{ minWidth: 150 }}
                >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="true">Sí</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                </TextField>
                <Button variant="contained" size="small" onClick={fetchData}>
                    Filtrar
                </Button>
            </Box>
            { expenses.length > 0 ?
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth:650, textAlign:"center"}} aria-label="Apartamentos">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Descripción</TableCell>
                                <TableCell>Facturada</TableCell>
                                <TableCell>Monto</TableCell>
                                <TableCell>Tipo</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {expenses.map(e => {return (
                                <TableRow key={e.id}>
                                    <TableCell>{e.id}</TableCell>
                                    <TableCell>{formatDate(e.createdDate)}</TableCell>
                                    <TableCell>{e.description}</TableCell>
                                    <TableCell>{e.billed ? "Sí" : "No"}</TableCell>
                                    <TableCell>${e.amount}</TableCell>
                                    <TableCell>
                                        {e.scopeType === "SECTOR" ? "Sector" : e.scopeType === "TOWER" ? "Torre" : "General" }
                                    </TableCell>
                                    <TableCell>
                                            {!e.billed ? <>
                                                <ButtonGroup variant="text" aria-label="Botones de Acción">
                                                    <Link to={`/admin/dashboard/gastos/${e.id}`}>
                                                        <Button size="small" startIcon={<Lightbulb />}>Detalles</Button>
                                                    </Link>
                                                    <Button onClick={() => handleDeleteClick(e.id)} startIcon={<Delete />} size="small">Eliminar</Button>
                                                </ButtonGroup>
                                            </> : <>
                                                <Link to={`/admin/dashboard/gastos/${e.id}`}>
                                                    <Button size="small" startIcon={<Lightbulb />}>Detalles</Button>
                                                </Link>
                                            </>}
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                </TableContainer>
            : <>No hay Gastos</>}
        </>
    )
}

export default ExpensesList;