import { useEffect, useState } from "react";
import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import { TOWERS } from "../../../utils/constants";
import { useNavigate } from "react-router";
import type { ApartmentRequest } from "../../../types/api";
import { createApartment } from "../api";

const ApartmentForm = () => {

    const [alert, setAlert] = useState<{msg: string, error: boolean} | null>(null);
    const [floor, setFloor] = useState<number | null>(null);
    const [apartmentNumber, setApartmentNumber] = useState<number | null>(null);
    const [tower, setTower] = useState<"A" | "B" | "C" | "D" | null>(null);
    const [code, setCode] = useState<string>("");
    const [sqm, setSqm] = useState<number | null>(null);
    const [aliquot, setAliquot] = useState<number | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (floor === null || tower === null || apartmentNumber === null) {
            setCode("")
            return;
        }
        setCode(`${tower}-${floor}-${apartmentNumber}`)
    }, [tower, floor, apartmentNumber])

    const handleSubmit = async () => {

        if (tower === null || !TOWERS.includes(tower)) {
            setAlert({msg: "Elija una torre válida", error: true});
            return;
        }

        if (floor === null || floor > 16 || floor < 1 || !Number.isInteger(floor)) {
            setAlert({msg: "Seleccione un piso válido", error: true});
            return;
        }

        if (apartmentNumber === null || apartmentNumber > 4 || apartmentNumber < 1 || !Number.isInteger(apartmentNumber)) {
            setAlert({msg: "Seleccione un número de apartamento válido", error: true});
            return;
        }

        if (code === null || code === "" || code === " ") {
            setAlert({msg: "Código Inválido", error: true});
            return;
        }

        if (sqm === null || sqm > 200 || sqm < 80 || Number.isNaN(sqm)) {
            setAlert({msg: "Ingrese un valor de área válido", error: true});
            return;
        }

        if (aliquot === null || aliquot > 1 || aliquot < 0 || Number.isNaN(aliquot)) {
            setAlert({msg: "Ingrese un valor de alicuota válido", error: true});
            return;
        }

        const apartment: ApartmentRequest = {
            id: null,
            code: code,
            tower: tower,
            sqm: sqm,
            aliquot: aliquot
        }     

        try {
            await createApartment(apartment);
            navigate("/admin/dashboard/apartamentos", { replace: true });
        } catch (error) {
            setAlert({msg: "Hubo un error con la operación", error: true});
            return;
        }
    }

    const msg = alert?.msg;

    if (alert) {
        setTimeout(() => {
            setAlert(null)
        }, 3000);
    }

    return (
        <>
            {msg && <Alert severity="error">{msg}</Alert>}
            <Box sx={{display: 'flex', gap: 4}}>
                <FormControl fullWidth>
                    <InputLabel id="tower-select-label">Torre</InputLabel>
                    <Select
                        labelId="tower-select-label"
                        value={tower ?? ""}
                        label="Torre"
                        onChange={(e) => {
                            const value: "A" | "B" | "C" | "D" | null = e.target.value;
                            setTower(value);
                        }}
                    >
                        <MenuItem value="" disabled>Seleccionar Torre</MenuItem>
                        {TOWERS.map(t => (
                            <MenuItem key={t} value={t}>
                                { t }
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel id="floor-select-label">Piso</InputLabel>
                    <Select
                        labelId="floor-select-label"
                        value={floor ?? ""}
                        label="Piso"
                        onChange={(e) => {
                            const value = e.target.value as unknown as string;
                            setFloor(value === "" ? null : Number(value));
                        }}
                    >
                        <MenuItem value="" disabled>Seleccionar Piso</MenuItem>
                        {[...Array(16)].map((_, i) => (
                            <MenuItem key={i + 1} value={i + 1}>
                                Piso {i + 1}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel id="apartment-number-select-label">Número de Apartamento</InputLabel>
                    <Select
                        labelId="apartment-number-select-label"
                        value={apartmentNumber ?? ""}
                        label="Número de Apartamento"
                        onChange={(e) => {
                            const value = e.target.value as unknown as string;
                            setApartmentNumber(value === "" ? null : Number(value));
                        }}
                    >
                        <MenuItem value="" disabled>Seleccionar Número de Apartamento</MenuItem>
                        {[...Array(4)].map((_, i) => (
                            <MenuItem key={i + 1} value={i + 1}>
                                Piso {i + 1}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <TextField
                        id=""
                        value={code}
                        label="Código"
                        onChange={(e) => setSqm(e.target.value as unknown as number)}
                        disabled
                    />
                </FormControl>
            </Box>
            <Box sx={{display: "flex", gap: 4}}>
                <FormControl fullWidth>
                    <TextField
                        id="sqm"
                        value={sqm}
                        label="Área (m²)"
                        onChange={(e) => setSqm(e.target.value as unknown as number)}
                    />
                </FormControl>
                <FormControl fullWidth>
                    <TextField
                        id="sqm"
                        value={aliquot}
                        label="Alicuota"
                        onChange={(e) => setAliquot(e.target.value as unknown as number)}
                    />
                </FormControl>
            </Box>
            <Box sx={{display: "flex"}}>
                <Button variant="outlined" color="primary" onClick={handleSubmit}>Registrar</Button>
                {}
            </Box>
        </>
    );
}

export default ApartmentForm;