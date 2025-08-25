import { Outlet } from "react-router";
import AdminNavbar from "./AdminNavbar";


const Layout = () => {
    return (
        <>
            <div className="flex w-screen">
                <AdminNavbar />
                <div className="index-view">
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default Layout;