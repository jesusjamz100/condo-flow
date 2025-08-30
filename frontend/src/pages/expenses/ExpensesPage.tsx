import { Link } from "react-router";
import { Button } from "@mui/material"
import { Add } from "@mui/icons-material";
import PageTitle from "../../components/PageTitle";
import ExpensesList from "../../features/expenses/components/ExpensesList";

const ExpensesPage = () => {
    return (
        <>
            <PageTitle title="Gastos" />
            <Link to="/admin/dashboard/gastos/crear" >
                <Button variant="outlined" color="success" startIcon={<Add />} >Crear</Button>
            </Link>
            <ExpensesList />
        </>
    )
}

export default ExpensesPage;