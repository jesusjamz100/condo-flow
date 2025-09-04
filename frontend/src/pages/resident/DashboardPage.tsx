import PageTitle from "../../components/PageTitle";
import Greeting from "../../features/dashboard/Greeting";
import SummaryView from "../../features/dashboard/SummaryView";

const DashboardPage = () => {

    return (
        <>
            <Greeting />
            <PageTitle title="Panel Residente" />
            <SummaryView />
        </>
    );
};

export default DashboardPage;