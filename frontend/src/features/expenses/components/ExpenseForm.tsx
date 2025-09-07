import { useState } from "react";
import { Alert, Box, Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { SCOPE_TYPES, TOWERS } from "../../../utils/constants";
import { useNavigate } from "react-router";
import { createExpense } from "../api";
import type { ExpenseRequest } from "../../../types/api";

const sectorOptions = [
  { label: "Sector A-B", towers: ["A", "B"] },
  { label: "Sector C-D", towers: ["C", "D"] },
];

const ExpenseForm = () => {

    const [alert, setAlert] = useState<{ msg: string, error: boolean } | null>(null);
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState<number | null>(null);
    const [scopeType, setScopeType] = useState<"TOWER" | "SECTOR" | "GENERAL" | "">("");
    const [applicableTowers, setApplicableTowers] = useState<Set<string>>(new Set([]));
    const [selectedSector, setSelectedSector] = useState("");
    const [selectedTower, setSelectedTower] = useState("");

    const navigate = useNavigate();

    const handleTowerChange = (value: string) => {
        if (scopeType === "SECTOR") {
            setSelectedSector(value);
            const sector = sectorOptions.find(s => s.label === value);
            setApplicableTowers(new Set(sector?.towers || []));
        } else if (scopeType === "TOWER") {
            setSelectedTower(value);
            setApplicableTowers(new Set([value]));
        }
    };

    const handleSubmit = async () => {
        if (!description.trim()) {
            setAlert({msg: "La descripción es obligatoria", error: true});
            return;
        }

        if (amount === null || Number.isNaN(amount)) {
            setAlert({msg: "El monto no es válido", error: true});
            return;
        }

        if (scopeType === null || !SCOPE_TYPES.includes(scopeType)) {
            setAlert({msg: "El tipo de gasto es obligatorio", error: true});
            return;
        }

        if ((scopeType === "SECTOR" || scopeType === "TOWER") && applicableTowers.size < 1) {
            setAlert({msg: "Tiene que elegir torres aplicables", error: true});
            return;
        }

        const expense: ExpenseRequest = {
            id: null,
            description,
            amount,
            scopeType: scopeType as "TOWER" | "SECTOR" | "GENERAL",
            applicableTowers: Array.from(applicableTowers)
        };

        try {
            await createExpense(expense);
            navigate("/admin/dashboard/gastos", { replace: true });
        } catch (error) {
            setAlert({msg: "Hubo un problema con la petición", error: true})
            console.log(error);
            
        }
    }

    const msg = alert?.msg;

    if (alert) {
        setTimeout(() => {
            setAlert(null);
        }, 3000);
    }

    return (
        <>
            <Box sx={{ maxWidth: 500 }}>
                {msg && <Alert severity="error">{msg}</Alert>}
                <TextField
                    label="Descripción"
                    fullWidth
                    margin="normal"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <TextField
                    label="Monto"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={amount ?? ""}
                    onChange={(e) => setAmount(Number(e.target.value))}
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel>Tipo de gasto</InputLabel>
                    <Select
                        value={scopeType}
                        onChange={(e) => {
                            setScopeType(e.target.value as any);
                            setApplicableTowers(new Set([]));
                            setSelectedSector("");
                            setSelectedTower("");
                        }}
                        label="Tipo de gasto"
                    >
                        {SCOPE_TYPES.map((st) => (
                            <MenuItem key={st} value={st}>{st === "SECTOR" ? "Sector" : st === "TOWER" ? "Torre" : "General" }</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {scopeType === "SECTOR" && (
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="sector-select-label">Sector</InputLabel>
                        <Select
                            labelId="sector-select-label"
                            label="Sector"
                            value={selectedSector}
                            onChange={(e) => handleTowerChange(e.target.value)}
                        >
                            {sectorOptions.map((opt) => (
                                <MenuItem key={opt.label} value={opt.label}>{opt.label}</MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>Selecciona un sector</FormHelperText>
                    </FormControl>
                )}

                {scopeType === "TOWER" && (
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="tower-select-label">Torre</InputLabel>
                        <Select
                            labelId="tower-select-label"
                            label="Torre"
                            value={selectedTower}
                            onChange={(e) => handleTowerChange(e.target.value)}
                        >
                            {TOWERS.map((tower) => (
                                <MenuItem key={tower} value={tower}>{tower}</MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>Selecciona una torre</FormHelperText>
                    </FormControl>
                )}

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={handleSubmit}
                >
                    Guardar gasto
                </Button>
            </Box>
        </>
    )
}

export default ExpenseForm;