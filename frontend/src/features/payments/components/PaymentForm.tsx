import { useEffect, useState } from "react";
import { Alert, Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import { PAYMENT_TYPES } from "../../../utils/constants";
import type { ApartmentResponse, PaymentRequest } from "../../../types/api";
import { registerPayment } from "../api";
import type { dolarOficialResponse } from "../../../types/utils";
import { getMyApartments } from "../../apartments/api";
import { useNavigate } from "react-router";

const PaymentForm = () => {

    const [alert, setAlert] = useState<{msg: string, error: boolean} | null>(null);
    const [tasaBCV, setTasaBCV] = useState<dolarOficialResponse | null>(null);
    const [apartments, setApartments] = useState<ApartmentResponse[]>([]);
    const [amount, setAmount] = useState<number>(0);
    const [paymentType, setPaymentType] = useState<string>("");
    const [reference, setReference] = useState<string | null>(null);
    const [description, setDescription] = useState<string>("");
    const [apartmentId, setApartmentId] = useState<string | number>('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://ve.dolarapi.com/v1/dolares/oficial");
                const dolarResponse = await response.json()
                setTasaBCV(dolarResponse);
                const myApartments = await getMyApartments();
                setApartments(myApartments.content);
            } catch (error) {
                console.log(error);
            }
            
        }
        fetchData();
    }, [])

    const handleSubmit = async () => {

        if (apartmentId === null) {
            setAlert({msg: "Apartamento es obligatorio", error: true});
            return;
        }

        if (amount < 1) {
            setAlert({msg: "El monto debe ser de al menos 1", error: true});
            return;
        }

        if (!PAYMENT_TYPES.includes(paymentType)) {
            setAlert({msg: "Elija un método de pago válido", error: true});
            return;
        }

        if ((paymentType === "WIRE" && reference === null) || (paymentType === "WIRE" && reference === '')) {
            setAlert({msg: "Referencia obligatoria para pagos por transferencia", error: true});
            return;
        }

        if (description === null || description === "") {
            setAlert({msg: "La descripción es obligatoria", error: true});
            return;
        }

        
        const payment: PaymentRequest = {
            id: null,
            amount: paymentType === "WIRE" && tasaBCV !== null ? parseFloat((amount / tasaBCV.promedio).toFixed(2)) : amount,
            type: paymentType,
            reference,
            description,
            apartmentId: parseInt(apartmentId.toString())
        }      

        try {
            setLoading(true)
            await registerPayment(payment);
            setAlert({ msg: "Pago registrado con éxito", error: false });
            setTimeout(() => {
                navigate("/dashboard/pagos", { replace: true });
            }, 2000);
        } catch (error) {
            setAlert({msg: "Hubo un problema con la petición", error: true})
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    if (alert) {
        setTimeout(() => {
            setAlert(null)
        }, 3000);
    }

    return (
        <>
            {alert && (
                <Alert
                    severity={alert.error ? "error" : "success"}
                    sx={{ mb: 2, width: "100%" }}
                >
                    {alert.msg}
                </Alert>
            )}
            <Box sx={{display: 'flex', gap: 4}}>
                <FormControl fullWidth>
                    <InputLabel id="select-apartment-label">Apartamento</InputLabel>
                    <Select
                        labelId="select-apartment-label"
                        id="select-apartment"
                        label="Apartamento"
                        onChange={(e) => setApartmentId(e.target.value as unknown as number)}
                    >
                        {apartments.map(apt => {return <MenuItem value={apt.id}>{apt.code}</MenuItem>})}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel id="select-paymentType-label">Tipo de Pago</InputLabel>
                    <Select
                        labelId="select-paymentType-label"
                        id="select-paymentType"
                        value={paymentType}
                        label={"Tipo de Pago"}
                        onChange={(e) => setPaymentType(e.target.value as string)}
                    >
                        {PAYMENT_TYPES.map(paymentType => {return <MenuItem value={paymentType}>
                            {paymentType === "WIRE" ? "Transferencia (Bolívares)" : "Efectivo (Dólares)"}
                        </MenuItem>})}
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{display: "flex", gap: 4}}>
                <FormControl fullWidth>
                    <TextField
                        id="amount"
                        value={amount}
                        label="Monto"
                        onChange={(e) => setAmount(e.target.value as unknown as number)}
                    />
                    {paymentType === "WIRE" ? <>
                        {tasaBCV != null ? <p className="text-small text-gray-500 ml-1">Referencia en dólares: ${(amount / tasaBCV.promedio).toFixed(2)}</p> : <p className="text-small text-gray-500 ml-1">Cargando tasa...</p>}
                    </> : <></>}
                </FormControl>
                <FormControl fullWidth>
                    <TextField
                        id="reference"
                        value={paymentType === "WIRE" ? reference : null}
                        label="Referencia"
                        onChange={paymentType === "WIRE" ? (e) => setReference(e.target.value as string) : () => setReference(null)}
                    />
                </FormControl>
            </Box>
            <Box sx={{display: "flex"}}>
                <FormControl fullWidth>
                    <TextField
                        id="description"
                        value={description}
                        label="Descripción"
                        onChange={(e) => setDescription(e.target.value as string)}
                    />
                </FormControl>
            </Box>
            <Box sx={{display: "flex"}}>
                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? (
                        <CircularProgress size={20} color="inherit" />
                    ) : (
                        "Registrar pago"
                    )}
                </Button>
            </Box>
        </>
    );
}

export default PaymentForm;