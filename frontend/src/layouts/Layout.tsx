import { Outlet } from "react-router";
import Navbar from "./Navbar";


const Layout = () => {
    return (
        <>
            <div className="flex w-full overflow-x-hidden">
                <Navbar />
                <div className="index-view">
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default Layout;