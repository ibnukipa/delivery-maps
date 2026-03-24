import React, { createContext, useContext, useEffect, useState } from 'react';
import { FirebaseAuthTypes, getAuth, onAuthStateChanged,  } from '@react-native-firebase/auth';

type AuthContextType = {
  authUser: FirebaseAuthTypes.User | null;
  authLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({ authUser: null, authLoading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    return onAuthStateChanged(getAuth(), (user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);
  
  useEffect(() => {
    return getAuth().onUserChanged((user) => {
      setUser(user);
    })
  }, []);
  
  return (
    <AuthContext.Provider value={{ authUser: user, authLoading: loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
