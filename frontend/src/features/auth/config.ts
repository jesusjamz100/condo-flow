import type { TAuthConfig, TRefreshTokenExpiredEvent } from "react-oauth2-code-pkce";

export const authConfig: TAuthConfig = {
    clientId: "condoflow-frontend",
    authorizationEndpoint: import.meta.env.VITE_KEYCLOAK_AUTHORIZATION,
    tokenEndpoint: import.meta.env.VITE_KEYCLOAK_TOKEN,
    redirectUri: `${window.location.origin}/auth/callback`,
    scope: "openid profile email",
    onRefreshTokenExpire: (event: TRefreshTokenExpiredEvent) => event.logIn(undefined, undefined, "popup"),
}