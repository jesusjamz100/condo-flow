import PageTitle from "../../../components/PageTitle";
import ApartmentsList from "../../../features/apartments/components/AparmentsList";


const ApartmentsPage = () => {
    return (
        <>
            <PageTitle title="Apartamentos" />
            <ApartmentsList isAdmin={false} />
        </>
    );
}

export default ApartmentsPage;