import React, { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import type { User } from '../types';
import api from '../services/api';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (accessToken: string, refreshToken: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('access');
            if (token) {
                try {
                    const response = await api.get('/auth/me/');
                    setUser({
                        id: response.data.id,
                        username: response.data.username, 
                    });
                } catch (error) {
                    console.error("Session expired or invalid", error);
                    localStorage.removeItem('access');
                    localStorage.removeItem('refresh');
                }
            }
            setIsLoading(false);
        };
        
        checkAuth();
    }, []);

    const login = async (accessToken: string, refreshToken: string) => {
        localStorage.setItem('access', accessToken);
        localStorage.setItem('refresh', refreshToken);

        try {
            const response = await api.get('/auth/me/');
            setUser({
                id: response.data.id,
                username: response.data.username,
            });
        } catch (error) {
            console.error("Failed to fetch user profile after login");
        }
    };

    const logout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            isAuthenticated: !!user, 
            isLoading, 
            login, 
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};