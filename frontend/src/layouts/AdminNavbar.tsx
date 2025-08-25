import { Link, useLocation } from "react-router";
import { Button } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { useAuth } from "../features/auth/AuthProvider";
import { NAVBAR_ADMIN_ITEMS } from "../utils/constants";

const AdminNavbar = () => {

    const { tokenData, logOut } = useAuth();
    const { realm_access: { roles } } = tokenData;
    const isResident: boolean = roles?.indexOf("RESIDENT") > -1;

    const location = useLocation();
    const isActiveLink = (path: string) => {
        return location.pathname === path ? "active-navlink" : "navlink";
    }

    const handleClick = () => {
        logOut();
        window.location.reload();
    }

    return (
        <nav className="navbar">
            <p className="logo-title">
                <span className=" text-blue-600">Condo</span>
                <span className="text-green-700">Flow</span>
            </p>
            <ul className="navbar-list">
                {NAVBAR_ADMIN_ITEMS.map((item) => {
                    return (
                        <li key={item[0]} className="navlink">
                            <Link to={item[1]} className={isActiveLink(item[1])}>{item[0]}</Link>
                        </li>
                    )
                })}
                {isResident ? (
                    <li key="resident" className="navlink">
                        <Link to="/dashboard">Panel Residente</Link>
                    </li>
                ) : (<></>)}
            </ul>
            <Button onClick={handleClick} variant="outlined" startIcon={<Logout />} size="small" color="error">Cerrar Sesión</Button>
        </nav>
    )
}

export default AdminNavbar;