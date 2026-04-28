import React, { createContext, useContext, useState, useMemo, useEffect, useRef } from "react";

export const FALLBACK_MOCK_USERS = [
  {
    id: "usr_001",
    tenant_id: "tnt_001",
    full_name: "Alice Martin",
    email: "alice.martin@acomed.tech",
    role: "admin",
  },
  {
    id: "usr_002",
    tenant_id: "tnt_001",
    full_name: "Bob Bernard",
    email: "bob.bernard@acomed.tech",
    role: "inspector",
  },
  {
    id: "usr_003",
    tenant_id: "tnt_001",
    full_name: "Charlie Durand",
    email: "charlie.durand@acomed.tech",
    role: "viewer",
  },
];

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("acomed-user");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse stored user", e);
    }
    return FALLBACK_MOCK_USERS[0];
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("acomed-user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("acomed-user");
    }
  }, [currentUser]);

  const value = useMemo(
    () => ({
      currentUser,
      role: currentUser?.role ?? null,
      tenantId: currentUser?.tenant_id ?? null,
      users: FALLBACK_MOCK_USERS,
      setCurrentUser,
    }),
    [currentUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
