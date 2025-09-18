import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// JWT 페이로드에 포함될 사용자 프로필의 타입 정의
interface UserProfile {
  sub: string; // email
  id: string; // user_id
  owner_name: string;
  phone_number: string;
  store_name: string;
  business_type: string;
  address: string;
  business_hours: string;
  business_id?: string;
  propensity: 'marketing' | 'reviews' | 'metrics';
  prompt: string;
  // JWT에 포함된 다른 모든 필드들...
}

interface AuthContextType {
  token: string | null;
  currentUser: UserProfile | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<UserProfile>(token);
        setCurrentUser(decoded);
        console.log("✅ Token decoded, user set:", decoded);
      } catch (error) {
        console.error("🔴 Invalid token:", error);
        // 잘못된 토큰은 즉시 제거
        localStorage.removeItem('authToken');
        setToken(null);
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
  }, [token]);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("🔵 Attempting login for:", email);
      const response = await fetch(`${apiUrl}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          username: email,
          password: password,
        }),
      });

      if (!response.ok) {
        console.error("🔴 Login API call failed with status:", response.status);
        return false;
      }

      const data = await response.json();
      console.log("✅ Login successful, received data:", data);
      const new_token = data.access_token;
      
      localStorage.setItem('authToken', new_token);
      console.log("💾 Token saved to localStorage");

      setToken(new_token);
      console.log("🔄 Token state in AuthContext updated");
      return true;

    } catch (error) {
      console.error("🔴 Login function failed:", error);
      return false;
    }
  };

  const logout = () => {
    console.log("👋 Logging out");
    localStorage.removeItem('authToken');
    setToken(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, currentUser, login, logout }}>
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
