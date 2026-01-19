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

    // Vérification des rôles (si spécifiés)
    if (allowedRoles && allowedRoles.length > 0) {
        // Note: Assurez-vous que votre UserProfileDto contient bien une propriété 'role'
        // @ts-ignore: Suppression de l'erreur TS potentielle si le type n'est pas encore à jour
        if (!allowedRoles.includes(user.role)) {
            return <Navigate to="/forbidden" replace />;
        }
    }

    return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
