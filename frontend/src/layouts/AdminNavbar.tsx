import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Button, IconButton } from "@mui/material";
import { Logout, Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import { useAuth } from "../features/auth/AuthProvider";
import { NAVBAR_ADMIN_ITEMS } from "../utils/constants";

const AdminNavbar = () => {

    const { tokenData, logOut } = useAuth();
    const { realm_access: { roles } } = tokenData;
    const isResident: boolean = roles?.indexOf("RESIDENT") > -1;
    const location = useLocation();
    const [open, setOpen] = useState(false);

    const isActiveLink = (path: string) => {
        return location.pathname === path ? "active-navlink" : "";
    }

    const handleClick = () => {
        logOut();
        window.location.reload();
    }

    return (
        <>
            <div className="lg:hidden p-2 flex justify-center h-fit ">
                <IconButton onClick={() => setOpen(true)}>
                    <MenuIcon />
                </IconButton>
            </div>
            <nav className="navbar hidden lg:flex fixed">
                <p className="logo-title">
                    <span className="text-blue-600">Condo</span>
                    <span className="text-green-700">Flow</span>
                </p>

                <ul className="navbar-list">
                    {NAVBAR_ADMIN_ITEMS.map(([label, path]) => (
                        <li key={label}>
                            <Link to={path} className={"navlink " + isActiveLink(path)}>
                                {label}
                            </Link>
                        </li>
                    ))}
                    {isResident && (
                        <li>
                            <Link to="/dashboard" className="navlink">
                                Panel Residente
                            </Link>
                        </li>
                    )}
                </ul>

                <Button
                    onClick={handleClick}
                    variant="outlined"
                    startIcon={<Logout />}
                    size="small"
                    color="error"
                    sx={{
                        mt: "auto",
                        borderRadius: "8px",
                        textTransform: "none",
                        fontWeight: "bold"
                    }}
                >
                    Cerrar Sesión
                </Button>
            </nav>
            {open && (
                <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
                    <div className="navbar flex absolute left-0 top-0 h-full w-[250px] bg-white">
                        <div className="flex justify-between items-center w-full">
                            <p className="logo-title text-xl">
                                <span className="text-blue-600">Condo</span>
                                <span className="text-green-700">Flow</span>
                            </p>
                            <IconButton onClick={() => setOpen(false)}>
                                <CloseIcon />
                            </IconButton>
                        </div>

                        <ul className="navbar-list mt-4">
                            {NAVBAR_ADMIN_ITEMS.map(([label, path]) => (
                                <li key={label}>
                                    <Link
                                        to={path}
                                        className={"navlink " + isActiveLink(path)}
                                        onClick={() => setOpen(false)}
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                            {isResident && (
                                <li>
                                    <Link
                                        to="/admin/dashboard"
                                        className="navlink"
                                        onClick={() => setOpen(false)}
                                    >
                                        Panel Administración
                                    </Link>
                                </li>
                            )}
                        </ul>

                        <Button
                            onClick={() => {
                                handleClick();
                                setOpen(false);
                            }}
                            variant="outlined"
                            startIcon={<Logout />}
                            size="small"
                            color="error"
                            sx={{
                                mt: "auto",
                                borderRadius: "8px",
                                textTransform: "none",
                                fontWeight: "bold"
                            }}
                        >
                            Cerrar Sesión
                        </Button>
                    </div>
                </div>
            )}
        </>
    )
}

export default AdminNavbar;