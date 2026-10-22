import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (payload: any) => Promise<void>;
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
          setLoading(false);
          return;
        } catch {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }

      // Auto-authenticate with demo NGO receiver if no active token
      if (sessionStorage.getItem('explicit_logout') !== 'true') {
        try {
          const defaultCred = DEMO_CREDENTIALS.NGO_RECEIVER;
          const resp = await api.login(defaultCred.email, defaultCred.pass);
          localStorage.setItem('token', resp.token);
          setToken(resp.token);
          setUser(resp.user);
        } catch (err) {
          console.warn('Auto demo authentication failed:', err);
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    sessionStorage.removeItem('explicit_logout');
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

  const register = async (payload: any) => {
    setLoading(true);
    try {
      const resp = await api.register(payload);
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
    sessionStorage.removeItem('explicit_logout');
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
    sessionStorage.setItem('explicit_logout', 'true');
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, switchDemoRole, logout }}>
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
