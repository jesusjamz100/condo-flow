import { Navigate, useParams } from "react-router";
import PageTitle from "../../components/PageTitle";
import PaymentDetails from "../../features/payments/components/PaymentDetails";


const PaymentDetailsPage = ({isAdmin}: {isAdmin: boolean}) => {
    
    const { paymentId } = useParams<string>();

    if (!paymentId) {
        return <Navigate to={"/404"} replace />;
    }

    const id = Number(paymentId);
    if (!Number.isInteger(id)) {
        return <Navigate to={"/404"} replace />;
    }

    return (
        <>
            <PageTitle title={"Pago ID #" + paymentId} />
            <PaymentDetails isAdmin={isAdmin} paymentId={id} />
        </>
    )
}

export default PaymentDetailsPage;