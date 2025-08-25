import { Link } from "react-router";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import PageTitle from "../../../components/PageTitle";
import PaymentsList from "../../../features/payments/components/PaymentsList";


const PaymentsPage = () => {
    return (
        <>
            <PageTitle title="Pagos" />
            <Link to="/dashboard/pagos/crear" >
                <Button variant="outlined" color="success" startIcon={<Add />} >Crear</Button>
            </Link>
            <PaymentsList isAdmin={false} />
        </>
        
    );
}

export default PaymentsPage;