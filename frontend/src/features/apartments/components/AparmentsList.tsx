import { useEffect, useState } from "react";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, ButtonGroup, Paper, FormControl, InputLabel, MenuItem, Select, TablePagination } from "@mui/material";
import { Delete, Lightbulb } from "@mui/icons-material";
import type { ApartmentResponse } from "../../../types/api";
import { deleteApartmentById, getAllApartments, getMyApartments } from "../api";
import Loading from "../../../components/Loading";
import { Link } from "react-router";

interface ApartmentsListProps {
    isAdmin: boolean
}

const ApartmentsList = ({isAdmin}: ApartmentsListProps) => {

    const [apartments, setApartments] = useState<ApartmentResponse[]>([]);
    const [selectedTower, setSelectedTower] = useState<string | null>(null);
    const [balanceFilter, setBalanceFilter] = useState<"all" | "negative" | "positive">("all");
    const [floorFilter, setFloorFilter] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = isAdmin
                    ? await getAllApartments(0, 300, selectedTower ?? undefined)
                    : await getMyApartments();

                let filtered = data.content ?? [];

                if (balanceFilter === "negative") {
                    filtered = filtered.filter(a => a.balance < 0);
                } else if (balanceFilter === "positive") {
                    filtered = filtered.filter(a => a.balance >= 0);
                }

                if (floorFilter !== null) {
                        filtered = filtered.filter(a => {
                        const match = a.code.match(/-(\d+)-/);
                        const piso = match ? parseInt(match[1]) : null;
                        return piso === floorFilter;
                    });
                }

                setApartments(filtered);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [balanceFilter, floorFilter, isAdmin, selectedTower]);

    const handleDeleteClick = async (apartmentId: number) => {
        await deleteApartmentById(apartmentId);
        location.reload();
    }

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (loading) {
        return <Loading text="Cargando Apartamentos..." />;
    }

    return (
        <>
            {isAdmin ? 
                <>
                    <div className="flex flex-col lg:flex-row gap-4">
                        <FormControl className="flex-3">
                            <InputLabel id="floor-select-label">Filtrar por piso</InputLabel>
                            <Select
                                labelId="floor-select-label"
                                label= "Filtrar por piso"
                                value={floorFilter ?? ""}
                                onChange={(e) => {
                                    const value = e.target.value as unknown as string;
                                    setFloorFilter(value === "" ? null : Number(value));
                                }}
                            >
                                <MenuItem value="">Todos los pisos</MenuItem>
                                {[...Array(16)].map((_, i) => (
                                    <MenuItem key={i + 1} value={i + 1}>
                                        Piso {i + 1}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <ButtonGroup variant="outlined" size="small" className="flex-2">
                            <Button
                                variant={selectedTower === null ? "contained" : "outlined"}
                                onClick={() => setSelectedTower(null)}
                            >
                                Todas
                            </Button>
                            {["A", "B", "C", "D"].map(tower => (
                                <Button
                                    key={tower}
                                    variant={selectedTower === tower ? "contained" : "outlined"}
                                    onClick={() => setSelectedTower(tower)}
                                >
                                    Torre {tower}
                                </Button>
                            ))}
                        </ButtonGroup>

                        <ButtonGroup variant="outlined" size="small" className="flex-2">
                            <Button
                                variant={balanceFilter === "all" ? "contained" : "outlined"}
                                onClick={() => setBalanceFilter("all")}
                            >
                                Todos
                            </Button>
                            <Button
                                variant={balanceFilter === "negative" ? "contained" : "outlined"}
                                onClick={() => setBalanceFilter("negative")}
                            >
                                Balance Negativo
                            </Button>
                            <Button
                                variant={balanceFilter === "positive" ? "contained" : "outlined"}
                                onClick={() => setBalanceFilter("positive")}
                            >
                                Balance ≥ 0
                            </Button>
                        </ButtonGroup>
                    </div>
                </>  
            : <></>}

            { apartments.length > 0 ?
                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                    <TableContainer
                        component={Paper}
                        elevation={0}
                        sx={{
                            borderRadius: 2,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                            overflowX: "auto"
                        }}
                    >
                        <Table sx={{ minWidth: 650 }} aria-label="Apartamentos">
                            <TableHead sx={{ backgroundColor: "#f9fafb" }}>
                                <TableRow>
                                    {["ID", "Código", "Torre", "Balance", "Acciones"].map((head) => (
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
                            <TableBody sx={{ overflowX: "auto" }}>
                                {apartments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(apt => (
                                    <TableRow
                                        key={apt.id}
                                        hover
                                        sx={{
                                            "&:last-child td, &:last-child th": { border: 0 },
                                            transition: "background-color 0.2s ease",
                                            "&:hover": { backgroundColor: "#f3f4f6" }
                                        }}
                                    >
                                        <TableCell align="center">{apt.id}</TableCell>
                                        <TableCell align="center">{apt.code}</TableCell>
                                        <TableCell align="center">{apt.tower}</TableCell>
                                        <TableCell align="center"
                                            sx={{
                                                color: apt.balance < 0 ? "error.main" : "success.main",
                                                fontWeight: 500
                                            }}
                                        >${apt.balance.toFixed(2)}</TableCell>
                                        <TableCell align="center">
                                            {isAdmin ?(
                                                <ButtonGroup variant="text" aria-label="Botones de Acción">
                                                    <Link to={`/admin/dashboard/apartamentos/${apt.id}`}>
                                                        <Button size="small" startIcon={<Lightbulb />}>Detalles</Button>
                                                    </Link>
                                                    <Button
                                                        onClick={() => handleDeleteClick(apt.id)}
                                                        startIcon={<Delete />}
                                                        color="error"
                                                        size="small"
                                                    >
                                                        Eliminar
                                                    </Button>
                                                </ButtonGroup>
                                            ) : (
                                                <Link to={`/dashboard/apartamentos/${apt.id}`}>
                                                    <Button size="small" startIcon={<Lightbulb />}>
                                                        Detalles
                                                    </Button>
                                                </Link>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        count={apartments.length}
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
            : <>No hay Apartamentos</>}
        </>
    );
}

export default ApartmentsList;