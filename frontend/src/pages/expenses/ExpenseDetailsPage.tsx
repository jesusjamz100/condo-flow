import { Navigate, useParams } from "react-router";
import PageTitle from "../../components/PageTitle";
import ExpenseDetails from "../../features/expenses/components/ExpenseDetails";

const ExpenseDetailsPage = () => {
    
    const { expenseId } = useParams<string>();

    if (!expenseId) {
        return <Navigate to={"/404"} replace />;
    }

    const id = Number(expenseId);
    if (!Number.isInteger(id)) {
        return <Navigate to={"/404"} replace />;
    }

    return (
        <>
            <PageTitle title={`Gasto ID #${expenseId}`} />
            <ExpenseDetails expenseId={id} />
        </>
    )
}

export default ExpenseDetailsPage;