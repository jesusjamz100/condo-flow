import { Outlet, useLocation } from "react-router";
import { useAuth } from "./AuthProvider";
import { useEffect} from "react";

const POST_LOGIN_KEY = "postLoginRedirect";

export function RequireAuth() {
    const { isAuthenticated, logIn } = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (!isAuthenticated && location.pathname !== "/auth/callback") {
            const target = location.pathname + location.search + location.hash;
            sessionStorage.setItem(POST_LOGIN_KEY, target);
            logIn();
        }
    }, [isAuthenticated, location, logIn]);

    if (!isAuthenticated) {
        return <div>Cargando...</div>
    }

    return <Outlet />;
}

export function RequireAdmin() {

    const { tokenData } = useAuth();
    const { realm_access: { roles } } = tokenData;
    const isAdmin: boolean = roles?.indexOf("ADMIN") > -1;

    if (!isAdmin) {
        window.location.replace("http://localhost:5173/dashboard");
        return;
    }

    return <Outlet />;
}