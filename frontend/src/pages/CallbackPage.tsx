import { useEffect } from "react";
import { useAuth } from "../features/auth/AuthProvider";
import { useNavigate } from "react-router";

const POST_LOGIN_KEY = "postLoginRedirect";

const CallbackPage = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            const target = sessionStorage.getItem(POST_LOGIN_KEY) || "/";
            navigate(target, { replace: true })
        }       
    }, [isAuthenticated, navigate]);
    
    return <div>Procesando autenticación...</div>;
}

export default CallbackPage;