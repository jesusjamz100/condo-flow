import { Box, Card, Typography } from "@mui/material";
import { Home, People, Payment, AccountBalance } from "@mui/icons-material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { getAllApartments } from "../apartments/api";
import type { ApartmentResponse, PaymentResponse, ResidentResponse } from "../../types/api";
import { getAllResidents } from "../residents/api";
import { getAllPayments } from "../payments/api";
import MonthlyExpensesChart from "../expenses/components/MonthlyExpenseChart";
import ApartmentsBalancePie from "../apartments/components/ApartmentsBalancePie";

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
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" },
                gap: 3,
                mb: 1
            }}>
                <Card sx={{ flex: 1, p: 2, display: "flex", alignItems: "center", gap: 2, boxShadow: 3, borderRadius: 3 }}>
                    <Home color="primary" sx={{ fontSize: 40 }} />
                    <div>
                        <Typography variant="body2" color="text.secondary">
                            Apartamentos Totales
                        </Typography>
                        <Typography variant="h5">{apartments.length}</Typography>
                    </div>
                </Card>
                <Card sx={{flex: 1, p: 2, display: "flex", alignItems: "center", gap: 2, boxShadow: 3, borderRadius: 3}}>
                    <People color="primary" sx={{ fontSize: 40 }} />
                    <div>
                        <Typography variant="body2" color="text.secondary">
                            Residentes Totales
                        </Typography>
                        <Typography variant="h5" component="div">
                            { residents.length }
                        </Typography>
                    </div>
                </Card>
                <Card sx={{flex: 1, p: 2, display: "flex", alignItems: "center", gap: 2, boxShadow: 3, borderRadius: 3}}>
                    <Payment color="primary" sx={{ fontSize: 40 }} />
                    <div>
                        <Typography variant="body2" color="text.secondary">
                            Pagos sin aprobar
                        </Typography>
                        <Typography variant="h5" component="div">
                            { payments.length }
                        </Typography>
                    </div>
                </Card>
                <Card sx={{flex: 1, p: 2, display: "flex", alignItems: "center", gap: 2, boxShadow: 3, borderRadius: 3}}>
                    <AccountBalance color="primary" sx={{ fontSize: 40 }} />
                    <div>
                        <Typography variant="body2" color="text.secondary">
                            Balance Total
                        </Typography>
                        <Typography variant="h5" component="div" color={balance < 0 ? "error" : "success"}>
                            ${ balance.toFixed(2) }
                        </Typography>
                    </div>
                </Card>
            </Box>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
                    gap: 4,
                    mt: 1
                }}
            >
                <Card
                    sx={{
                        p: 3,
                        boxShadow: 3,
                        borderRadius: 3,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary" }}>
                        Evolución de gastos {dayjs().year()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Seguimiento mensual de los gastos del condominio
                    </Typography>
                    <MonthlyExpensesChart />
                </Card>

                <Card
                    sx={{
                        p: 3,
                        boxShadow: 3,
                        borderRadius: 3,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary" }}>
                        Apartamentos morosos vs al día
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Distribución actual de pagos
                    </Typography>
                    <ApartmentsBalancePie />
                </Card>
            </Box>
        </>
    );
}

export default AdminSummary;