import { useEffect, useState } from "react";
import type { ApartmentResponse } from "../../../types/api";
import { getAllApartments, getMyApartments } from "../api";
import Loading from "../../../components/Loading";
import { Link } from "react-router";

interface ApartmentsListProps {
    isAdmin: boolean
}

const ApartmentsList = ({isAdmin}: ApartmentsListProps) => {

    const [apartments, setApartments] = useState<ApartmentResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = isAdmin ? await getAllApartments() : await getMyApartments();
                setApartments(data.content ?? []);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [isAdmin]);

    if (loading) {
        return <Loading text="Cargando Apartamentos..." />;
    }

    return (
        <>
            {apartments.length === 0 ? (<p>No hay Apartmentos</p>) : (
                <table className="text-center">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Código</th>
                            <th>Torre</th>
                            <th>Balance</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {apartments.map(apt => {return (
                            <tr key={apt.id}>
                                <td>{apt.id}</td>
                                <td>{apt.code}</td>
                                <td>{apt.tower}</td>
                                <td>{apt.balance}</td>
                                <td><Link to={`/apartamentos/${apt.id}`}>Detalles</Link></td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            )}
        </>
    );
}

export default ApartmentsList;