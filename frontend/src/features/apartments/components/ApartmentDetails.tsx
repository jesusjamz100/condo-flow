import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Button, Card, CardContent, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import type { ResidentResponse, ApartmentResponse, PageResponse, PaymentResponse } from "../../../types/api";
import { getApartmentById, getApartmentResidents, getMyApartmentResidents, getOneOfMyApartments, removeResidentFromApartment } from "../api";
import Loading from "../../../components/Loading";
import { getAllPaymentsByApartmentId, getMyPaymentsByApartmentId } from "../../payments/api";
import formatDate from "../../../utils/formatDate";

interface ApartmentDetailsProps {
    apartmentId: number,
    isAdmin: boolean
}

const ApartmentDetails = ({apartmentId, isAdmin} : ApartmentDetailsProps) => {

    const [apartment, setApartment] = useState<ApartmentResponse | null>(null);
    const [residents, setResidents] = useState<ResidentResponse[]>([]);
    const [payments, setPayments] = useState<PaymentResponse[]>([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apartmentData = isAdmin ? await getApartmentById(apartmentId) : await getOneOfMyApartments(apartmentId);
                setApartment(apartmentData);
                const paymentsData: PageResponse<PaymentResponse> = isAdmin ? await getAllPaymentsByApartmentId(apartmentData.id) : await getMyPaymentsByApartmentId(apartmentData.id, 0, 5);
                setPayments(paymentsData.content);
                const residentData = isAdmin ? (await getApartmentResidents(apartmentId, 0, 100)).content : await getMyApartmentResidents(apartmentId);
                setResidents(residentData);
                setLoading(false);
            } catch (error) {
                console.log(error)
            }
        }

        fetchData();

    }, [isAdmin, apartmentId]);

    const handleClickRemoveResident = async (residentId: number) => {
        await removeResidentFromApartment(apartmentId, residentId)
        window.location.reload();
    }

    if (loading) {
        return <Loading text="Cargando Apartamento..." />
    }

    return (
        <>
            <div className="flex flex-col gap-5 w-full">
                <div className="flex">
                    <div className="w-full flex flex-col gap-4">
                        <p className="text-lg">
                            <span className="font-semibold">Torre: </span>
                            {apartment?.tower}
                        </p>
                        <p className="text-lg">
                            <span className="font-semibold">Código: </span>
                            {apartment?.code}
                        </p>
                        <p className="text-lg">
                            <span className="font-semibold">Balance: </span>
                            ${apartment?.balance}</p>
                        <p className="text-lg">
                            <span className="font-semibold">Área: </span>
                            {apartment?.sqm}m²
                        </p>
                    </div>
                    <div className="flex flex-col gap-4 w-full">
                        <div className="flex gap-2">
                            <p className="text-lg font-semibold">Residentes</p>
                            { isAdmin ? 
                                <Link to={`/admin/dashboard/apartamentos/${apartmentId}/residente/agregar`}>
                                    <Button variant="outlined" color="success" size="small"><Add /></Button>
                                </Link>
                            : <></> }
                        </div>
                        <div className="flex gap-2 justify-stretch">
                            {residents.length > 0 ? residents.map(r => {return (
                                <>
                                    <Card>
                                        <CardContent sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                                            <p>{r.firstName} {r.lastName}</p>
                                            { isAdmin ? 
                                                <div onClick={() => handleClickRemoveResident(r.id)}>
                                                    <Close sx={{ ":hover": { cursor: "pointer" } }} />
                                                </div>
                                            : <></> }
                                        </CardContent>
                                    </Card>
                                </>
                            )}) : <>No Hay Residentes en este apartamento</>}
                        </div>
                    </div>
                </div>
                <p className="text-2xl font-semibold mt-5 w-full text-center">Últimos Pagos</p>
                {payments.length > 0 ? (
                    
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth:650, textAlign:"center"}} aria-label="Apartamentos">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{fontWeight: "bold"}}>Fecha</TableCell>
                                <TableCell sx={{fontWeight: "bold"}}>Descripción</TableCell>
                                <TableCell sx={{fontWeight: "bold"}}>Monto</TableCell>
                                <TableCell sx={{fontWeight: "bold"}}>Aprobado</TableCell>
                                <TableCell sx={{fontWeight: "bold"}}>Tipo</TableCell>
                                <TableCell sx={{fontWeight: "bold"}}>Referencia</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {payments.map(payment => {return (
                                <TableRow key={payment.id}>
                                    <TableCell>{formatDate(payment.createdDate)}</TableCell>
                                    <TableCell>{payment.description}</TableCell>
                                    <TableCell>{payment.amount}</TableCell>
                                    <TableCell>{payment.approved ? "Sí" : "No"}</TableCell>
                                    <TableCell>{payment.type === "CASH" ? "Efectivo" : "Transferencia"}</TableCell>
                                    <TableCell>{payment.reference ? payment.reference : "N/A"}</TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                </TableContainer>
                ) : <>No hay pagos en este apartamento</>}
            </div>
        </>
    )
}

export default ApartmentDetails;