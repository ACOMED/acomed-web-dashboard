import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ── FAQ Accordion Item ──
const FAQItem = ({ question }) => {
  const [open, setOpen] = useState(false); 
  return (
    <div className="faq-item" onClick={() => setOpen(!open)}>
      <div className="faq-question">
        <span>{question}</span>
        <svg
          className={`faq-arrow ${open ? 'open' : ''}`}
          viewBox="0 0 24 24" width="20" height="20"
          stroke="currentColor" strokeWidth="2" fill="none"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      {open && (
        <div className="faq-answer">
          Pour toute question concernant ce sujet, n'hésitez pas à nous contacter directement via notre portail de support ou à consulter notre documentation en ligne.
        </div>
      )}
    </div>
  );
};

// ── Bar Chart (pure CSS/SVG) ──
const BarChart = ({ title, data }) => {
  const maxVal = Math.max(...data.flatMap(d => d.values));
  const colors = ['#2196F3', '#26C6DA'];
  return (
    <div className="chart-card">
      <div className="chart-title">{title}</div>
      <div className="chart-legend">
        <span className="legend-dot" style={{ background: colors[0] }} /> Réglementaire
        <span className="legend-dot" style={{ background: colors[1], marginLeft: 12 }} /> Maturité
      </div>
      <div className="bar-chart">
        {data.map((item, i) => (
          <div key={i} className="bar-group">
            <div className="bar-pair">
              {item.values.map((val, j) => (
                <div
                  key={j}
                  className="bar-fill"
                  style={{
                    height: `${(val / maxVal) * 120}px`,
                    background: colors[j],
                    opacity: 0.85
                  }}
                />
              ))}
            </div>
            <div className="bar-label">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Donut Gauge ──
const DonutGauge = ({ value, label, color }) => {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div className="donut-wrap">
      <svg width="90" height="90" viewBox="0 0 90 90">
        <circle cx="45" cy="45" r={r} fill="none" stroke="#e8ecf0" strokeWidth="10" />
        <circle
          cx="45" cy="45" r={r} fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
          transform="rotate(-90 45 45)"
        />
        <text x="45" y="50" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1a1c23">{value}%</text>
      </svg>
      <div className="donut-label">{label}</div>
    </div>
  );
};

export default function Welcome() {
  const navigate = useNavigate();

  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      ),
      title: "Moteur d'Audit",
      desc: 'Outils d’audit flexibles et configurables pour tout type de processus'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      ),
      title: 'Gestionnaire de Sync',
      desc: 'Synchronisation bidirectionnelle, même sans connexion internet'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none">
          <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
      title: 'Moteur de Score',
      desc: 'Évaluation automatisée en temps réel et analyse des risques'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none">
          <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      ),
      title: 'Workflow CAPA',
      desc: 'Suivi intégré des Actions Correctives et Préventives'
    }
  ];

  const chartData1 = [
    { label: 'Conf. Rég.', values: [70, 55] },
    { label: 'Secteur', values: [55, 45] },
  ];
  const chartData2 = [
    { label: 'Conf. Rég.', values: [80, 60] },
    { label: 'Maturité', values: [65, 75] },
  ];

  const stats = [
    { val: '30%', sub: 'Moins conformes' },
    { val: '31%', sub: 'Impact réglementaire' },
    { val: '30%', sub: 'Faible conformité secondaire' },
    { val: '50%', sub: 'Évaluation maturité réduite' },
    { val: '60%', sub: 'Meilleure collaboration' },
    { val: '50%', sub: 'Évaluation inférieure' },
  ];

  const plans = [
    {
      name: 'Basique',
      price: '40€',
      period: '/mois',
      cta: 'Acheter',
      highlight: false,
      features: ['Hors ligne', 'Multi-établissements', 'Avancé', 'Limites CAPA']
    },
    {
      name: 'Professionnel',
      price: '500€',
      period: '/mois',
      cta: 'Nous contacter',
      highlight: true,
      features: ['Hors ligne', 'Multi-établissements', 'Score préventif', 'Limites CQHA', 'Sites illimités']
    },
    {
      name: 'Entreprise',
      price: '1 000€',
      period: '/mois',
      cta: 'Démarrer',
      highlight: false,
      features: ['Hors ligne', 'Multi-établissements', 'Score en temps réel', 'Paramétrage CAPA', 'Supervision & gestion']
    }
  ];

  const faqs = [
    'Les données sont-elles sécurisées ?',
    'Comment fonctionne l’intégration ?',
    'Comment ACOMED protège-t-il les données ?',
    'Comment ACOMED innove-t-il ?',
    'Combien utilisent ses optimisations ?'
  ];

  return (
    <div className="wlc-page">
      {/* ── Topbar ── */}
      <header className="wlc-nav">
        <div className="wlc-nav-logo">
          <img src="/logo.png" alt="ACOMED" style={{ height: 32 }} />
        </div>
        <nav className="wlc-nav-links">
          <a href="#features">Produits</a>
          <a href="#scoring">Solutions</a>
          <a href="#pricing">Tarifs</a>
          <a href="#pricing">Entreprise</a>
        </nav>
        <div className="wlc-nav-actions">
          <button className="wlc-btn-ghost" onClick={() => navigate('/login')}>Se connecter</button>
          <button className="wlc-btn-primary" onClick={() => navigate('/login')}>Demander une démo</button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="wlc-hero">
        <div className="wlc-hero-text">
          <div className="wlc-hero-badge">Hors Ligne d'abord</div>
          <h1 className="wlc-hero-title">
            Auditez Partout,<br />Synchronisez Tout.
          </h1>
          <p className="wlc-hero-sub">
            Notre moteur hors ligne robuste garantit que les professionnels<br />
            de la conformité médicale peuvent auditer, suivre et synchroniser en toute fluidité.
          </p>
          <div className="wlc-hero-ctas">
            <button className="wlc-btn-primary large" onClick={() => navigate('/login')}>Commencer gratuitement</button>
            <button className="wlc-btn-outline large" onClick={() => navigate('/login')}>Voir la démo</button>
          </div>
        </div>
        <div className="wlc-hero-visuals">
          <div className="wlc-device-desktop">
            <svg viewBox="0 0 320 220" width="320" height="220">
              <defs>
                <clipPath id="desktop-screen-clip">
                  {/* Clip to inner screen bezel */}
                  <rect x="10" y="10" width="300" height="165" rx="4"/>
                </clipPath>
                <linearGradient id="desktop-glare" x1="0" y1="0" x2="0.5" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15"/>
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
                </linearGradient>
              </defs>
              {/* Monitor outer bezel */}
              <rect x="0" y="0" width="320" height="185" rx="10" fill="#1a1a2e" stroke="#3a3a5c" strokeWidth="1.5"/>
              {/* Inner screen area */}
              <rect x="8" y="8" width="304" height="169" rx="5" fill="#0f0f1a"/>
              {/* Dashboard screenshot */}
              <image
                href="/desktop-screenshot.png"
                x="10" y="10"
                width="300" height="165"
                clipPath="url(#desktop-screen-clip)"
                preserveAspectRatio="xMidYMin slice"
              />
              {/* Screen glare */}
              <rect x="10" y="10" width="300" height="165" rx="4" fill="url(#desktop-glare)"/>
              {/* Camera dot */}
              <circle cx="160" cy="4" r="2" fill="#3a3a5c"/>
              {/* Monitor stand neck */}
              <rect x="145" y="185" width="30" height="18" rx="2" fill="#2a2a40"/>
              {/* Monitor stand base */}
              <rect x="110" y="200" width="100" height="10" rx="5" fill="#2a2a40"/>
              {/* Power LED */}
              <circle cx="306" cy="180" r="2" fill="#A3DE83" opacity="0.8"/>
            </svg>
          </div>
          <div className="wlc-device-phone">
            <svg viewBox="0 0 100 180" width="100" height="180">
              <defs>
                <clipPath id="phone-screen-clip">
                  {/* Clip to the inner screen area, inside the phone body */}
                  <rect x="6" y="6" width="88" height="168" rx="13"/>
                </clipPath>
              </defs>
              {/* Phone outer shell */}
              <rect x="2" y="2" width="96" height="176" rx="16" fill="#1a1a2e" stroke="#3a3a5c" strokeWidth="1.5"/>
              {/* Side buttons */}
              <rect x="0" y="45" width="2" height="14" rx="1" fill="#3a3a5c"/>
              <rect x="0" y="63" width="2" height="14" rx="1" fill="#3a3a5c"/>
              <rect x="98" y="55" width="2" height="20" rx="1" fill="#3a3a5c"/>
              {/* Notch/Dynamic Island */}
              <rect x="30" y="7" width="40" height="6" rx="3" fill="#1a1a2e"/>
              {/* App screenshot filling the screen */}
              <image
                href="/app-screenshot.png"
                x="6" y="6"
                width="88" height="168"
                clipPath="url(#phone-screen-clip)"
                preserveAspectRatio="xMidYMin slice"
              />
              {/* Screen glare overlay */}
              <rect x="6" y="6" width="88" height="168" rx="13"
                fill="url(#phone-glare)" opacity="0.08"
              />
              <defs>
                <linearGradient id="phone-glare" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="1"/>
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="0"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="wlc-section wlc-features-section">
        <div className="wlc-features-grid">
          {features.map((f, i) => (
            <div key={i} className="wlc-feature-card">
              <div className="wlc-feature-icon">{f.icon}</div>
              <h3 className="wlc-feature-title">{f.title}</h3>
              <p className="wlc-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why ACOMED ── */}
      <section id="scoring" className="wlc-section wlc-why-section">
        <div className="wlc-section-header">
          <h2 className="wlc-section-title">Pourquoi ACOMED : Double Score</h2>
          <p className="wlc-section-sub">
            Notre moteur hors ligne mesure la conformité médicale selon deux axes :<br />
            conformité réglementaire et évaluation de maturité, synchronisés partout.
          </p>
        </div>
        <div className="wlc-charts-row">
          <BarChart title="Conformité Réglementaire" data={chartData1} />
          <BarChart title="Évaluation de Maturité" data={chartData2} />
        </div>
      </section>

      {/* ── Reg vs Maturity ── */}
      <section className="wlc-section wlc-scoring-section">
        <h2 className="wlc-section-title">Conformité Réglementaire vs. Évaluation de Maturité</h2>
        <div className="wlc-scoring-row">
          <div className="wlc-scoring-block">
            <div className="wlc-scoring-label">
              <div className="wlc-scoring-tag regulatory">Conformité Réglementaire</div>
            </div>
            <div className="wlc-scoring-gauges">
              <DonutGauge value={76} label="Rég." color="#2196F3" />
              <DonutGauge value={54} label="Secteur" color="#90CAF9" />
            </div>
            <p className="wlc-scoring-desc">
              <strong>Conformité Réglementaire</strong> — Les actions réglementaires ont été prises afin d'assurer la sécurité et la conformité des établissements de santé.
            </p>
          </div>
          <div className="wlc-scoring-block">
            <div className="wlc-scoring-label">
              <div className="wlc-scoring-tag maturity">Évaluation de Maturité</div>
            </div>
            <div className="wlc-scoring-gauges">
              <DonutGauge value={82} label="Rég." color="#26C6DA" />
              <DonutGauge value={68} label="Maturité" color="#80DEEA" />
            </div>
            <p className="wlc-scoring-desc">
              <strong>Évaluation de Maturité</strong> — La maturité est mesurée dès que les exigences de conformité sont atteintes, sécurisant à la fois le cadre réglementaire et la progression.
            </p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="wlc-stats-bar">
          {stats.map((s, i) => (
            <div key={i} className="wlc-stat-item">
              <div className="wlc-stat-val">{s.val}</div>
              <div className="wlc-stat-sub">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="wlc-section wlc-pricing-section">
        <div className="wlc-section-header">
          <h2 className="wlc-section-title">Tarification</h2>
          <p className="wlc-section-sub">Choisissez le forfait ACOMED qui correspond à vos besoins.</p>
        </div>
        <div className="wlc-pricing-grid">
          {plans.map((plan, i) => (
            <div key={i} className={`wlc-pricing-card ${plan.highlight ? 'highlighted' : ''}`}>
              <div className="wlc-plan-name">{plan.name}</div>
              <div className="wlc-plan-price">
                <span className="wlc-price-num">{plan.price}</span>
                <span className="wlc-price-period">{plan.period}</span>
              </div>
              <button
                className={plan.highlight ? 'wlc-btn-primary plan-cta' : 'wlc-btn-outline plan-cta'}
                onClick={() => navigate('/login')}
              >
                {plan.cta}
              </button>
              <ul className="wlc-plan-features">
                {plan.features.map((feat, j) => (
                  <li key={j}>
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="#22c55e" strokeWidth="2.5" fill="none">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>
              <button
                className="wlc-plan-link"
                onClick={() => navigate('/login')}
              >
                {plan.highlight ? 'Grandes entreprises' : plan.name === 'Basique' ? 'Acheter' : 'Grandes entreprises'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trust & Security ── */}
      <section className="wlc-section wlc-faq-section">
        <div className="wlc-section-header">
          <h2 className="wlc-section-title">Confiance &amp; Sécurité</h2>
          <p className="wlc-section-sub">Consultez notre FAQ sur la sécurité et la protection des données ACOMED.</p>
        </div>
        <div className="wlc-faq-list">
          {faqs.map((q, i) => (
            <FAQItem key={i} question={q} />
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="wlc-footer">
        <div className="wlc-footer-top">
          <div className="wlc-footer-brand">
            <img src="/logo.png" alt="ACOMED" style={{ height: 32, marginBottom: 10 }} />
            <p>© 2026 ACOMED. Tous droits réservés.</p>
          </div>
          <div className="wlc-footer-cols">
            <div className="wlc-footer-col">
              <div className="wlc-footer-col-title">Plan du site</div>
              <a href="#features">Produits</a>
              <a href="#scoring">Solutions</a>
              <a href="#pricing">Tarifs</a>
              <a href="#">Vitrine</a>
              <a href="#">Entreprise</a>
            </div>
            <div className="wlc-footer-col">
              <div className="wlc-footer-col-title">Entreprise</div>
              <a href="#">Politique de confidentialité</a>
              <a href="#">Conditions d'utilisation</a>
              <a href="#">Nous contacter</a>
            </div>
          </div>
          <div className="wlc-footer-socials">
            {['f', 't', 'in', 'yt'].map((s, i) => (
              <a key={i} href="#" className="wlc-social-btn">{s}</a>
            ))}
          </div>
        </div>
        <div className="wlc-footer-bottom">
          <span>Politique de confidentialité</span>
          <span>Conditions d'utilisation</span>
          <span>Nous contacter</span>
        </div>
      </footer>
    </div>
  );
}