import { Link } from "react-router";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import PageTitle from "../../components/PageTitle";
import ApartmentsList from "../../features/apartments/components/AparmentsList";


const ApartmentsPage = ({ isAdmin }: { isAdmin: boolean }) => {
    return (
        <>
            <PageTitle title="Apartamentos" />
            {isAdmin ? 
                <Link to="/admin/dashboard/apartamentos/crear" className="w-fit" style={{ width: "fit-content" }}>
                    <Button variant="outlined" color="success" startIcon={<Add />} >Crear</Button>
                </Link> : <></>}
            <ApartmentsList isAdmin={isAdmin} />
        </>
    );
}

export default ApartmentsPage;