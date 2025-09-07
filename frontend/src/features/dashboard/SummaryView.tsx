import { useState, useEffect } from "react";
import { Box, Card, Typography } from "@mui/material";
import type { ApartmentResponse } from "../../types/api";
import { getMyApartments } from "../apartments/api";
import { getAllMyPayments } from "../payments/api";
import { Home, AccountBalance, Warning, Payment } from "@mui/icons-material";

const SummaryView = () => {

    const [myApartments, setMyApartments] = useState<ApartmentResponse[]>([]);
    const [unapprovedPayments, setUnapprovedPayments] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apartmentData = await getMyApartments(0, 250);
                setMyApartments(apartmentData.content);

                const paymentsData = await getAllMyPayments(0, 5000);
                const paymentsFiltered = paymentsData.content.filter(p => p.approved).length;
                setUnapprovedPayments(paymentsFiltered);
            } catch (error) {
                console.log(error)
            }
        }
        fetchData();
    }, []);
    
    const totalApartments = myApartments?.length;
    const totalBalance: number = myApartments?.map(apt => apt.balance).reduce((acc, num) => acc + num, 0);

    return (
        <>
            <Box
                sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" },
                gap: 3,
                mb: 2,
                }}
            >
                <Card
                    sx={{
                        flex: 1,
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        boxShadow: 3,
                        borderRadius: 3,
                    }}
                >
                    <Home color="primary" sx={{ fontSize: 40 }} />
                    <div>
                        <Typography variant="body2" color="text.secondary">
                            Total de apartamentos
                        </Typography>
                        <Typography variant="h5">{totalApartments}</Typography>
                    </div>
                </Card>

                <Card
                    sx={{
                        flex: 1,
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        boxShadow: 3,
                        borderRadius: 3,
                    }}
                >
                    <Warning color="primary" sx={{ fontSize: 40 }} />
                    <div>
                        <Typography variant="body2" color="text.secondary">
                            Apartamentos con deuda
                        </Typography>
                        <Typography variant="h5" component="div" color="error">
                            {myApartments.filter((apt) => apt.balance < 0).length} / {totalApartments}
                        </Typography>
                    </div>
                </Card>

                <Card
                sx={{
                    flex: 1,
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    boxShadow: 3,
                    borderRadius: 3,
                }}
                >
                    <Payment color="primary" sx={{ fontSize: 40 }} />
                    <div>
                        <Typography variant="body2" color="text.secondary">
                            Pagos sin aprobar
                        </Typography>
                        <Typography variant="h5" component="div">
                            {unapprovedPayments}
                        </Typography>
                    </div>
                </Card>

                <Card
                    sx={{
                        flex: 1,
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        boxShadow: 3,
                        borderRadius: 3,
                    }}
                >
                    <AccountBalance color="primary" sx={{ fontSize: 40 }} />
                    <div>
                        <Typography variant="body2" color="text.secondary">
                            Balance total (USD)
                        </Typography>
                        <Typography
                            variant="h5"
                            component="div"
                            color={totalBalance < 0 ? "error" : "success"}
                        >
                            ${totalBalance.toFixed(2)}
                        </Typography>
                    </div>
                </Card>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                Últimos avisos
            </Typography>
            <Typography variant="body1" color="text.secondary">
                Sin avisos
            </Typography>
        </>
    );
};

export default SummaryView;