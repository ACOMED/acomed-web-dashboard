import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useTheme } from "../context/ThemeContext";

/* ── Inline SVGs ── */
const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconKey = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);

export default function AccountSettings() {
  const { currentUser, setCurrentUser } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

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

  const initials = currentUser?.full_name
    ? currentUser.full_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
    : "U";

  return (
    <div className="settings-wrapper">
      <style>{`
        .settings-wrapper {
          --bg-main: #f8fafc;
          --bg-card: #ffffff;
          --bg-input: #fdfdfd;
          --bg-banner: linear-gradient(to right, #ecfdf5, #ffffff);
          --text-primary: #334155;
          --text-secondary: #64748b;
          --border-color: #e2e8f0;
          --primary-emerald: #10b981;
          --primary-emerald-dark: #059669;
          --badge-emerald-bg: #d1fae5;
          --badge-emerald-text: #065f46;
          --badge-green-bg: #dcfce7;
          --badge-green-text: #15803d;

          max-width: 1100px;
          margin: 0 auto;
          padding: 40px 24px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: var(--text-primary);
        }

        html.dark .settings-wrapper {
          --bg-main: #0f172a;
          --bg-card: #1e293b;
          --bg-input: #0f172a;
          --bg-banner: linear-gradient(to right, #064e3b, #1e293b);
          --text-primary: #f1f5f9;
          --text-secondary: #94a3b8;
          --border-color: #334155;
          --badge-emerald-bg: rgba(16, 185, 129, 0.15);
          --badge-emerald-text: #6ee7b7;
          --badge-green-bg: rgba(16, 185, 129, 0.15);
          --badge-green-text: #6ee7b7;
        }

        .settings-wrapper .content-section {
          margin-bottom: 30px;
        }

        .settings-wrapper .content-section h3 {
          font-size: 16px;
          margin-bottom: 4px;
          color: var(--text-primary);
        }

        .settings-wrapper .section-desc {
          font-size: 13px;
          color: var(--text-secondary);
          margin-bottom: 16px;
        }

        .settings-wrapper .card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .settings-wrapper .profile-banner {
          background: var(--bg-banner);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 30px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .settings-wrapper .profile-header {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .settings-wrapper .avatar-large-container {
          position: relative;
          flex-shrink: 0;
        }

        .settings-wrapper .avatar-large {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 700;
          color: #ffffff;
          background: linear-gradient(135deg, var(--primary-emerald), var(--primary-emerald-dark));
          border: 2px solid var(--bg-card);
        }

        .settings-wrapper .profile-details h1 {
          font-size: 20px;
          margin-bottom: 4px;
          color: var(--text-primary);
        }

        .settings-wrapper .profile-details p {
          font-size: 14px;
          color: var(--text-secondary);
        }

        .settings-wrapper .badges {
          display: flex;
          gap: 8px;
          margin-top: 10px;
        }

        .settings-wrapper .badge {
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 20px;
          font-weight: 500;
        }

        .settings-wrapper .badge.emerald {
          background: var(--badge-emerald-bg);
          color: var(--badge-emerald-text);
        }

        .settings-wrapper .badge.green {
          background: var(--badge-green-bg);
          color: var(--badge-green-text);
        }

        .settings-wrapper .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .settings-wrapper .input-group label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--text-primary);
        }

        .settings-wrapper .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .settings-wrapper .input-wrapper .input-icon {
          position: absolute;
          left: 12px;
          color: var(--text-secondary);
          pointer-events: none;
        }

        .settings-wrapper .input-wrapper input {
          width: 100%;
          padding: 10px 12px 10px 38px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: var(--bg-input);
          color: var(--text-primary);
          font-size: 14px;
          outline: none;
          transition: border 0.2s, box-shadow 0.2s;
          font-family: inherit;
        }

        .settings-wrapper .input-wrapper input:focus {
          border-color: var(--primary-emerald);
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.12);
        }

        .settings-wrapper .mt-1 { margin-top: 20px; }

        .settings-wrapper .toggle-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .settings-wrapper .toggle-section:last-child { margin-bottom: 0; }

        .settings-wrapper .toggle-info h4 {
          font-size: 14px;
          margin-bottom: 4px;
          color: var(--text-primary);
        }

        .settings-wrapper .toggle-info p {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .settings-wrapper .switch {
          position: relative;
          width: 44px;
          height: 24px;
          border-radius: 24px;
          background: var(--border-color);
          border: none;
          cursor: pointer;
          padding: 0;
          transition: background 0.3s ease;
          flex-shrink: 0;
        }

        .settings-wrapper .switch[aria-pressed="true"] {
          background: var(--primary-emerald);
        }

        .settings-wrapper .switch::after {
          content: '';
          position: absolute;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background-color: white;
          top: 3px;
          left: 3px;
          transition: left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
        }

        .settings-wrapper .switch[aria-pressed="true"]::after {
          left: 23px;
        }

        .settings-wrapper .form-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 0 40px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .settings-wrapper .security-note {
          font-size: 12px;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .settings-wrapper .btn-primary {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
          font-family: inherit;
          font-size: 14px;
        }

        .settings-wrapper .btn-primary:hover {
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.45);
          transform: translateY(-1px);
        }

        .settings-wrapper .btn-primary:active {
          transform: translateY(0);
        }

        .settings-wrapper .btn-secondary {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          color: var(--text-primary);
          font-family: inherit;
          transition: background 0.2s;
        }

        .settings-wrapper .btn-secondary:hover {
          background: var(--bg-main);
        }

        @media (max-width: 640px) {
          .settings-wrapper .grid-2 { grid-template-columns: 1fr; }
          .settings-wrapper .profile-header { flex-direction: column; text-align: center; }
          .settings-wrapper .form-footer { flex-direction: column-reverse; align-items: stretch; }
        }
      `}</style>

      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div style={{
          position: "fixed", top: "24px", right: "24px", zIndex: 9999,
          background: "#10b981", color: "#ffffff", padding: "12px 20px",
          borderRadius: "10px", fontWeight: "700", fontSize: "0.875rem",
          boxShadow: "0 10px 15px -3px rgba(16,185,129,0.3)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <IconCheck />
            {toastMessage}
          </div>
        </div>
      )}

      {/* ── Profile Banner ── */}
      <div className="profile-banner">
        <div className="profile-header">
          <div className="avatar-large-container">
            <div className="avatar-large">{initials}</div>
          </div>
          <div className="profile-details">
            <h1>{currentUser?.full_name || "Utilisateur"}</h1>
            <p>Gérez vos informations personnelles, votre sécurité et vos préférences d'affichage.</p>
            <div className="badges">
              <span className="badge emerald">Compte Actif</span>
              <span className="badge green">Vérifié</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Personal Information ── */}
      <div className="content-section">
        <h3>Informations Personnelles</h3>
        <p className="section-desc">Mettez à jour vos coordonnées et votre identité sur la plateforme.</p>
        <div className="card">
          <form onSubmit={handleProfileSave} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="grid-2">
              <div className="input-group">
                <label>Nom complet</label>
                <div className="input-wrapper">
                  <span className="input-icon"><IconUser /></span>
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData(p => ({ ...p, fullName: e.target.value }))}
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Adresse e-mail</label>
                <div className="input-wrapper">
                  <span className="input-icon"><IconMail /></span>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(p => ({ ...p, email: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <div>
              <button type="submit" className="btn-primary">Sauvegarder le profil</button>
            </div>
          </form>
        </div>
      </div>

      {/* ── Password & Security ── */}
      <div className="content-section">
        <h3>Mot de passe & Sécurité</h3>
        <p className="section-desc">Protégez votre compte en mettant régulièrement à jour votre mot de passe.</p>
        <div className="card">
          <form onSubmit={handlePasswordSave} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="input-group">
              <label>Mot de passe actuel</label>
              <div className="input-wrapper">
                <span className="input-icon"><IconLock /></span>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(p => ({ ...p, currentPassword: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="grid-2 mt-1">
              <div className="input-group">
                <label>Nouveau mot de passe</label>
                <div className="input-wrapper">
                  <span className="input-icon"><IconKey /></span>
                  <input
                    type="password"
                    placeholder="Min. 8 caractères"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(p => ({ ...p, newPassword: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Confirmer le mot de passe</label>
                <div className="input-wrapper">
                  <span className="input-icon"><IconKey /></span>
                  <input
                    type="password"
                    placeholder="Répéter le mot de passe"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(p => ({ ...p, confirmPassword: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </div>
            <div>
              <button type="submit" className="btn-secondary">Modifier le mot de passe</button>
            </div>
          </form>
        </div>
      </div>

      {/* ── Preferences (Dark Mode Toggle) ── */}
      <div className="content-section">
        <h3>Préférences</h3>
        <p className="section-desc">Personnalisez votre expérience sur le tableau de bord.</p>
        <div className="card">
          <div className="toggle-section">
            <div className="toggle-info">
              <h4>Mode sombre</h4>
              <p>Activez le thème sombre pour réduire la fatigue visuelle.</p>
            </div>
            <button
              className="switch"
              aria-pressed={darkMode}
              onClick={toggleTheme}
              aria-label="Basculer le mode sombre"
            />
          </div>
          <div className="toggle-section">
            <div className="toggle-info">
              <h4>Alertes de sécurité</h4>
              <p>Recevez des notifications pour les connexions et changements sensibles.</p>
            </div>
            <button
              className="switch"
              aria-pressed={true}
              aria-label="Alertes de sécurité"
            />
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="form-footer">
        <span className="security-note">
          <IconLock />
          Vos données sont chiffrées et sécurisées.
        </span>
        <button className="btn-primary" onClick={handleProfileSave}>
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}