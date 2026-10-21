import { createContext, useContext } from 'react';

export const AuthContext = createContext({ user: null, updateUser: () => {}, signOut: () => {} });

export function useAuth() {
    return useContext(AuthContext);
}