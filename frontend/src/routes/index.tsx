import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { RequireAdmin, RequireAuth, RequireNoRol, RequireResident } from "../features/auth/RequireAuth";
import DashboardPage from "../pages/resident/DashboardPage";
import NotFoundPage from "../pages/NotFoundPage";
import CallbackPage from "../pages/CallbackPage";
import ApartmentsPage from "../pages/apartments/ApartmentsPage";
import ApartmentDetailsPage from "../pages/apartments/ApartmentDetailsPage";
import PaymentsPage from "../pages/payments/PaymentsPage";
import PaymentDetailsPage from "../pages/payments/PaymentDetailsPage";
import PaymentRegisterPage from "../pages/payments/PaymentRegisterPage";
import Layout from "../layouts/Layout";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminLayout from "../layouts/AdminLayout";
import NotValidRolePage from "../pages/NotValidRolePage";
import ApartmentCreatePage from "../pages/apartments/ApartmentCreatePage";

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth/callback" element={<CallbackPage />} />
                <Route element={<RequireAuth />}>
                    <Route element={<RequireResident />}>
                        <Route path="/dashboard" element={<Layout />}>
                            <Route index element={<DashboardPage />} />
                            <Route path="/dashboard/apartamentos" element={<ApartmentsPage isAdmin={false} />} />
                            <Route path="/dashboard/apartamentos/:apartmentId" element={<ApartmentDetailsPage isAdmin={false} />} />
                            <Route path="/dashboard/pagos" element={<PaymentsPage isAdmin={false} />} />
                            <Route path="/dashboard/pagos/:paymentId" element={<PaymentDetailsPage isAdmin={false} />} />
                            <Route path="/dashboard/pagos/crear" element={<PaymentRegisterPage />} />
                        </Route>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Route>
                    <Route element={<RequireAdmin />}>
                        <Route path="/admin/dashboard" element={<AdminLayout />}>
                            <Route index element={<AdminDashboardPage />} />
                            <Route path="/admin/dashboard/apartamentos" element={<ApartmentsPage isAdmin={true} />} />
                            <Route path="/admin/dashboard/apartamentos/:apartmentId" element={<ApartmentDetailsPage isAdmin={true} />} />
                            <Route path="/admin/dashboard/apartamentos/crear" element={<ApartmentCreatePage />} />
                            <Route path="/admin/dashboard/pagos" element={<PaymentsPage isAdmin={true} />} />
                            <Route path="/admin/dashboard/pagos/:paymentId" element={<PaymentDetailsPage isAdmin={true} />} />
                        </Route>
                        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                    </Route>
                </Route>
                <Route element={<RequireNoRol />}>
                    <Route path="/error/rol-no-valido" element={<NotValidRolePage />} />
                </Route>
                { /* Catch all */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
};