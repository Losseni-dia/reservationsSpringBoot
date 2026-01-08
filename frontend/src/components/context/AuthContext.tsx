import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfileDto, UserRegistrationDto } from '../../types/models';

interface AuthContextType {
    user: UserProfileDto | null;
    loading: boolean;
    login: (credentials: { login: string; password: string }) => Promise<void>;
    register: (data: UserRegistrationDto) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfileDto | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshProfile = async () => {
        try {
            const res = await fetch('/api/users/profile');
            if (res.ok) setUser(await res.json());
            else setUser(null);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { refreshProfile(); }, []);

    const login = async (credentials: any) => {
        const params = new URLSearchParams();
        params.append('login', credentials.login);
        params.append('password', credentials.password);

        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        });

        if (!res.ok) throw new Error("Identifiants incorrects");
        await refreshProfile();
    };

    const register = async (data: UserRegistrationDto) => {
        const res = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(await res.text());
    };

    const logout = async () => {
        await fetch('/api/logout', { method: 'POST' });
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};