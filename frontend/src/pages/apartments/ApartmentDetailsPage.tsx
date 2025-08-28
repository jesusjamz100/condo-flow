import { Navigate, useParams } from "react-router";
import PageTitle from "../../components/PageTitle";
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
            <PageTitle title={"Apartamento ID #" + apartmentId} />
            <ApartmentDetails isAdmin={isAdmin} apartmentId={id} />
        </>
    )
}

export default ApartmentDetailsPage;