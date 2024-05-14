"use client"
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from './types';

// Define types for the context state and actions




interface AuthProviderProps {
  children: ReactNode;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  getToken: () => null
});

// Create the AuthProvider component
const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  

  useEffect(() => {
    // Check if user data is stored in localStorage
    const storedUser = JSON.parse(localStorage.getItem('user') as string);
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (user: User, token:string) => {
    console.log('user');
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    setUser(user);
    setIsAuthenticated(true);
  };

  const getToken = () => {
    return localStorage.getItem('token');
  }

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
