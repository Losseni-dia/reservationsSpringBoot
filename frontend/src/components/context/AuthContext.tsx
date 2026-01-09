import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importation pour une navigation fluide
import { UserProfileDto } from '../../types/models';
import { authApi } from '../../services/api';

interface AuthContextType {
    user: UserProfileDto | null;
    loading: boolean;
    login: (credentials: { login: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfileDto | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Hook de navigation

    const refreshProfile = async () => {
        try {
            // On ne met setLoading(true) que si on n'a pas déjà un utilisateur 
            // pour éviter des flashs blancs inutiles sur l'interface
            const userData = await authApi.getProfile();
            
            if (userData && userData.login) {
                setUser(userData);
            } else {
                setUser(null);
            }
        } catch (err) {
            // Pas besoin de console.warn ici, c'est un état normal si non connecté
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Chargement initial au lancement de l'app
    useEffect(() => {
        refreshProfile();
    }, []);

    const login = async (credentials: { login: string; password: string }) => {
        const res = await authApi.login(credentials);
        if (!res.ok) throw new Error("Identifiants incorrects");
        
        // On attend que le profil soit récupéré avant de finir la fonction login
        await refreshProfile();
        navigate('/'); // Redirection vers l'accueil après succès
    };

    const logout = async () => {
        // 1. On vide l'état React IMMÉDIATEMENT (changement visuel instantané)
        setUser(null);
        
        try {
            // 2. On prévient le serveur (le backend détruit la session)
            await authApi.logout();
        } catch (err) {
            // On ignore l'erreur si le backend est déjà déconnecté
            console.warn("Logout backend silencieux");
        } finally {
            // 3. On redirige proprement vers le login sans recharger toute la page
            navigate('/login');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};