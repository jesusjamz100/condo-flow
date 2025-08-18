import { useState, useEffect } from "react";
import Card from "../../components/Card"
import type { ApartmentResponse } from "../../types/api";
import { getMyApartments } from "../apartments/api";

const SummaryView = () => {

    const [myApartments, setMyApartments] = useState<ApartmentResponse[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apartmentData = await getMyApartments(0, 250);
                setMyApartments(apartmentData.content);
            } catch (error) {
                console.log(error)
            }
        }
        fetchData();
    }, []);
    
    const totalApartments = myApartments?.length;
    const totalBalance: number = myApartments?.map(apt => apt.balance).reduce((acc, num) => acc + num, 0);

    return (
        <>
            <div className="flex justify-center w-full gap-10">
                <Card>
                    <div className="flex flex-col justify-center gap-2">
                        <p className="font-semibold text-lg">Total de apartamentos</p>
                        <p className="text-center text-lg">{totalApartments}</p>
                    </div>
                </Card>
                <Card>
                    <div className="flex flex-col justify-center gap-2">
                        <p className="font-semibold text-lg">Balance total (Dólares)</p>
                        <p className={"text-center text-lg" + (totalBalance < 0 ? " text-red-500" : " text-green-600")}>{totalBalance}</p>
                    </div>
                </Card>
            </div>
            <p className="text-xl font-semibold">Últimos avisos</p>
            <p className="text-lg">Sin avisos</p>
        </>
    )
}

export default SummaryView;