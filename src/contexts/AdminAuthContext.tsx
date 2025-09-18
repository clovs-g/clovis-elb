import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { hashPassword, comparePassword } from '../utils/password';
import { Session, User } from '@supabase/supabase-js';

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'super-admin';
}

// Define a more specific type for the state
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  loading: boolean;
}

// Define the shape of the context value
interface AdminAuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>; // Adjusted signature
  logout: () => Promise<void>;
  user: User | null; 
}

// This custom interface is needed for your specific admin user table
interface CustomAdminUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const adminAuthReducer = (state: AuthState, action: any): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    session: null,
    loading: true,
  });

  useEffect(() => {
    const checkLocalStorageAuth = () => {
      try {
        const userStr = localStorage.getItem('admin-user');
        if (userStr) {
          const user: User = JSON.parse(userStr);
          setState({
            user,
            session: null, // Custom auth doesn't use Supabase sessions
            isAuthenticated: true,
            loading: false,
          });
        } else {
          setState((s) => ({ ...s, loading: false }));
        }
      } catch {
        localStorage.clear();
        setState((s) => ({ ...s, user: null, isAuthenticated: false, loading: false }));
      }
    };
    checkLocalStorageAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // This is your original, custom login logic restored
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, email, password_hash, first_name, last_name, role')
      .eq('email', email)
      .single();

    if (error || !data) {
      throw new Error('Invalid credentials or user not found.');
    }

    const passwordIsValid = await comparePassword(password, data.password_hash);

    if (!passwordIsValid) {
      throw new Error('Invalid credentials.');
    }

    // Manually construct the user object for our state
    const user: User = {
      id: data.id,
      email: data.email,
      app_metadata: { provider: 'email', providers: ['email'], role: data.role, first_name: data.first_name, last_name: data.last_name },
      user_metadata: { first_name: data.first_name, last_name: data.last_name },
      aud: 'authenticated',
      created_at: '', // Not available in custom table
    };

    localStorage.setItem('admin-user', JSON.stringify(user));
    setState({ user, session: null, isAuthenticated: true, loading: false });
  };

  const logout = async () => {
    localStorage.removeItem('admin-user');
    setState({ user: null, session: null, isAuthenticated: false, loading: false });
  };

  const value = {
    state,
    login,
    logout,
    user: state.user,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {!state.loading && children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};