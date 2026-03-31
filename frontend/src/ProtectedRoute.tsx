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
    // .trim() enlève les espaces invisibles, .toUpperCase() uniformise
    const userRole = user?.role?.trim().toUpperCase(); 
    
    // On compare les rôles
    const hasAccess = allowedRoles.some(role => {
        const requiredRole = role.trim().toUpperCase();
        return requiredRole === userRole;
    });

    // Debugging (À supprimer une fois que ça marche)
    if (!hasAccess) {
        console.warn(`Accès refusé ! Rôle utilisateur: "${userRole}", Rôles requis:`, allowedRoles);
    }

    if (!hasAccess) {
        return <Navigate to="/forbidden" replace />;
    }

}

    return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;