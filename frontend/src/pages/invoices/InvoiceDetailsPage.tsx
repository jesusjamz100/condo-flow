import { Navigate, useParams } from "react-router"
import PageTitle from "../../components/PageTitle"
import InvoiceDetails from "../../features/billing/components/InvoiceDetails";

const InvoiceDetailsPage = ({ isAdmin }: { isAdmin: boolean }) => {

    const { invoiceId } = useParams<string>();

    if (!invoiceId) {
        return <Navigate to={"/404"} replace />;
    }

    const id = Number(invoiceId);
    if (!Number.isInteger(id)) {
        return <Navigate to={"/404"} replace />;
    }


    return (
        <>
            <PageTitle title={`Factura ID #${invoiceId}`} />
            <InvoiceDetails isAdmin={isAdmin} invoiceId={id} />
        </>
    )
}

export default InvoiceDetailsPage;