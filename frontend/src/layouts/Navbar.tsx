import { Link, useLocation } from "react-router";
import { useAuth } from "../features/auth/AuthProvider";
import { NAVBAR_PUBLIC_ITEMS } from "../utils/constants";

const Navbar = () => {

    const { tokenData, logOut } = useAuth();
    const { realm_access: { roles } } = tokenData;
    const isAdmin: boolean = roles?.indexOf("ADMIN") > -1;

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
                {NAVBAR_PUBLIC_ITEMS.map((item) => {
                    return (
                        <li key={item[0]} className="navlink">
                            <Link to={item[1]} className={isActiveLink(item[1])}>{item[0]}</Link>
                        </li>
                    )
                })}
                {isAdmin ? (
                    <li key="admin" className="navlink">
                        <Link to="/admin/dashboard">Panel Administración</Link>
                    </li>
                ) : (<></>)}
            </ul>
            <button onClick={handleClick} className="bottom-0 text-red-500 hover:cursor-pointer">LogOut</button>
        </nav>
    )
}

export default Navbar;