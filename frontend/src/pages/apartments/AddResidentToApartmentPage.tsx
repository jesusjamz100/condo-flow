import { Navigate, useParams } from "react-router";
import PageTitle from "../../components/PageTitle";
import AddResidentToApartmentForm from "../../features/apartments/components/AddResidentApartmentForm";

const AddResidentToApartmentPage = () => {

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
            <PageTitle title={`Agregar Residente a Apartmento ID #` + id} />
            <AddResidentToApartmentForm apartmentId={id} />
        </>
    );
}

export default AddResidentToApartmentPage;