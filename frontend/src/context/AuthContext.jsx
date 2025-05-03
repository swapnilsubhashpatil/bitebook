import { createContext, useState, useEffect } from "react";
import { getUser } from "../utils/api.js";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getUser()
        .then((data) => setUser(data))
        .catch(() => localStorage.removeItem("token"));
    }
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
