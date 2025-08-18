import PageTitle from "../../components/PageTitle";
import ApartmentsList from "../../features/apartments/components/AparmentsList";
import Navbar from "../../layouts/Navbar";


const ApartmentsPage = () => {
    return (
        <div className="flex w-screen">
            <Navbar />
            <div className="index-view">
                <PageTitle title="Mis apartamentos" />
                <ApartmentsList isAdmin={false} />
            </div>
        </div>
    );
}

export default ApartmentsPage;