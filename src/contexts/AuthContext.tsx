import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  isAuthenticated: boolean;
  credits: number;
  totalCredits: number;
  isLoading: boolean;
  login: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  deductCredits: (searchType: string, searchQuery?: string) => Promise<{ success: boolean; error?: string; remainingCredits?: number }>;
  refreshCredits: () => Promise<void>;
}

const AUTH_SESSION_KEY = 'shubh_session_token';
const AUTH_DEVICE_KEY = 'shubh_device_id';

// Generate unique device ID
const getDeviceId = (): string => {
  let deviceId = localStorage.getItem(AUTH_DEVICE_KEY);
  if (!deviceId) {
    deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem(AUTH_DEVICE_KEY, deviceId);
  }
  return deviceId;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credits, setCredits] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Verify session on mount
  useEffect(() => {
    const verifySession = async () => {
      const sessionToken = localStorage.getItem(AUTH_SESSION_KEY);
      
      if (!sessionToken) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('auth-verify', {
          body: { sessionToken }
        });

        if (error || !data?.valid) {
          localStorage.removeItem(AUTH_SESSION_KEY);
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
          setCredits(data.credits);
          setTotalCredits(data.totalCredits);
        }
      } catch (err) {
        console.error('Session verification error:', err);
        localStorage.removeItem(AUTH_SESSION_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const deviceId = getDeviceId();

      const { data, error } = await supabase.functions.invoke('auth-login', {
        body: { password, deviceId }
      });

      if (error) {
        return { success: false, error: error.message || 'Login failed' };
      }

      if (!data?.success) {
        return { success: false, error: data?.error || 'Invalid password' };
      }

      localStorage.setItem(AUTH_SESSION_KEY, data.sessionToken);
      setIsAuthenticated(true);
      setCredits(data.credits);
      setTotalCredits(data.totalCredits);

      return { success: true };
    } catch (err: any) {
      console.error('Login error:', err);
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_SESSION_KEY);
    setIsAuthenticated(false);
    setCredits(0);
    setTotalCredits(0);
  }, []);

  const deductCredits = async (searchType: string, searchQuery?: string): Promise<{ success: boolean; error?: string; remainingCredits?: number }> => {
    const sessionToken = localStorage.getItem(AUTH_SESSION_KEY);
    
    if (!sessionToken) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const { data, error } = await supabase.functions.invoke('credits-deduct', {
        body: { sessionToken, searchType, searchQuery }
      });

      if (error) {
        return { success: false, error: error.message || 'Failed to deduct credits' };
      }

      if (!data?.success) {
        if (data?.error === 'Insufficient credits') {
          setCredits(data.credits || 0);
        }
        return { success: false, error: data?.error || 'Failed to deduct credits' };
      }

      setCredits(data.remainingCredits);
      return { success: true, remainingCredits: data.remainingCredits };
    } catch (err: any) {
      console.error('Deduct credits error:', err);
      return { success: false, error: err.message || 'Failed to deduct credits' };
    }
  };

  const refreshCredits = async () => {
    const sessionToken = localStorage.getItem(AUTH_SESSION_KEY);
    
    if (!sessionToken) return;

    try {
      const { data, error } = await supabase.functions.invoke('auth-verify', {
        body: { sessionToken }
      });

      if (!error && data?.valid) {
        setCredits(data.credits);
        setTotalCredits(data.totalCredits);
      }
    } catch (err) {
      console.error('Refresh credits error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      credits,
      totalCredits,
      isLoading,
      login,
      logout,
      deductCredits,
      refreshCredits
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};