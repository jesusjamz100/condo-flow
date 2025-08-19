import { Navigate, useParams } from "react-router";
import PageTitle from "../../components/PageTitle";
import Navbar from "../../layouts/Navbar";
import ApartmentDetails from "../../features/apartments/components/ApartmentDetails";


const ApartmentDetailsPage = ({isAdmin}: {isAdmin: boolean}) => {
    
    const { apartmentId } = useParams<string>();

    if (!apartmentId) {
        return <Navigate to={"/404"} replace />;
    }

    const id = Number(apartmentId);
    if (!Number.isInteger(id)) {
        return <Navigate to={"/404"} replace />;
    }

    return (
        <>
            <div className="flex w-screen">
                <Navbar />
                <div className="index-view">
                    <PageTitle title={"Mi Apartamento ID #" + apartmentId} />
                    <ApartmentDetails isAdmin={isAdmin} apartmentId={id} />
                </div>
            </div>
        </>
    )
}

export default ApartmentDetailsPage;