import { createContext, useContext, useState } from "react";

// Create the UserContext
const UserContext = createContext();

// Create a provider component
export function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    const value = {
        user,
        isAuthenticated: !!user,
        login,
        logout,
    };

    return <UserContext.Provider value={value}>
        {children}
    </UserContext.Provider>;
}

// Custom hook to use the UserContext
export function useUser() {
    return useContext(UserContext);
}