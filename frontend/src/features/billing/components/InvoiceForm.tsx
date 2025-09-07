import { useState } from "react";
import { useNavigate } from "react-router";
import { Alert, Box, Button, CircularProgress, TextField, Tooltip } from "@mui/material";
import { generateInvoices } from "../api";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es")

const InvoiceForm = () => {

    const [alert, setAlert] = useState<{ msg: string; error: boolean } | null>(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [waitingResponse, setWaitingResponse] = useState(false);

    const navigate = useNavigate();

    const isValidDate = (dateStr: string) => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateStr)) return false;
        const date = new Date(dateStr);
        return !isNaN(date.getTime()) && dateStr === date.toISOString().split("T")[0];
    }

    const isFirstDayOfMonth = (dateStr: string) => {
        const [year, month, day] = dateStr.split("-").map(Number);
        return day === 1;
    };

    const isLastDayOfMonth = (dateStr: string) => {
        const [year, month, day] = dateStr.split("-").map(Number);
        const lastDay = new Date(year, month, 0).getDate();
        return day === lastDay;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isValidDate(startDate) || !isValidDate(endDate)) {
            setAlert({ msg: "Formato de fecha inválido. Use YYYY-MM-DD.", error: true });
            return;
        }
        if (!isFirstDayOfMonth(startDate)) {
            setAlert({ msg: "La fecha de inicio debe ser el primer día del mes.", error: true });
            return;
        }
        if (!isLastDayOfMonth(endDate)) {
            setAlert({ msg: "La fecha de fin debe ser el último día del mes.", error: true });
            return;
        }

        try {
            setWaitingResponse(true);
            await generateInvoices(startDate, endDate);
            setAlert({ msg: "Facturas generadas correctamente. Redirigiendo...", error: false });
            setTimeout(() => {
                navigate("/admin/dashboard/facturas");
            }, 2000);
        } catch (error) {
            setAlert({ msg: "Hubo un error con la petición", error: true })
        } finally {
            setWaitingResponse(false);
        }
    }

    if (alert) {
        setTimeout(() => {
            setAlert(null)
        }, 3000);
    }

    return (
        <>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}>
                {alert && (
                    <Alert severity={alert.error ? "error" : "success"}>
                        {alert.msg}
                    </Alert>
                )}

                <Tooltip title="Debe ser el primer día del mes (YYYY-MM-DD)">
                    <TextField
                        label="Fecha de inicio"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        disabled={waitingResponse}
                        helperText={startDate ? dayjs(startDate).format("DD/MM/YYYY") : ""}
                    />
                </Tooltip>

                <Tooltip title="Debe ser el último día del mes (YYYY-MM-DD)">
                    <TextField
                        label="Fecha de fin"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        disabled={waitingResponse}
                        helperText={endDate ? dayjs(endDate).format("DD/MM/YYYY") : ""}
                    />
                </Tooltip>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={waitingResponse}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                    {waitingResponse && <CircularProgress size={20} color="inherit" />}
                    Generar facturas
                </Button>
            </Box>
        </>
    )
}

export default InvoiceForm;