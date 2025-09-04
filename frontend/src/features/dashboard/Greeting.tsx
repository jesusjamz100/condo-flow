import { useEffect, useState } from "react";
import { getMe } from "../residents/api";
import type { ResidentProfileResponse } from "../../types/api";

const Greeting = () => {
    const [me, setMe] = useState<ResidentProfileResponse | null>(null);
    useEffect(() => {
            const fetchData = async () => {
                try {
                    const meData = await getMe();
                    setMe(meData);
                } catch (error) {
                    console.log(error)
                }
            }
            fetchData();
        }, []);
    
    return (
        <div className="">
            <h1 className="text-2xl font-bold text-gray-800">
                Hola {me?.firstName || "Administrador"},
            </h1>
        </div>
    );
}

export default Greeting;