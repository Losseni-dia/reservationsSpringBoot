import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Context
import { AuthProvider } from "./components/context/AuthContext";

// Layout
import Header from "./components/layout/header/Header";
import Footer from "./components/layout/footer/Footer";

// Pages
import Home from './pages/home/Home';
import ShowDetailsPage from './pages/show/showDetails/ShowDetails';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import ProfilePage from './pages/Profile/ProfilePage';
import ProducerDashboard from './pages/Producteur/Dashboard/ProducerDashboard';
import ForbiddenPage from './pages/Forbidden/ForbiddenPage';
import ProtectedRoute from './ProtectedRoute';
import AddShow from './pages/Producteur/AddShow/AddShow';
import EditShow from './pages/Producteur/UpdateShow/EditShow';
import ForgotPasswordPage from './pages/Login/ForgotPasswordPage';
import ResetPasswordPage from './pages/Login/ResetPasswordPage';
import ShowSchedule from './pages/Producteur/ShowSchedule/ShowSchedule';
import AdminShowPage from "./pages/Admin/AdminShowPage/AdminShowPage";
import LocationList from "./pages/Admin/AdminLocationsPage/AdminLocationsPage";
import AdminUsersPage from "./pages/Admin/AdminUsersPage/AdminUsersPage";
import AdminReviewPage from "./pages/Admin/AdminReviewsPage/AdminReviewsPage";

function App() {
  return (
    /* 1. Le Router enveloppe maintenant l'AuthProvider */
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <div
          className="d-flex flex-column min-vh-100"
          style={{ backgroundColor: "#141414" }}
        >
          <Header />

          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
              <Route path="/locations" element={<LocationList />} />
              <Route path="/show/:slug" element={<ShowDetailsPage />} />
              <Route path="/producer/shows/add" element={<AddShow />} />
              <Route path="/producer/shows/edit/:id" element={<EditShow />} />
              <Route path="/admin/shows/:id/schedule" element={<ShowSchedule />} />
              <Route path="/admin/shows" element={<AdminShowPage />} />
              <Route path="/admin/shows/add" element={<AddShow />} />
              <Route path="/admin/shows/edit/:id" element={<EditShow />} />
              <Route path="/admin/reviews" element={<AdminReviewPage />} />
              <Route path="/producer/dashboard" element={<ProducerDashboard />} />
              <Route path="/forbidden" element={<ForbiddenPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
