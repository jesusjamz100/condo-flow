import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Box, Button, ButtonGroup, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from "@mui/material";
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

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

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
        return <Loading text="Cargando Gastos..." />;
    }

    return (
        <>
            <Box 
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr", // móvil: uno debajo del otro
                        sm: "repeat(auto-fit, minmax(150px, 1fr))" // tablet/desktop: varias columnas
                    },
                    gap: 2,
                    alignItems: "center"
                }}
            >
                <TextField
                    fullWidth
                    label="Desde"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    fullWidth
                    label="Hasta"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    fullWidth
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
                <Button
                    variant="contained"
                    onClick={fetchData}
                    sx={{ height: "fit-content", width: "fit-content" }}
                >
                    Filtrar
                </Button>
            </Box>
            { expenses.length > 0 ?
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
                        <Table sx={{ minWidth: 650 }} aria-label="Gastos">
                            <TableHead sx={{ backgroundColor: "#f9fafb" }}>
                                <TableRow>
                                    {[
                                        "ID",
                                        "Fecha",
                                        "Descripción",
                                        "Facturado",
                                        "Monto",
                                        "Tipo",
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
                                {expenses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(e => {return (
                                    <TableRow
                                        key={e.id}
                                        hover
                                        sx={{
                                            "&:last-child td, &:last-child th": { border: 0 },
                                            transition: "background-color 0.2s ease",
                                            "&:hover": { backgroundColor: "#f3f4f6" }
                                        }}
                                    >
                                        <TableCell align="center">{e.id}</TableCell>
                                        <TableCell align="center">{formatDate(e.createdDate)}</TableCell>
                                        <TableCell align="center">{e.description}</TableCell>
                                        <TableCell align="center">{e.billed ? "Sí" : "No"}</TableCell>
                                        <TableCell align="center">${e.amount}</TableCell>
                                        <TableCell align="center">
                                            {e.scopeType === "SECTOR" ? "Sector" : e.scopeType === "TOWER" ? "Torre" : "General" }
                                        </TableCell>
                                        <TableCell align="center">
                                                {!e.billed ? <>
                                                    <ButtonGroup variant="text" aria-label="Botones de Acción">
                                                        <Link to={`/admin/dashboard/gastos/${e.id}`}>
                                                            <Button size="small" startIcon={<Lightbulb />}>Detalles</Button>
                                                        </Link>
                                                        <Button color="error" onClick={() => handleDeleteClick(e.id)} startIcon={<Delete />} size="small">Eliminar</Button>
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
                    <TablePagination
                        component="div"
                        count={expenses.length}
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
            : <>No hay Gastos</>}
        </>
    )
}

export default ExpensesList;