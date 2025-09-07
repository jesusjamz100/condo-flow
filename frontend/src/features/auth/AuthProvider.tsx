import { AuthProvider as PKCEProvider, AuthContext as PKCEAuthContext } from "react-oauth2-code-pkce";
import { authConfig } from "./config";
import { useContext } from "react";

type AuthProviderProps = {
    children: React.ReactNode
};

export const AuthProvider = ({children}: AuthProviderProps) => {

    return (
        <PKCEProvider
            authConfig={authConfig}
        >
            {children}
        </PKCEProvider>
    )
}

export const useAuth = () => {

    const { token, tokenData, idTokenData, logIn, logOut, error } = useContext(PKCEAuthContext);

    const roles = idTokenData?.roles || [];

    return {
        token,
        isAuthenticated: !!token,
        tokenData,
        user: idTokenData,
        roles,
        logIn,
        logOut,
        error
    }
}