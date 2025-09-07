import { useEffect, useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { getAllApartments } from "../api";
import type { ApartmentResponse } from "../../../types/api";


const ApartmentsBalancePie = () => {

    const [data, setData] = useState<{ name: string; value: number }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getAllApartments(0, 10000);
            const apartments: ApartmentResponse[] = res.content;
            const negative = apartments.filter(a => a.balance < 0).length;
            const nonNegative = apartments.filter(a => a.balance >= 0).length;

            setData([
                { name: "Balance Negativo", value: negative },
                { name: "Balance ≥ 0", value: nonNegative }
            ]);
        };
        fetchData();
    }, [])

    const COLORS = ["#ef5350", "#66bb6a"];

    return (
        <>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            padding: "8px"
                        }}
                        formatter={(value: number) => [`${value} apartamentos`, "Cantidad"]}
                    />
                    <Legend
                        wrapperStyle={{
                        fontSize: "0.85rem",
                        paddingTop: "10px"
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </>
    )
}

export default ApartmentsBalancePie;