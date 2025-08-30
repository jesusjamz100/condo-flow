import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Alert, Autocomplete, Box, Button, FormControl, TextField } from "@mui/material";
import type { ResidentResponse } from "../../../types/api";
import { getAllResidents } from "../../residents/api";
import { addResidentToApartment } from "../api";


const AddResidentToApartmentForm = ({ apartmentId }: {apartmentId: number}) => {

    const [alert, setAlert] = useState<{ msg: string, error: boolean } | null>(null);
    const [residents, setResidents] = useState<ResidentResponse[]>([]);
    const [residentId, setResidentId] = useState<number | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllResidents(0, 20000);
            setResidents(data.content)
        }
        fetchData();
    }, [])

    const handleClick = async () => {

        if (residentId === null) {
            setAlert({ msg: "Escoja un residente válido", error: true })
            return;
        }

        try {
            await addResidentToApartment(apartmentId, residentId);
            navigate(`/admin/dashboard/apartamentos/${apartmentId}`, { replace: true });
        } catch (error) {
            setAlert({ msg: "Hubo un error con la petición", error: true })
            return;
        }
    }

    const normalize = (str: string) =>
        str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

    const msg = alert?.msg;

    if (alert) {
        setTimeout(() => {
            setAlert(null);
        }, 3000);
    }

    return (
        <>
            {msg && <Alert severity="error">{msg}</Alert>}
            <Box sx={{ display: "flex", gap: "1rem" }}>
                <FormControl sx={{ width: "40%" }}>
                    <Autocomplete
                        options={residents}
                        getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                        value={residents.find((r) => r.id === residentId) || null}
                        onChange={(_, newValue) => {
                            setResidentId(newValue?.id ?? "");
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Residente" sx={{ minWidth: 250 }} />
                        )}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        filterOptions={(options, { inputValue }) => {
                            const search = normalize(inputValue);
                            return options.filter((opt) =>
                            normalize(`${opt.firstName} ${opt.lastName}`).includes(search)
                            );
                        }}
                    />
                </FormControl>
                <Button onClick={handleClick} variant="outlined">Agregar</Button>
            </Box>
        </>
    )
}

export default AddResidentToApartmentForm;