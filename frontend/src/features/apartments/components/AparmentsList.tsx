import { useEffect, useState } from "react";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, ButtonGroup, Paper, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = isAdmin ? await getAllApartments(0, 300, selectedTower ?? undefined) : await getMyApartments();

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

    if (loading) {
        return <Loading text="Cargando Apartamentos..." />;
    }

    return (
        <>
            {isAdmin ? 
                <>
                    <div className="flex gap-5">
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="floor-select-label">Filtrar por piso</InputLabel>
                            <Select
                                labelId="floor-select-label"
                                value={floorFilter ?? ""}
                                label="Filtrar por piso"
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

                        <ButtonGroup fullWidth sx={{ mb: 2 }} size="small">
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

                        <ButtonGroup fullWidth sx={{ mb: 2 }} size="small">
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
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth:650, textAlign:"center"}} aria-label="Apartamentos">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Código</TableCell>
                                <TableCell>Torre</TableCell>
                                <TableCell>Balance</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {apartments.map(apt => {return (
                                <TableRow key={apt.id}>
                                    <TableCell>{apt.id}</TableCell>
                                    <TableCell>{apt.code}</TableCell>
                                    <TableCell>{apt.tower}</TableCell>
                                    <TableCell>${apt.balance}</TableCell>
                                    <TableCell>
                                        {isAdmin ?
                                        <>
                                            <ButtonGroup variant="text" aria-label="Botones de Acción">
                                                <Link to={`/admin/dashboard/apartamentos/${apt.id}`}>
                                                    <Button size="small" startIcon={<Lightbulb />}>Detalles</Button>
                                                </Link>
                                                <Button onClick={() => handleDeleteClick(apt.id)} startIcon={<Delete />} size="small">Eliminar</Button>
                                            </ButtonGroup>
                                        </> : <>
                                            <Link to={`/dashboard/apartamentos/${apt.id}`}>
                                                <Button variant="outlined" size="small" startIcon={<Lightbulb />}>Detalles</Button>
                                            </Link>
                                        </>}
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                </TableContainer>
            : <>No hay Apartamentos</>}
        </>
    );
}

export default ApartmentsList;