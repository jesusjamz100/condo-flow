import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Alert, Autocomplete, Box, Button, CircularProgress, FormControl, TextField } from "@mui/material";
import type { ResidentResponse } from "../../../types/api";
import { getAllResidents } from "../../residents/api";
import { addResidentToApartment } from "../api";


const AddResidentToApartmentForm = ({ apartmentId }: {apartmentId: number}) => {

    const [alert, setAlert] = useState<{ msg: string, error: boolean } | null>(null);
    const [residents, setResidents] = useState<ResidentResponse[]>([]);
    const [residentId, setResidentId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

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
            setLoading(true);
            await addResidentToApartment(apartmentId, residentId);
            setAlert({ msg: "Residente agregado correctamente", error: false });
            
            setTimeout(() => {
                navigate(`/admin/dashboard/apartamentos/${apartmentId}`, { replace: true });
            }, 2000);
        } catch (error) {
            setAlert({ msg: "Hubo un error con la petición", error: true });
        } finally {
            setLoading(false);
        }
    }

    const normalize = (str: string) =>
        str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

    if (alert) {
        setTimeout(() => {
            setAlert(null);
        }, 3000);
    }

    return (
        <>
            {alert && (
                <Alert
                    severity={alert.error ? "error" : "success"}
                    sx={{ width: "100%" }}
                >
                    {alert.msg}
                </Alert>
            )}       
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                    alignItems: { xs: "stretch", sm: "center" },
                    width: "100%"
                }}
            >
                <FormControl sx={{ flex: 1 }}>
                    <Autocomplete
                        disabled={loading}
                        options={residents}
                        getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                        value={residents.find((r) => r.id === residentId) || null}
                        onChange={(_, newValue) => {
                            setResidentId(newValue?.id ?? null);
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Residente" fullWidth />
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

                <Button
                    onClick={handleClick}
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    sx={{ minWidth: { xs: "100%", sm: 120 }, height: 40 }}
                >
                    {loading ? <CircularProgress size={20} color="inherit" /> : "Agregar"}
                </Button>
            </Box> 
        </>
    );
};

export default AddResidentToApartmentForm;