import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { app } from '@/config/firebase';

// 1. Define the shape of the Context
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// 2. Create the Context with a default value of undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. The Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// 4. The Custom Hook
export function useAuth() {
  const context = useContext(AuthContext);
  
  // Safety check: ensure the hook is used within the Provider
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
