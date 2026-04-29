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
    await new Promise(resolve => setTimeout(resolve, 600));

    // جيب الحسابات لي تسجلو من قبل فـ JSON (Storage)
    const storedAccountsJSON = localStorage.getItem("acomed_accounts");
    let accounts = [];
    if (storedAccountsJSON) {
      accounts = JSON.parse(storedAccountsJSON);
    }

    // قلب واش الحساب كاين فـ الحسابات الجداد
    const userExists = accounts.find(acc => acc.email === email && acc.password === password);

    // إيلا كان الحساب جديد أو هو الحساب الافتراضي، دخلو
    if (userExists || (email === VALID_EMAIL && password === VALID_PASSWORD)) {
      localStorage.setItem("acomed-logged-in", "true");
      setIsLoggedIn(true);
      return true;
    }
    return false;
  }, []);

  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem("acomed-logged-in");
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
  // views: "login" | "register" | "forgot"
  const [view, setView] = useState("login");

  return (
    <div className="acomed-auth-root">
      <style>{`
        .acomed-auth-root {
          display: flex;
          min-height: 100vh;
          width: 100%;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
          font-family: "Reddit Sans", "Orbitron", "Rajdhani", "Segoe UI", Tahoma, sans-serif;
          padding: 20px;
        }
        .acomed-auth-card {
          width: 100%;
          max-width: 440px;
          background: #ffffff;
          border: 1px solid #d6dce6;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(15, 19, 30, 0.08);
          padding: 40px;
          position: relative;
          overflow: hidden;
          animation: fadeSlideUp 0.4s ease-out forwards;
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .acomed-auth-logo {
          margin-bottom: 28px;
          text-align: center;
        }
        .acomed-auth-header {
          text-align: center;
          margin-bottom: 24px;
        }
        .acomed-auth-header h2 {
          font-family: 'Orbitron', 'Rajdhani', sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 6px;
          letter-spacing: 0.5px;
        }
        .acomed-auth-header p {
          font-size: 13px;
          color: #64748b;
          margin: 0;
        }
        .acomed-auth-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .acomed-auth-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .acomed-auth-label {
          font-size: 11px;
          font-weight: 700;
          color: #334155;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .acomed-auth-input {
          width: 100%;
          padding: 12px 14px;
          font-size: 13px;
          font-family: inherit;
          color: #0f172a;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          outline: none;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }
        .acomed-auth-input:focus {
          background: #ffffff;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.12);
        }
        .acomed-auth-error {
          margin: 0;
          font-size: 12px;
          color: #b91c1c;
          font-weight: 600;
          background: #fef2f2;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid #fecaca;
        }
        .acomed-auth-success {
          margin: 0;
          font-size: 12px;
          color: #047857;
          font-weight: 600;
          background: #ecfdf5;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid #a7f3d0;
        }
        .acomed-auth-submit {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          font-size: 14px;
          font-weight: 700;
          font-family: inherit;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
          transition: all 0.2s ease;
          margin-top: 4px;
        }
        .acomed-auth-submit:hover:not(:disabled) {
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.45);
          transform: translateY(-1px);
        }
        .acomed-auth-submit:active:not(:disabled) {
          transform: translateY(0);
        }
        .acomed-auth-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .acomed-auth-links {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          margin-top: 2px;
        }
        .acomed-auth-link-btn {
          background: none;
          border: none;
          color: #2f5d94;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
          font-family: inherit;
          transition: opacity 0.2s;
        }
        .acomed-auth-link-btn:hover {
          text-decoration: underline;
          opacity: 0.8;
        }
        .acomed-auth-footer {
          margin-top: 24px;
          text-align: center;
          font-size: 12px;
          color: #64748b;
          border-top: 1px solid #e2e8f0;
          padding-top: 16px;
        }
        @media (max-width: 480px) {
          .acomed-auth-card {
            padding: 30px 24px;
          }
        }
      `}</style>

      <div className="acomed-auth-card">
        <div className="acomed-auth-logo">
          <img src="logo.png" alt="ACOMED Logo" style={{ height: "42px", display: "inline-block" }} />
        </div>

        {view === "login" && <LoginForm onLogin={onLogin} setView={setView} />}
        {view === "register" && <RegisterForm setView={setView} />}
        {view === "forgot" && <ForgotPasswordForm setView={setView} />}

      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * LoginForm
 * ────────────────────────────────────────────────────────────────── */
function LoginForm({ onLogin, setView }) {
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
    <>
      <div className="acomed-auth-header">
        <h2>Connexion</h2>
        <p>Accédez à votre espace de travail sécurisé.</p>
      </div>

      <form onSubmit={handleSubmit} className="acomed-auth-form" noValidate>
        <div className="acomed-auth-field">
          <label className="acomed-auth-label">Email</label>
          <input
            type="email"
            className="acomed-auth-input"
            placeholder="nom@hopital.ma"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="acomed-auth-field">
          <label className="acomed-auth-label">Mot de passe</label>
          <input
            type="password"
            className="acomed-auth-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="acomed-auth-links">
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', cursor: 'pointer' }}>
            <input type="checkbox" style={{ accentColor: '#10b981' }} /> Se souvenir de moi
          </label>
          <button type="button" className="acomed-auth-link-btn" onClick={() => setView("forgot")}>
            Mot de passe oublié ?
          </button>
        </div>

        {error && <p className="acomed-auth-error">{error}</p>}

        <button type="submit" className="acomed-auth-submit" disabled={loading}>
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>

      <div className="acomed-auth-footer">
        Vous n'avez pas de compte ?{" "}
        <button type="button" className="acomed-auth-link-btn" onClick={() => setView("register")}>
          S'inscrire
        </button>
      </div>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * RegisterForm
 * ────────────────────────────────────────────────────────────────── */
function RegisterForm({ setView }) {
  const [fullName, setFullName] = useState("");
  const [cin, setCin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");

    // التأكد من أن المودباس مطابق
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // جيب الحسابات القدام إيلا كاينين، وزيد عليهم الحساب الجديد
      const stored = localStorage.getItem("acomed_accounts");
      const accounts = stored ? JSON.parse(stored) : [];

      // التأكد واش الحساب ديجا كاين
      const exists = accounts.find(a => a.email === email || a.cin === cin);
      if (exists) {
        setError("Un compte avec cet email ou CIN existe déjà.");
        setLoading(false);
        return;
      }

      accounts.push({ name: fullName, cin, email, password });
      localStorage.setItem("acomed_accounts", JSON.stringify(accounts));

      alert("Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
      setLoading(false);
      setView("login");
    }, 800);
  };

  return (
    <>
      <div className="acomed-auth-header">
        <h2>Créer un compte</h2>
        <p>Rejoignez la plateforme de conformité.</p>
      </div>

      <form onSubmit={handleRegister} className="acomed-auth-form" noValidate>

        {/* Nom & Prénom */}
        <div className="acomed-auth-field">
          <label className="acomed-auth-label">Nom & Prénom</label>
          <input
            type="text"
            className="acomed-auth-input"
            placeholder="Dr. Ahmed Benali"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        {/* Numéro de CIN */}
        <div className="acomed-auth-field">
          <label className="acomed-auth-label">Numéro de Carte (CIN)</label>
          <input
            type="text"
            className="acomed-auth-input"
            placeholder="Ex: AB123456"
            value={cin}
            onChange={(e) => setCin(e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div className="acomed-auth-field">
          <label className="acomed-auth-label">Email professionnel</label>
          <input
            type="email"
            className="acomed-auth-input"
            placeholder="nom@hopital.ma"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {/* Mot de passe */}
          <div className="acomed-auth-field">
            <label className="acomed-auth-label">Mot de passe</label>
            <input
              type="password"
              className="acomed-auth-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {/* Confirmation Mot de passe */}
          <div className="acomed-auth-field">
            <label className="acomed-auth-label">Confirmer</label>
            <input
              type="password"
              className="acomed-auth-input"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
        </div>

        {error && <p className="acomed-auth-error">{error}</p>}

        <button type="submit" className="acomed-auth-submit" disabled={loading}>
          {loading ? "Création en cours…" : "S'inscrire"}
        </button>
      </form>

      <div className="acomed-auth-footer">
        Vous avez déjà un compte ?{" "}
        <button type="button" className="acomed-auth-link-btn" onClick={() => setView("login")}>
          Se connecter
        </button>
      </div>
    </>
  );
}
/* ──────────────────────────────────────────────────────────────────
 * ForgotPasswordForm
 * ────────────────────────────────────────────────────────────────── */
function ForgotPasswordForm({ setView }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setSent(true);
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <div className="acomed-auth-header">
        <h2>Mot de passe oublié</h2>
        <p>Entrez votre email pour réinitialiser le mot de passe.</p>
      </div>

      {!sent ? (
        <form onSubmit={handleReset} className="acomed-auth-form" noValidate>
          <div className="acomed-auth-field">
            <label className="acomed-auth-label">Email de récupération</label>
            <input
              type="email"
              className="acomed-auth-input"
              placeholder="nom@hopital.ma"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="acomed-auth-submit" disabled={loading}>
            {loading ? "Envoi en cours…" : "Envoyer le lien"}
          </button>
        </form>
      ) : (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <p className="acomed-auth-success">
            Un email de réinitialisation a été envoyé à <strong>{email}</strong>.
          </p>
        </div>
      )}

      <div className="acomed-auth-footer">
        <button type="button" className="acomed-auth-link-btn" onClick={() => setView("login")}>
          ← Retour à la connexion
        </button>
      </div>
    </>
  );
}