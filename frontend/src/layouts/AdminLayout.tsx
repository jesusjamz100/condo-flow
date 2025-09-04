import { Outlet } from "react-router";
import AdminNavbar from "./AdminNavbar";


const AdminLayout = () => {
    return (
        <>
            <div className="flex w-full overflow-x-hidden">
                <AdminNavbar />
                <div className="index-view">
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default AdminLayout;