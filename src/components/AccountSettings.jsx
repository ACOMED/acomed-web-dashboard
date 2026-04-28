import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useTheme } from "../context/ThemeContext";

/* ── Inline SVGs ── */
const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconLock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconSettings = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconSun = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const IconMoon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);

const IconShield = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function AccountSettings() {
  const { currentUser, setCurrentUser, users } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  // Local state for the forms
  const [profileData, setProfileData] = useState({
    fullName: currentUser?.full_name || "",
    email: currentUser?.email || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [toastMessage, setToastMessage] = useState("");

  // Sync profile data if current user switches externally
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        fullName: currentUser.full_name,
        email: currentUser.email,
      });
    }
  }, [currentUser]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!currentUser) return;
    const updatedUser = {
      ...currentUser,
      full_name: profileData.fullName,
      email: profileData.email,
    };
    // Updating context triggers the localStorage persistence in AuthContext
    setCurrentUser(updatedUser);
    showToast("Profil mis à jour avec succès.");
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("Les mots de passe ne correspondent pas.");
      return;
    }
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    showToast("Mot de passe modifié avec succès.");
  };

  // Roles from AuthContext mock
  const roles = [
    { key: "admin", label: "Administrateur", desc: "Accès total au système et à la configuration", color: "#3b82f6" },
    { key: "inspector", label: "Inspecteur", desc: "Consultation et rédaction des audits", color: "#f59e0b" },
    { key: "viewer", label: "Observateur", desc: "Consultation en lecture seule", color: "#64748b" },
  ];

  const handleRoleSwitch = (roleKey) => {
    const target = users.find((u) => u.role === roleKey);
    if (target) {
      setCurrentUser(target);
      showToast(`Rôle changé vers : ${target.role}`);
    }
  };

  return (
    <div style={{ padding: "0 20px 40px", maxWidth: "900px", margin: "0 auto" }}>

      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div style={{
          position: "fixed", top: "24px", right: "24px", zIndex: 9999,
          background: "#10b981", color: "#ffffff", padding: "12px 20px",
          borderRadius: "8px", fontWeight: "600", fontSize: "0.875rem",
          boxShadow: "0 10px 15px -3px rgba(16,185,129,0.3)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <IconCheck />
            {toastMessage}
          </div>
        </div>
      )}

      <div style={{ marginBottom: "32px" }}>
        <h1 className="text-heading" style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.025em" }}>
          Paramètres du compte
        </h1>
        <p className="text-muted" style={{ margin: "6px 0 0", fontSize: "0.9375rem" }}>
          Gérez vos informations personnelles, vos préférences et les accès développeur.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

        {/* ── PROFILE SECTION ── */}
        <div className="card" style={{ padding: "0", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "#059669" }}><IconUser /></span>
            <h2 className="text-heading" style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600 }}>Informations Personnelles</h2>
          </div>
          <div style={{ padding: "24px" }}>
            <form onSubmit={handleProfileSave} style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "500px" }}>
              <div>
                <label className="text-muted" style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "8px" }}>
                  Nom complet
                </label>
                <input
                  type="text"
                  className="input-standard"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData(p => ({ ...p, fullName: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-muted" style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "8px" }}>
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  className="input-standard"
                  value={profileData.email}
                  onChange={(e) => setProfileData(p => ({ ...p, email: e.target.value }))}
                />
              </div>
              <div style={{ paddingTop: "8px" }}>
                <button type="submit" className="btn-primary" style={{ padding: "10px 20px" }}>
                  Sauvegarder le profil
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ── SECURITY SECTION (Password) ── */}
        <div className="card" style={{ padding: "0", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "#059669" }}><IconLock /></span>
            <h2 className="text-heading" style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600 }}>Sécurité</h2>
          </div>
          <div style={{ padding: "24px" }}>
            <form onSubmit={handlePasswordSave} style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "500px" }}>
              <div>
                <label className="text-muted" style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "8px" }}>
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  className="input-standard"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(p => ({ ...p, currentPassword: e.target.value }))}
                  required
                />
              </div>
              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  <label className="text-muted" style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "8px" }}>
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    className="input-standard"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(p => ({ ...p, newPassword: e.target.value }))}
                    required
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="text-muted" style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "8px" }}>
                    Confirmer mot de passe
                  </label>
                  <input
                    type="password"
                    className="input-standard"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(p => ({ ...p, confirmPassword: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div style={{ paddingTop: "8px" }}>
                <button type="submit" className="btn-standard" style={{ padding: "10px 20px" }}>
                  Modifier le mot de passe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ── PREFERENCES SECTION (Theme Toggle) ── */}
        <div className="card" style={{ padding: "0", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "#059669" }}><IconSettings /></span>
            <h2 className="text-heading" style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600 }}>Préférences</h2>
          </div>
          <div style={{ padding: "24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.9375rem", marginBottom: "4px" }} className="text-heading">
                Mode d'affichage
              </div>
              <div className="text-muted" style={{ fontSize: "0.8125rem" }}>
                Activer le {darkMode ? "mode clair" : "mode sombre"} pour l'application.
              </div>
            </div>

            {/* Custom Toggle Styles */}
            <button
              onClick={toggleTheme}
              style={{
                position: "relative",
                width: "60px",
                height: "32px",
                borderRadius: "16px",
                background: darkMode ? "#10b981" : "#e2e8f0",
                border: "none",
                cursor: "pointer",
                transition: "background 0.3s ease",
                display: "flex",
                alignItems: "center"
              }}
              aria-label="Toggle Theme"
            >
              <div style={{
                position: "absolute",
                left: darkMode ? "30px" : "4px",
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: "#ffffff",
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                transition: "left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: darkMode ? "#10b981" : "#94a3b8"
              }}>
                {darkMode ? <IconMoon size={14} /> : <IconSun size={14} />}
              </div>
            </button>
          </div>
        </div>

        {/* ── DEVELOPER / RBAC SECTION ── */}
        <div className="card" style={{ padding: "0", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "#4f46e5" }}><IconShield /></span>
            <h2 className="text-heading" style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600 }}>
              Développeur : Changement de Rôle (RBAC)
            </h2>
          </div>
          <div style={{ padding: "24px" }}>
            <p className="text-muted" style={{ margin: "0 0 20px 0", fontSize: "0.875rem" }}>
              Basculez instantanément le rôle de la session active pour tester les permissions.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
              {roles.map((r) => {
                const isActive = currentUser?.role === r.key;
                return (
                  <div
                    key={r.key}
                    onClick={() => handleRoleSwitch(r.key)}
                    style={{
                      padding: "16px",
                      borderRadius: "10px",
                      border: `2px solid ${isActive ? r.color : "var(--color-border)"}`,
                      backgroundColor: isActive ? `${r.color}08` : "transparent",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: r.color }} />
                        <span style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>{r.label}</span>
                      </div>
                      {isActive && <span style={{ color: r.color }}><IconCheck /></span>}
                    </div>
                    <span className="text-muted" style={{ fontSize: "0.8125rem", lineHeight: "1.4" }}>
                      {r.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
