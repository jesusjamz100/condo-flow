import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { RequireAdmin, RequireAuth } from "../features/auth/RequireAuth";
import DashboardPage from "../pages/resident/DashboardPage";
import NotFoundPage from "../pages/NotFoundPage";
import CallbackPage from "../pages/CallbackPage";
import ApartmentsPage from "../pages/resident/apartments/ApartmentsPage";
import ApartmentDetailsPage from "../pages/resident/apartments/ApartmentDetailsPage";
import PaymentsPage from "../pages/resident/payments/PaymentsPage";
import PaymentDetailsPage from "../pages/resident/payments/PaymentDetailsPage";
import PaymentRegisterPage from "../pages/resident/payments/PaymentRegisterPage";
import Layout from "../layouts/Layout";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminLayout from "../layouts/AdminLayout";

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth/callback" element={<CallbackPage />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route element={<RequireAuth />}>
                    <Route path="/dashboard" element={<Layout />}>
                        <Route index element={<DashboardPage />} />
                        <Route path="/dashboard/apartamentos" element={<ApartmentsPage />} />
                        <Route path="/dashboard/apartamentos/:apartmentId" element={<ApartmentDetailsPage isAdmin={false} />} />
                        <Route path="/dashboard/pagos" element={<PaymentsPage />} />
                        <Route path="/dashboard/pagos/:paymentId" element={<PaymentDetailsPage isAdmin={false} />} />
                        <Route path="/dashboard/pagos/crear" element={<PaymentRegisterPage />} />
                    </Route>
                    <Route element={<RequireAdmin />}>
                        <Route path="/admin/dashboard" element={<AdminLayout />}>
                            <Route index element={<AdminDashboardPage />} />
                        </Route>
                    </Route>
                </Route>
                { /* Catch all */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
};