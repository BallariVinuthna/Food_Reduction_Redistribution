import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  switchDemoRole: (role: Role) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEMO_CREDENTIALS: Record<Role, { email: string; pass: string; title: string }> = {
  ADMIN: { email: 'admin@demo.local', pass: 'DemoPass123!', title: 'Administrator' },
  FOOD_PROVIDER: { email: 'provider@demo.local', pass: 'DemoPass123!', title: 'Food Provider (Taj Banjara)' },
  NGO_RECEIVER: { email: 'receiver@demo.local', pass: 'DemoPass123!', title: 'NGO Receiver (Robin Hood Army)' },
  VOLUNTEER: { email: 'volunteer@demo.local', pass: 'DemoPass123!', title: 'Volunteer (Vikram Sharma)' },
  CONSUMER: { email: 'admin@demo.local', pass: 'DemoPass123!', title: 'Community Consumer' },
  COLLECTION_PARTNER: { email: 'volunteer@demo.local', pass: 'DemoPass123!', title: 'Collection Partner' },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const curUser = await api.getCurrentUser();
          setUser(curUser);
        } catch {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      } else {
        // Auto-login as Food Provider by default for instant live demonstration experience
        try {
          await switchDemoRole('FOOD_PROVIDER');
        } catch (e) {
          console.warn('Initial demo login fallback', e);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const resp = await api.login(email, pass);
      localStorage.setItem('token', resp.token);
      setToken(resp.token);
      setUser(resp.user);
    } finally {
      setLoading(false);
    }
  };

  const switchDemoRole = async (role: Role) => {
    const creds = DEMO_CREDENTIALS[role];
    if (!creds) return;
    setLoading(true);
    try {
      const resp = await api.login(creds.email, creds.pass);
      localStorage.setItem('token', resp.token);
      setToken(resp.token);
      setUser(resp.user);
    } catch (err) {
      console.error('Demo switch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, switchDemoRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
