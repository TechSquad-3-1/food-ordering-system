// useUserContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserContextType {
  user: any;
  setUser: (user: any) => void;
  logout: () => void;
}

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  const decodeToken = (token: string) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };

  const syncAuth = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }
    
    const decoded = decodeToken(token);
    if (!decoded) {
      logout();
      return;
    }
    
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    setUser(null);
  };

  useEffect(() => {
    // Initial sync
    syncAuth();

    // Cross-tab sync
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "token") {
        syncAuth();
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <UserContext.Provider value={{ 
      user,
      setUser: (newUser) => {
        if (newUser?.token) {
          localStorage.setItem("token", newUser.token);
          syncAuth();
        }
      },
      logout
    }}>
      {children}
    </UserContext.Provider>
  );
};
