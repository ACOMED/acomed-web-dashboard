import React, { useState, useEffect, useMemo } from "react";
import { useAuth, FALLBACK_MOCK_USERS } from "./AuthContext";

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const LockIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const ROLE_META = {
  admin: { label: "ADMIN", bg: "#dbeafe", color: "#1e40af", border: "#bfdbfe" },
  inspector: { label: "INSPECTOR", bg: "#ffedd5", color: "#9a3412", border: "#fed7aa" },
  viewer: { label: "VIEWER", bg: "#f1f5f9", color: "#334155", border: "#e2e8f0" },
};

export default function UsersManagement() {
  const { role, tenantId } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let mounted = true;
    const fetchUsers = async () => {
      try {
        const res = await fetch("https://api.acomed.tech/api/users");
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        if (mounted) {
          const tenantUsers = Array.isArray(data)
            ? data.filter((u) => u.tenant_id === tenantId)
            : FALLBACK_MOCK_USERS.filter((u) => u.tenant_id === tenantId);
          setUsers(tenantUsers);
        }
      } catch {
        if (mounted) {
          setUsers(FALLBACK_MOCK_USERS.filter((u) => u.tenant_id === tenantId));
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchUsers();
    return () => {
      mounted = false;
    };
  }, [tenantId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.full_name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }, [users, query]);

  if (role !== "admin") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100%", padding: "24px" }}>
        <div className="text-muted"><LockIcon /></div>
        <h2 className="text-heading" style={{ marginTop: 16 }}>Access Restricted</h2>
        <p className="text-muted">You must have admin privileges to view this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100%" }}>
        <span className="text-muted" style={{ fontWeight: 500 }}>Loading users...</span>
      </div>
    );
  }

  return (
    <div style={{ padding: "0" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 className="text-heading" style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
          Users Management
        </h1>
        <p className="text-muted" style={{ fontSize: "0.875rem", margin: "4px 0 0" }}>
          Manage users within your tenant
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 300px", maxWidth: "400px" }}>
          <div style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-secondary)", pointerEvents: "none", zIndex: 1, display: "flex" }}>
            <SearchIcon />
          </div>
          <input
            type="text"
            className="input-standard"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email..."
            style={{ paddingLeft: "36px" }}
          />
        </div>

        <button className="btn-primary">
          <PlusIcon />
          Add New User
        </button>
      </div>

      <div className="users-table-card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                {["Name", "Email", "Role"].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ padding: "40px 20px", textAlign: "center" }} className="text-muted">
                    No users found.
                  </td>
                </tr>
              ) : (
                filtered.map((user) => {
                  const meta = ROLE_META[user.role] || ROLE_META.viewer;
                  return (
                    <tr key={user.id}>
                      <td style={{ fontWeight: 700 }}>{user.full_name}</td>
                      <td className="text-muted">{user.email}</td>
                      <td>
                        <span
                          style={{
                            display: "inline-block",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            padding: "4px 10px",
                            borderRadius: "999px",
                            backgroundColor: meta.bg,
                            color: meta.color,
                            border: `1px solid ${meta.border}`,
                            letterSpacing: "0.02em",
                          }}
                        >
                          {meta.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
