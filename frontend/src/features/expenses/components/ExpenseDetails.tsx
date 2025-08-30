import { useEffect, useState } from "react";
import type { ExpenseResponse } from "../../../types/api";
import Loading from "../../../components/Loading";
import { getExpenseById } from "../api";
import formatDate from "../../../utils/formatDate";

const ExpenseDetails = ({ expenseId }: { expenseId: number }) => {

    const [expense, setExpense] = useState<ExpenseResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getExpenseById(expenseId);
            setExpense(data);
            setLoading(false);
        };
        fetchData();
    }, [expenseId])

    if (loading) {
        return <Loading text="Cargando Gasto..." />
    }

    return (
        <>
            <div className="w-full flex flex-col gap-4">
                <p className="text-lg">
                    <span className="font-semibold">Descripción: </span>
                    {expense?.description}
                </p>
                <p className="text-lg">
                    <span className="font-semibold">Monto: </span>
                    ${expense?.amount}
                </p>
                <p className="text-lg">
                    <span className="font-semibold">Facturado: </span>
                    { expense?.billed ? "Sí" : "No"}
                </p>
                <p className="text-lg">
                    <span className="font-semibold">Tipo de Gasto: </span>
                    {expense?.scopeType === "SECTOR" ? "Sector" : expense?.scopeType === "TOWER" ? "Torre" : "General" }
                </p>
                { expense ? <>
                    <p className="text-lg flex gap-2 h-auto">
                        <span className="font-semibold">Torres: </span>
                        { expense?.scopeType === "GENERAL" ? <>Todas</> : <>
                            {Array.from(expense.applicableTowers).reverse().map(t => {
                                return (
                                    <p className="px-2 border-2">
                                        { t }
                                    </p>
                                )
                            })}
                        </> }
                    </p>
                </> : <></> }
                <p className="text-lg">
                    <span className="font-semibold">Fecha: </span>
                    { expense ? formatDate(expense.createdDate) : "Cargando" }
                </p>
            </div>
        </>
    )
}

export default ExpenseDetails;