import { useEffect, useState } from "react";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, ButtonGroup, Paper } from "@mui/material";
import { Delete, Lightbulb, ModeEdit } from "@mui/icons-material";
import type { ApartmentResponse } from "../../../types/api";
import { deleteApartmentById, getAllApartments, getMyApartments } from "../api";
import Loading from "../../../components/Loading";
import { Link } from "react-router";

interface ApartmentsListProps {
    isAdmin: boolean
}

const ApartmentsList = ({isAdmin}: ApartmentsListProps) => {

    const [apartments, setApartments] = useState<ApartmentResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = isAdmin ? await getAllApartments() : await getMyApartments();
                setApartments(data.content ?? []);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [isAdmin]);

    const handleDeleteClick = async (apartmentId: number) => {
        await deleteApartmentById(apartmentId);
        location.reload();
    }

    if (loading) {
        return <Loading text="Cargando Apartamentos..." />;
    }

    return (
        <>
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
                                <TableCell>{apt.balance}</TableCell>
                                <TableCell>
                                    {isAdmin ?
                                    <>
                                        <ButtonGroup variant="text" aria-label="Botones de Acción">
                                            <Link to={`/admin/dashboard/apartamentos/${apt.id}`}>
                                                <Button size="small" startIcon={<Lightbulb />}>Detalles</Button>
                                            </Link>
                                            <Link to={`/admin/dashboard/apartamentos/${apt.id}/editar`}>
                                                <Button size="small" startIcon={<ModeEdit />}>Editar</Button>
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
        </>
    );
}

export default ApartmentsList;