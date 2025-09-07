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

export function RequireResident() {
    const { tokenData } = useAuth();
    const { realm_access: { roles } } = tokenData;
    const isAdmin: boolean = roles?.indexOf("ADMIN") > -1;
    const isResident: boolean = roles?.indexOf("RESIDENT") > -1;

    if (!isResident) {
        if (isAdmin) {
            window.location.replace("http://localhost:5173/admin/dashboard");
            return;
        }

        window.location.replace("http://localhost:5173/error/rol-no-valido");
        return;
    }

    return <Outlet />
}

export function RequireAdmin() {

    const { tokenData } = useAuth();
    const { realm_access: { roles } } = tokenData;
    const isAdmin: boolean = roles?.indexOf("ADMIN") > -1;
    const isResident: boolean = roles?.indexOf("RESIDENT") > -1;

    if (!isAdmin) {
        if (isResident) {
            window.location.replace("http://localhost:5173/dashboard");
            return;
        }

        window.location.replace("http://localhost:5173/error/rol-no-valido");
        return;
    }

    return <Outlet />;
}

export function RequireNoRol() {

    const { tokenData } = useAuth();
    const { realm_access: { roles } } = tokenData;
    const isAdmin: boolean = roles?.indexOf("ADMIN") > -1;
    const isResident: boolean = roles?.indexOf("RESIDENT") > -1;

    if (isResident) {
        window.location.replace("http://localhost:5173/dashboard");
        return;
    } else if (isAdmin) {
        window.location.replace("http://localhost:5173/error/rol-no-valido");
        return;
    }

    return <Outlet />;
}