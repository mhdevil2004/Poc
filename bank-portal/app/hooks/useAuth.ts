"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { AuthSession, LoginCredentials, SignupData, User } from "@/types";

const SESSION_KEY = "bank_portal_session";

const MOCK_USERS: Record<string, { password: string; user: User }> = {
  "admin@bank.com": {
    password: "Admin@123",
    user: {
      id: "1",
      name: "Admin User",
      email: "admin@bank.com",
      role: "admin",
      department: "Administration",
      phone: "+1 (555) 100-0001",
    },
  },
  "manager@bank.com": {
    password: "Manager@123",
    user: {
      id: "2",
      name: "Manager User",
      email: "manager@bank.com",
      role: "manager",
      department: "Loan Management",
      phone: "+1 (555) 100-0002",
    },
  },
  "officer@bank.com": {
    password: "Officer@123",
    user: {
      id: "3",
      name: "Loan Officer",
      email: "officer@bank.com",
      role: "officer",
      department: "Loan Processing",
      phone: "+1 (555) 100-0003",
    },
  },
};

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

function getStoredSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    const session: AuthSession = JSON.parse(stored);
    if (session.expiresAt < Date.now()) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

function saveSession(user: User): AuthSession {
  const session: AuthSession = {
    user,
    token: `mock_token_${user.id}_${Date.now()}`,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const session = getStoredSession();
    setUser(session?.user || null);
    setLoading(false);
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<boolean> => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockUser = MOCK_USERS[credentials.email.toLowerCase()];
      if (!mockUser || mockUser.password !== credentials.password) {
        toast.error("Invalid email or password");
        setLoading(false);
        return false;
      }

      const session = saveSession(mockUser.user);
      setUser(session.user);
      toast.success(`Welcome back, ${session.user.name}!`);
      setLoading(false);
      router.push("/dashboard");
      return true;
    },
    [router]
  );

  const signup = useCallback(
    async (data: SignupData): Promise<boolean> => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newUser: User = {
        id: String(Date.now()),
        name: data.name,
        email: data.email,
        role: "officer",
        department: "New Accounts",
      };

      const session = saveSession(newUser);
      setUser(session.user);
      toast.success("Account created successfully!");
      setLoading(false);
      router.push("/dashboard");
      return true;
    },
    [router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    toast.success("Logged out successfully");
    router.push("/login");
  }, [router]);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      const session = getStoredSession();
      if (session) {
        saveSession(updated);
      }
      return updated;
    });
    toast.success("Profile updated successfully!");
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    updateUser,
  };
}

export function useRequireAuth(): UseAuthReturn {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.loading && !auth.isAuthenticated) {
      router.push("/login");
    }
  }, [auth.loading, auth.isAuthenticated, router]);

  return auth;
}
