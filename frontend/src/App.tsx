import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { lazy, Suspense } from "react";

const Home = lazy(() => import("./pages/home/Home"));

const Doctors = lazy(() => import("./pages/doctors/Doctors"));
const DoctorDetails = lazy(() => import("./pages/doctorDetails/DoctorDetails"));

const Register = lazy(() => import("./pages/auth/Register"));
const Login = lazy(() => import("./pages/auth/Login"));

const UserDashboard = lazy(
  () => import("./pages/dashboard/user/UserDashboard"),
);
const AdminDashboard = lazy(
  () => import("./pages/dashboard/admin/AdminDashboard"),
);

const CreateDoctorProfile = lazy(
  () => import("./pages/createDoctorProfile/CreateDoctorProfile"),
);

const PublicOnlyRoute = lazy(() => import("./routes/PublicOnlyRoute"));
const PatientOnlyRoute = lazy(() => import("./routes/PatientOnlyRoute"));
const AdminOnlyRoute = lazy(() => import("./routes/AdminOnlyRoute"));

const RegisteredUserOnlyRoute = lazy(
  () => import("./routes/RegisteredUserOnlyRoute"),
);

const PaymentSuccessful = lazy(
  () => import("./pages/payments/PaymentSuccessful"),
);
const PaymentFailed = lazy(() => import("./pages/payments/PaymentFailed"));
const PaymentExpired = lazy(() => import("./pages/payments/PaymentExpired"));
const PaymentCancelled = lazy(
  () => import("./pages/payments/PaymentCancelled"),
);

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./provider/auth-context";
import { Toaster } from "./components/ui/sonner";

import Header from "./components/layout/header/Header";
import Footer from "./components/layout/footer/Footer";

import { TooltipProvider } from "./components/ui/tooltip";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Header />

            <Suspense
              fallback={
                <div className="p-10 text-center min-h-screen">Loading...</div>
              }
            >
              <Routes>
                {/* auth routes */}
                <Route
                  path="/register"
                  element={
                    <PublicOnlyRoute>
                      <Register />
                    </PublicOnlyRoute>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <PublicOnlyRoute>
                      <Login />
                    </PublicOnlyRoute>
                  }
                />

                {/* public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/doctors" element={<Doctors />} />
                <Route path="/doctor/:id" element={<DoctorDetails />} />

                {/* private routes */}
                <Route
                  path="/doctor/apply"
                  element={
                    <PatientOnlyRoute>
                      <CreateDoctorProfile />
                    </PatientOnlyRoute>
                  }
                />
                <Route
                  path="/dashboard/user/:id"
                  element={
                    <RegisteredUserOnlyRoute>
                      <UserDashboard />
                    </RegisteredUserOnlyRoute>
                  }
                />

                {/* Payment Routes */}
                <Route
                  path="/payment/payment-success"
                  element={<PaymentSuccessful />}
                />

                <Route
                  path="/payment/payment-failed"
                  element={<PaymentFailed />}
                />

                <Route
                  path="/payment/payment-expired"
                  element={<PaymentExpired />}
                />

                <Route
                  path="/payment/payment-cancelled"
                  element={<PaymentCancelled />}
                />

                {/* admin routes */}
                <Route
                  path="/dashboard/admin/:id"
                  element={
                    <AdminOnlyRoute>
                      <AdminDashboard />
                    </AdminOnlyRoute>
                  }
                />
              </Routes>
            </Suspense>

            <Footer />
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
};

export default App;
