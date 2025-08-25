import { Box, Card, CardContent, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { getAllApartments } from "../apartments/api";
import type { ApartmentResponse, PaymentResponse, ResidentResponse } from "../../types/api";
import { getAllResidents } from "../residents/api";
import { getAllPayments } from "../payments/api";
import MonthlyExpensesChart from "../expenses/components/MonthlyExpenseChart";

const AdminSummary = () => {

    const [apartments, setApartments] = useState<ApartmentResponse[]>([]);
    const [balance, setBalance] = useState<number>(0);
    const [residents, setResidents] = useState<ResidentResponse[]>([]);
    const [payments, setPayments] = useState<PaymentResponse[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apartmentData = await getAllApartments(0, 300);
                setApartments(apartmentData.content);
                const totalBalance = apartmentData.content.map(apt => apt.balance).reduce((acc, cur) => acc + cur, 0);
                setBalance(totalBalance);
                const residentData = await getAllResidents(0, 2000);
                setResidents(residentData.content);
                const paymentData = await getAllPayments(0, 10000);
                const paymentDataFiltered = paymentData.content.filter(payment => !payment.approved);
                setPayments(paymentDataFiltered);
            } catch (error) {
                console.log(error)
            }
        }
        fetchData();
    }, [])

    return (
        <>
            <Box sx={{
                display: "flex",
                gap: 4
            }}>
                <Card variant="outlined" sx={{width: "100%"}}>
                    <CardContent>
                        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                            Apartamentos Totales
                        </Typography>
                        <Typography variant="h5" component="div">
                            { apartments.length }
                        </Typography>
                    </CardContent>
                </Card>
                <Card variant="outlined" sx={{width: "100%"}}>
                    <CardContent>
                        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                            Residentes Totales
                        </Typography>
                        <Typography variant="h5" component="div">
                            { residents.length }
                        </Typography>
                    </CardContent>
                </Card>
                <Card variant="outlined" sx={{width: "100%"}}>
                    <CardContent>
                        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                            Pagos sin aprobar
                        </Typography>
                        <Typography variant="h5" component="div">
                            { payments.length }
                        </Typography>
                    </CardContent>
                </Card>
                <Card variant="outlined" sx={{width: "100%"}}>
                    <CardContent>
                        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                            Balance Total de Apartamentos
                        </Typography>
                        <Typography variant="h5" component="div" color={balance < 0 ? "error" : "success"}>
                            ${ balance }
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
            <Box sx={{
                display: "flex",
                gap: 4
            }}>
                <Card variant="outlined" sx={{width: "100%"}}>
                    <CardContent>
                        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                            Evolución de gastos { dayjs().year() }
                        </Typography>
                        <MonthlyExpensesChart />
                    </CardContent>
                </Card>
                <Card variant="outlined" sx={{ width: "50%" }}>

                </Card>
            </Box>
        </>
    );
}

export default AdminSummary;