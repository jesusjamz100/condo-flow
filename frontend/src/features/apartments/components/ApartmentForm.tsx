import { useEffect, useState } from "react";
import { Alert, Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
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
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (floor === null || tower === null || apartmentNumber === null) {
            setCode("")
            return;
        }
        setCode(`${tower}-${floor}-${apartmentNumber}`)
    }, [tower, floor, apartmentNumber])

    const handleSubmit = async () => {

        if (loading) return;

        // Validaciones
        if (tower === null || !TOWERS.includes(tower)) {
            setAlert({ msg: "Elija una torre válida", error: true });
            return;
        }
        if (floor === null || floor > 16 || floor < 1 || !Number.isInteger(floor)) {
            setAlert({ msg: "Seleccione un piso válido", error: true });
            return;
        }
        if (
            apartmentNumber === null ||
            apartmentNumber > 4 ||
            apartmentNumber < 1 ||
            !Number.isInteger(apartmentNumber)
        ) {
            setAlert({
                msg: "Seleccione un número de apartamento válido",
                error: true
            });
            return;
        }
        if (!code.trim()) {
            setAlert({ msg: "Código inválido", error: true });
            return;
        }
        if (sqm === null || sqm > 200 || sqm < 80 || Number.isNaN(sqm)) {
            setAlert({ msg: "Ingrese un valor de área válido", error: true });
            return;
        }
        if (aliquot === null || aliquot > 1 || aliquot < 0 || Number.isNaN(aliquot)) {
            setAlert({ msg: "Ingrese un valor de alícuota válido", error: true });
            return;
        }

        const apartment: ApartmentRequest = {
            id: null,
            code,
            tower,
            sqm,
            aliquot
        };

        try {
            setLoading(true);
            await createApartment(apartment);
            setAlert({ msg: "Apartamento registrado con éxito", error: false });
            setTimeout(() => {
                navigate("/admin/dashboard/apartamentos", { replace: true });
            }, 2000);
        } catch (error) {
            setAlert({msg: "Hubo un error con la operación", error: true});
        } finally {
            setLoading(false);
        }
    };

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

            {/* Primera fila */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 2,
                    mb: 2
                }}
            >
                <FormControl fullWidth>
                    <InputLabel id="tower-select-label">Torre</InputLabel>
                    <Select
                        labelId="tower-select-label"
                        value={tower ?? ""}
                        onChange={(e) =>
                            setTower(e.target.value as "A" | "B" | "C" | "D" | null)
                        }
                    >
                        <MenuItem value="" disabled>
                            Seleccionar Torre
                        </MenuItem>
                        {TOWERS.map((t) => (
                            <MenuItem key={t} value={t}>
                                {t}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel id="floor-select-label">Piso</InputLabel>
                    <Select
                        labelId="floor-select-label"
                        value={floor ?? ""}
                        onChange={(e) =>
                            setFloor(!e.target.value ? null : Number(e.target.value))
                        }
                    >
                        <MenuItem value="" disabled>
                            Seleccionar Piso
                        </MenuItem>
                        {[...Array(16)].map((_, i) => (
                            <MenuItem key={i + 1} value={i + 1}>
                                Piso {i + 1}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel id="apartment-number-select-label">
                        Número de Apartamento
                    </InputLabel>
                    <Select
                        labelId="apartment-number-select-label"
                        value={apartmentNumber ?? ""}
                        onChange={(e) =>
                            setApartmentNumber(
                                !e.target.value ? null : Number(e.target.value)
                            )
                        }
                    >
                        <MenuItem value="" disabled>
                            Seleccionar Número de Apartamento
                        </MenuItem>
                        {[...Array(4)].map((_, i) => (
                            <MenuItem key={i + 1} value={i + 1}>
                                Número {i + 1}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <TextField label="Código" value={code} disabled />
                </FormControl>
            </Box>

            {/* Segunda fila */}
            <Box
                sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
                mb: 2
                }}
            >
                <FormControl fullWidth>
                    <TextField
                        label="Área (m²)"
                        type="number"
                        value={sqm ?? ""}
                        onChange={(e) => setSqm(Number(e.target.value))}
                    />
                </FormControl>

                <FormControl fullWidth>
                    <TextField
                        label="Alícuota"
                        type="number"
                        value={aliquot ?? ""}
                        onChange={(e) => setAliquot(Number(e.target.value))}
                    />
                </FormControl>
            </Box>

            {/* Botón */}
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{ minWidth: { xs: "100%", sm: "100%", md: 140 }, height: 40 }}
                >
                    {loading ? (
                        <CircularProgress size={20} color="inherit" />
                    ) : (
                        "Registrar"
                    )}
                </Button>
            </Box>
        </>
    );
}

export default ApartmentForm;