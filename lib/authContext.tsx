'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from './firebase';
import { StaffMember, getStaffByEmail, INITIAL_STAFF_SEEDS } from './staffService';

interface AuthContextType {
  user: User | null;
  staffProfile: StaffMember | null;
  role: 'admin' | 'staff' | null;
  isAdmin: boolean;
  isStaff: boolean;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<any>;
  signUp: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
  refreshStaffProfile: () => Promise<void>;
  setMockStaffSession: (staff: StaffMember | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  staffProfile: null,
  role: null,
  isAdmin: false,
  isStaff: false,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  logout: async () => {},
  refreshStaffProfile: async () => {},
  setMockStaffSession: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [staffProfile, setStaffProfile] = useState<StaffMember | null>(null);
  const [loading, setLoading] = useState(true);

  // Check stored active staff session for instant resilience
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('arcanum_active_staff_session');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.id) {
            setStaffProfile(parsed);
          }
        }
      } catch (e) {}
    }
  }, []);

  const loadStaffProfile = async (email: string) => {
    try {
      const profile = await getStaffByEmail(email);
      if (profile) {
        setStaffProfile(profile);
        if (typeof window !== 'undefined') {
          localStorage.setItem('arcanum_active_staff_session', JSON.stringify(profile));
        }
      } else {
        setStaffProfile(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('arcanum_active_staff_session');
        }
      }
    } catch (e) {
      console.warn('[Auth Profile Load Error]', e);
      setStaffProfile(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email) {
        await loadStaffProfile(currentUser.email);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const refreshStaffProfile = async () => {
    if (user?.email) {
      await loadStaffProfile(user.email);
    } else if (staffProfile?.email) {
      await loadStaffProfile(staffProfile.email);
    }
  };

  const setMockStaffSession = (staff: StaffMember | null) => {
    setStaffProfile(staff);
    if (typeof window !== 'undefined') {
      if (staff) {
        localStorage.setItem('arcanum_active_staff_session', JSON.stringify(staff));
      } else {
        localStorage.removeItem('arcanum_active_staff_session');
      }
    }
  };

  const signIn = async (email: string, pass: string) => {
    const res = await signInWithEmailAndPassword(auth, email, pass);
    if (res.user?.email) {
      await loadStaffProfile(res.user.email);
    }
    return res;
  };

  const signUp = (email: string, pass: string) => {
    return createUserWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
    setStaffProfile(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('arcanum_active_staff_session');
    }
    return signOut(auth);
  };

  // Determine Role:
  // If user is logged in and matches a staff record or staffProfile is set -> 'staff' or 'admin'
  const isStaff = Boolean(staffProfile);
  const isAdmin = Boolean(user && !staffProfile);
  const role: 'admin' | 'staff' | null = staffProfile ? 'staff' : user ? 'admin' : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        staffProfile,
        role,
        isAdmin,
        isStaff,
        loading,
        signIn,
        signUp,
        logout,
        refreshStaffProfile,
        setMockStaffSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
