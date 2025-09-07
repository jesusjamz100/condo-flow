import PageTitle from "../../components/PageTitle";
import AdminSummary from "../../features/dashboard/AdminSummary";
import Greeting from "../../features/dashboard/Greeting";


const AdminDashboardPage = () => {

    return (
        <>
            <Greeting />
            <PageTitle title="Panel Administrador" />
            <AdminSummary />
        </>
    );
};

export default AdminDashboardPage;