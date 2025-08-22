import PageTitle from "../../components/PageTitle";
import PaymentsList from "../../features/payments/components/PaymentsList";
import Navbar from "../../layouts/Navbar";


const PaymentsPage = () => {
    return (
        <div className="flex w-screen">
            <Navbar />
            <div className="index-view">
                <PageTitle title="Mis pagos" />
                <PaymentsList isAdmin={false} />
            </div>
        </div>
    );
}

export default PaymentsPage;