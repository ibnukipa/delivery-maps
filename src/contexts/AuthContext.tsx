import React, { createContext, useContext, useEffect, useState } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

type AuthContextType = {
  authUser: FirebaseAuthTypes.User | null;
  authLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({ authUser: null, authLoading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    return auth().onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);
  
  return (
    <AuthContext.Provider value={{ authUser: user, authLoading: loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
