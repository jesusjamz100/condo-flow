import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { getAllExpenses } from "../api";
import { aggregateExpenses } from "../../../utils/aggregateExpenses";


const MonthlyExpensesChart = () => {

    const [data, setData] = useState<{ month: string; total: number }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const startDate = `${dayjs().year()}-01-01`;
            const endDate = dayjs().endOf('month').format("YYYY-MM-DD");

            const res = await getAllExpenses(0, 10000, startDate, endDate);
            const expenses = res.content;

            const aggregated = aggregateExpenses(expenses).map(item => ({
            month: dayjs(item.month, "MM-YYYY").format("YYYY-MM-DD"),
            total: Number(item.total || 0)
            }));

            console.log("Datos procesados:", aggregated);
            setData(aggregated);
        };
        fetchData();
    }, [])

    return (
        <>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <YAxis />
                    <XAxis
                        dataKey="month"
                        tickFormatter={(value) => dayjs(value).format("MMM")}
                    />
                    <Tooltip
                        labelFormatter={(value) => dayjs(value).format("MMMM YYYY")}
                        formatter={(value: number) => [`$${value.toFixed(2)}`, "Total"]}
                    />
                    <Line type="monotone" dataKey="total" stroke="#1976d2" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </>
    )
}

export default MonthlyExpensesChart;