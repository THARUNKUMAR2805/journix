import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  language: string;
  loyaltyPoints: number;
  avatar?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  language?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('journix_token');
    const savedUser = localStorage.getItem('journix_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.clear();
      }
    }
    setIsLoading(false);
  }, []);

  async function login(email: string, password: string) {
    const res = await api.post('/auth/login', { email: email.trim(), password });
    const { user: u, token: t } = res.data;
    setUser(u);
    setToken(t);
    localStorage.setItem('journix_token', t);
    localStorage.setItem('journix_user', JSON.stringify(u));
    toast.success(`Welcome back, ${u.name}! 👋`);
  }

  async function register(data: RegisterData) {
    const payload = {
      ...data,
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone?.trim() || undefined,
    };
    const res = await api.post('/auth/register', payload);
    const { user: u, token: t } = res.data;
    setUser(u);
    setToken(t);
    localStorage.setItem('journix_token', t);
    localStorage.setItem('journix_user', JSON.stringify(u));
    toast.success(`Welcome to JourniX, ${u.name}! 🎉 You earned 100 welcome points!`);
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('journix_token');
    localStorage.removeItem('journix_user');
    toast.success('Logged out successfully');
  }

  function updateUser(data: Partial<User>) {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('journix_user', JSON.stringify(updated));
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
