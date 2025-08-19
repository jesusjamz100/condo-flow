import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { RequireAuth } from "../features/auth/RequireAuth";
import DashboardPage from "../pages/resident/DashboardPage";
import NotFoundPage from "../pages/NotFoundPage";
import CallbackPage from "../pages/CallbackPage";
import ApartmentsPage from "../pages/resident/ApartmentsPage";
import ApartmentDetailsPage from "../pages/resident/ApartmentDetailsPage";

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth/callback" element={<CallbackPage />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route element={<RequireAuth />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/apartamentos" element={<ApartmentsPage />} />
                    <Route path="/apartamentos/:apartmentId" element={<ApartmentDetailsPage isAdmin={false} />} />
                </Route>
                { /* Catch all */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
};