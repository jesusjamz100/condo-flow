import { Outlet } from "react-router";
import Navbar from "./Navbar";


const Layout = () => {
    return (
        <>
            <div className="flex w-screen">
                <Navbar />
                <div className="index-view">
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default Layout;