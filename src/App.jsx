import { useState, useCallback } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import MainLayout from "./components/MainLayout";
import "./styles.css";

import "./api-states.css";

const VALID_EMAIL = "17ay2004@gmail.com";
const VALID_PASSWORD = "1234";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try { return localStorage.getItem("acomed-logged-in") === "true"; }
    catch { return false; }
  });

  const handleLoginAttempt = useCallback(async (email, password) => {
    // درنا هاد التخربيق باش يبان بحال يلا كيتسنى السيرفور (نص ثانية)
    await new Promise(resolve => setTimeout(resolve, 500));

    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      localStorage.setItem("acomed-logged-in", "true");
      setIsLoggedIn(true);
      return true;
    }
    return false;
  }, []);

  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem("acomed-logged-in");
      localStorage.removeItem("token");
    } catch { /* ignore */ }
    setIsLoggedIn(false);
  }, []);

  if (!isLoggedIn) {
    return <AuthGate onLogin={handleLoginAttempt} />;
  }

  return (
    <ThemeProvider>
      <MainLayout onLogout={handleLogout} />
    </ThemeProvider>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * AuthGate
 * ────────────────────────────────────────────────────────────────── */
function AuthGate({ onLogin }) {
  const [error, setError] = useState("");
  return <AcomedLoginForm onLogin={onLogin} />;
}

/* ──────────────────────────────────────────────────────────────────
 * AcomedLoginForm
 * ────────────────────────────────────────────────────────────────── */
function AcomedLoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const success = await onLogin(email, password);
    if (!success) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-glow auth-glow-1" />
      <div className="auth-glow auth-glow-2" />

      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-icon">🏥</span>
          <h1 className="auth-brand-name">ACOMED</h1>
          <p className="auth-brand-sub">Compliance Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="auth-field">
            <label className="auth-label" htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              type="email"
              className="auth-input"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="auth-password">Mot de passe</label>
            <input
              id="auth-password"
              type="password"
              className="auth-input"
              placeholder="••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p className="auth-error" role="alert">{error}</p>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <p className="auth-footer">
          Système de gestion de la conformité hospitalière — DHSA / JCI
        </p>
      </div>
    </div>
  );
}