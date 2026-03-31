import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './components/context/AuthContext';
import Loader from './components/ui/loader/Loader';

interface ProtectedRouteProps {
    allowedRoles?: string[];
    children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <Loader />;
    }

    if (!user) {
        // Redirige vers la page de login en mémorisant l'URL d'origine
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Vérification des rôles
    if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role?.toUpperCase(); 
    
    const hasAccess = allowedRoles.some(role => role.toUpperCase() === userRole);

    if (!hasAccess) {
        return <Navigate to="/forbidden" replace />;
    }
}

    return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;