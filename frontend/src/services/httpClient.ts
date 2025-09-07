import axios from "axios";

const httpClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: false,
    headers: {
        "Content-Type": "application/json",
    }
});

httpClient.interceptors.request.use(
    (config) => {
        const raw = localStorage.getItem("ROCP_token");
        if (raw) {
            try {
                const token = JSON.parse(raw);
                config.headers.Authorization = `Bearer ${token}`;
            } catch {
                console.warn("Token inválido en localStorage");
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default httpClient;