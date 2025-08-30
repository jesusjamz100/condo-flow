import PageTitle from "../../components/PageTitle";
import ExpenseForm from "../../features/expenses/components/ExpenseForm";

const ExpenseCreatePage = () => {
    return (
        <>
            <PageTitle title="Registrar Gasto" />
            <ExpenseForm />
        </>
    )
}

export default ExpenseCreatePage;