import { Link } from "react-router";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import PageTitle from "../../components/PageTitle";
import InvoicesList from "../../features/billing/components/InvoicesList";


const InvoicesPage = ({ isAdmin }: { isAdmin: boolean }) => {
    return (
        <>
            <PageTitle title="Facturas" />
            {isAdmin ? 
                <Link to="/admin/dashboard/facturas/generar" style={{ width: "fit-content" }}>
                    <Button variant="outlined" color="success" startIcon={<Add />} >Generar Facturas</Button>
                </Link> : <></>}
            <InvoicesList isAdmin={isAdmin} />
        </>
    );
}

export default InvoicesPage;