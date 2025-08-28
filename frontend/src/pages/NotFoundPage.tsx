import { useAuth } from "../features/auth/AuthProvider";


const NotFoundPage = () => {

    const { tokenData } = useAuth();
    const { realm_access: { roles } } = tokenData;
    const isAdmin: boolean = roles?.indexOf("ADMIN") > -1;

    return (
        <div className="not-found">
            <p className="text-2xl">Página no encontrada</p>
            <div className="flex gap-5">
                <p><a href="/" className="hover:cursor-pointer">Dashboard Residente</a></p>
                { isAdmin ? <p><a href="/admin" className="hover:cursor-pointer">Dashboard Administrador</a></p> : <></> }
            </div>
        </div>
    );
};

export default NotFoundPage;