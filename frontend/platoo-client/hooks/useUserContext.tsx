// app/hooks/useUserContext.tsx

"use client"  // Add this at the top to mark it as a client-side component

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserContextType {
  user: any; // Define the user type here, based on your app's structure
  setUser: (user: any) => void;
}

interface UserProviderProps {
  children: ReactNode; // Add children prop type
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

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedUser = decodeToken(token); 
      setUser(decodedUser);
    }
  }, []);

  const decodeToken = (token: string) => {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded;
    } catch (error) {
      console.error("Error decoding token", error);
      return null;
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
