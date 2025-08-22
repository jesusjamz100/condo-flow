import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { RequireAuth } from "../features/auth/RequireAuth";
import DashboardPage from "../pages/resident/DashboardPage";
import NotFoundPage from "../pages/NotFoundPage";
import CallbackPage from "../pages/CallbackPage";
import ApartmentsPage from "../pages/resident/ApartmentsPage";
import ApartmentDetailsPage from "../pages/resident/ApartmentDetailsPage";
import PaymentsPage from "../pages/resident/PaymentsPage";
import PaymentDetailsPage from "../pages/resident/PaymentDetailsPage";

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth/callback" element={<CallbackPage />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route element={<RequireAuth />}>
                    <Route path="/dashboard">
                        <Route index element={<DashboardPage />} />
                        <Route path="/dashboard/apartamentos" element={<ApartmentsPage />} />
                        <Route path="/dashboard/apartamentos/:apartmentId" element={<ApartmentDetailsPage isAdmin={false} />} />
                        <Route path="/dashboard/pagos" element={<PaymentsPage />} />
                        <Route path="/dashboard/pagos/:paymentId" element={<PaymentDetailsPage isAdmin={false} />} />
                    </Route>
                </Route>
                { /* Catch all */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
};