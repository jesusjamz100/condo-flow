import Navbar from "../../layouts/Navbar";
import PageTitle from "../../components/PageTitle";
import Greeting from "../../features/dashboard/Greeting";
import SummaryView from "../../features/dashboard/SummaryView";

const DashboardPage = () => {

    return (
        <>
        <div className="flex w-screen">
            <Navbar />
            <div className="index-view">
                <Greeting />
                <PageTitle title="Dashboard" />
                <SummaryView />
            </div>
        </div>
        </>
    );
};

export default DashboardPage;