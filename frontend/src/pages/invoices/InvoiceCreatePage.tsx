import PageTitle from "../../components/PageTitle";
import InvoiceForm from "../../features/billing/components/InvoiceForm";

const InvoiceCreatePage = () => {
    return (
        <>
            <PageTitle title="Generar Facturas" />
            <InvoiceForm />
        </>
    );
}

export default InvoiceCreatePage;