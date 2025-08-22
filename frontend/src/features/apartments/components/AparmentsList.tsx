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
                <table className="text-center mt-10">
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
                            <tr key={apt.id} className=" border-b-1">
                                <td>{apt.id}</td>
                                <td>{apt.code}</td>
                                <td>{apt.tower}</td>
                                <td>{apt.balance}</td>
                                <td className="flex gap-2 items-center justify-center">
                                    <Link to={`/dashboard/apartamentos/${apt.id}`}>
                                        <button className="p-2 bg-blue-300 rounded-lg my-5 hover:cursor-pointer">Detalles</button>
                                    </Link>
                                    {isAdmin ? <></> : <></>}
                                </td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            )}
        </>
    );
}

export default ApartmentsList;