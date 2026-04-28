import React from "react";

/* ═══════════════════════════════════════════════════════════════════
   MOCK DATA — ACOMED V2.0 BACKEND SCHEMA MATCH
   ═══════════════════════════════════════════════════════════════════ */
const MOCK_V2_DATA = {
  tenant: {
    id: "tnt_chu_hassan_ii",
    name: "CHU Hassan II - Agadir",
  },
  doubleScore: {
    compliance: 87,
    maturity: 74,
    maturityBreakdown: [
      { domain: "Documentation", score: 82 },
      { domain: "Formation", score: 71 },
      { domain: "Traçabilité", score: 68 },
      { domain: "Hygiène", score: 79 },
      { domain: "Sécurité", score: 75 },
      { domain: "Gestion des Risques", score: 70 },
    ],
  },
  kpis: {
    totalAudits: 142,
    openCapas: 28,
    criticalNonConformities: 4,
    overdueCapas: 9,
  },
  nonConformities: {
    low: 12,
    medium: 8,
    high: 5,
    critical: 4,
  },
  audits: [
    {
      id: "AUD-2024-089",
      facility: "Bloc Opératoire A",
      inspector: "Dr. Amine Bennani",
      date: "2024-06-15",
      status: "CLOTURE",
      score: 91,
    },
    {
      id: "AUD-2024-088",
      facility: "Pharmacie Centrale",
      inspector: "Fatima Zahra",
      date: "2024-06-12",
      status: "REVU",
      score: 78,
    },
    {
      id: "AUD-2024-087",
      facility: "Service Urgences",
      inspector: "Dr. Karim Idrissi",
      date: "2024-06-10",
      status: "EN_COURS",
      score: null,
    },
    {
      id: "AUD-2024-086",
      facility: "Laboratoire Analyses",
      inspector: "Dr. Amine Bennani",
      date: "2024-06-05",
      status: "SOUMIS",
      score: 85,
    },
    {
      id: "AUD-2024-085",
      facility: "Stérilisation Centrale",
      inspector: "Fatima Zahra",
      date: "2024-06-01",
      status: "PLANIFIE",
      score: null,
    },
  ],
  capas: [
    {
      id: "CAPA-2024-112",
      title: "Calibration équipement X-Ray défaillant",
      assignee: "Youssef Alaoui",
      severity: "HIGH",
      dueDate: "2024-06-20",
      status: "EN_COURS",
    },
    {
      id: "CAPA-2024-111",
      title: "Mise à jour procédure stérilisation",
      assignee: "Dr. Samira Kadiri",
      severity: "MEDIUM",
      dueDate: "2024-06-18",
      status: "EN_ATTENTE_VALIDATION",
    },
    {
      id: "CAPA-2024-110",
      title: "Formation HACCP personnel restauration",
      assignee: "Ahmed Tazi",
      severity: "LOW",
      dueDate: "2024-06-25",
      status: "A_FAIRE",
    },
    {
      id: "CAPA-2024-109",
      title: "Réparation porte chambre froide secteur B",
      assignee: "Youssef Alaoui",
      severity: "CRITICAL",
      dueDate: "2024-06-14",
      status: "EN_COURS",
    },
    {
      id: "CAPA-2024-108",
      title: "Audit interne fournisseur médicaments",
      assignee: "Dr. Samira Kadiri",
      severity: "MEDIUM",
      dueDate: "2024-06-10",
      status: "CLOTUREE",
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════
   INLINE SVG ICONS (Lucide Style)
   ═══════════════════════════════════════════════════════════════════ */
const IconBuilding = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <line x1="9" y1="12" x2="9.01" y2="12" />
    <line x1="15" y1="12" x2="15.01" y2="12" />
  </svg>
);

const IconShield = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IconActivity = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const IconFileText = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconAlertTriangle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const IconTrendingUp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const IconChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const IconArrowUpRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   STATUS & SEVERITY META
   ═══════════════════════════════════════════════════════════════════ */
const getAuditStatusMeta = (status) => {
  const map = {
    BROUILLON: { label: "BROUILLON", bg: "var(--badge-slate-bg)", color: "var(--badge-slate-text)", border: "var(--badge-slate-border)" },
    PLANIFIE: { label: "PLANIFIÉ", bg: "var(--badge-blue-bg)", color: "var(--badge-blue-text)", border: "var(--badge-blue-border)" },
    EN_COURS: { label: "EN COURS", bg: "var(--badge-amber-bg)", color: "var(--badge-amber-text)", border: "var(--badge-amber-border)" },
    SOUMIS: { label: "SOUMIS", bg: "var(--badge-indigo-bg)", color: "var(--badge-indigo-text)", border: "var(--badge-indigo-border)" },
    REVU: { label: "REVU", bg: "var(--badge-purple-bg)", color: "var(--badge-purple-text)", border: "var(--badge-purple-border)" },
    CLOTURE: { label: "CLÔTURÉ", bg: "var(--badge-emerald-bg)", color: "var(--badge-emerald-text)", border: "var(--badge-emerald-border)" },
    ARCHIVE: { label: "ARCHIVÉ", bg: "var(--badge-slate-bg)", color: "var(--badge-slate-text)", border: "var(--badge-slate-border)" },
  };
  return map[status] || map.BROUILLON;
};

const getCapaStatusMeta = (status) => {
  const map = {
    A_FAIRE: { label: "À FAIRE", bg: "var(--badge-slate-bg)", color: "var(--badge-slate-text)", border: "var(--badge-slate-border)" },
    EN_COURS: { label: "EN COURS", bg: "var(--badge-blue-bg)", color: "var(--badge-blue-text)", border: "var(--badge-blue-border)" },
    EN_ATTENTE_VALIDATION: { label: "EN ATTENTE", bg: "var(--badge-amber-bg)", color: "var(--badge-amber-text)", border: "var(--badge-amber-border)" },
    CLOTUREE: { label: "CLÔTURÉE", bg: "var(--badge-emerald-bg)", color: "var(--badge-emerald-text)", border: "var(--badge-emerald-border)" },
    REJETEE: { label: "REJETÉE", bg: "var(--badge-red-bg)", color: "var(--badge-red-text)", border: "var(--badge-red-border)" },
  };
  return map[status] || map.A_FAIRE;
};

const getSeverityMeta = (severity) => {
  const map = {
    LOW: { label: "LOW", bg: "var(--badge-blue-bg)", color: "var(--badge-blue-text)", border: "var(--badge-blue-border)" },
    MEDIUM: { label: "MEDIUM", bg: "var(--badge-amber-bg)", color: "var(--badge-amber-text)", border: "var(--badge-amber-border)" },
    HIGH: { label: "HIGH", bg: "var(--badge-orange-bg)", color: "var(--badge-orange-text)", border: "var(--badge-orange-border)" },
    CRITICAL: { label: "CRITICAL", bg: "var(--badge-red-bg)", color: "var(--badge-red-text)", border: "var(--badge-red-border)" },
  };
  return map[severity] || map.LOW;
};

/* ═══════════════════════════════════════════════════════════════════
   PURE SVG CHARTS
   ═══════════════════════════════════════════════════════════════════ */
const CircularGauge = ({ value, color = "var(--accent-emerald)", size = 170, strokeWidth = 14 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (value / 100) * circumference;
  const center = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="var(--border-color)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={`${dash} ${circumference}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${center} ${center})`}
        style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.16, 1, 0.3, 1)" }}
      />
      <text
        x={center}
        y={center}
        textAnchor="middle"
        dy="0.35em"
        fill="var(--text-primary)"
        fontSize="32"
        fontWeight="800"
        fontFamily="Inter, system-ui, sans-serif"
      >
        {value}%
      </text>
    </svg>
  );
};

const RadarChart = ({ data }) => {
  const cx = 110;
  const cy = 90;
  const r = 68;
  const n = data.length;
  const levels = 5;

  const getPoint = (value, index, maxR = r) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / n;
    const radius = (value / 100) * maxR;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  };

  const gridPolys = [];
  for (let i = 1; i <= levels; i++) {
    const levelValue = (i / levels) * 100;
    const points = data
      .map((_, idx) => {
        const p = getPoint(levelValue, idx);
        return `${p.x},${p.y}`;
      })
      .join(" ");
    gridPolys.push(points);
  }

  const dataPoints = data
    .map((item, idx) => {
      const p = getPoint(item.score, idx);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  const axes = data.map((_, idx) => {
    const p = getPoint(100, idx);
    return { x1: cx, y1: cy, x2: p.x, y2: p.y };
  });

  const labels = data.map((item, idx) => {
    const p = getPoint(118, idx);
    return { ...p, text: item.domain };
  });

  return (
    <svg width="240" height="210" viewBox="0 0 240 210" style={{ display: "block" }}>
      {gridPolys.map((points, i) => (
        <polygon key={`grid-${i}`} points={points} fill="none" stroke="var(--border-color)" strokeWidth="1" />
      ))}
      {axes.map((axis, i) => (
        <line key={`axis-${i}`} x1={axis.x1} y1={axis.y1} x2={axis.x2} y2={axis.y2} stroke="var(--border-color)" strokeWidth="1" />
      ))}
      <polygon
        points={dataPoints}
        fill="var(--kpi-blue-bg-medium)"
        stroke="var(--accent-blue)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {data.map((item, idx) => {
        const p = getPoint(item.score, idx);
        return <circle key={`dot-${idx}`} cx={p.x} cy={p.y} r="4" fill="var(--accent-blue)" stroke="var(--bg-card)" strokeWidth="2" />;
      })}
      {labels.map((l, idx) => (
        <text
          key={`label-${idx}`}
          x={l.x}
          y={l.y}
          textAnchor="middle"
          dy="0.35em"
          fill="var(--text-secondary)"
          fontSize="10"
          fontWeight="600"
          fontFamily="Inter, system-ui, sans-serif"
        >
          {l.text}
        </text>
      ))}
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   CSS VARIABLES FOR DARK/LIGHT MODE SUPPORT
   ═══════════════════════════════════════════════════════════════════ */
const cssVars = `
  .dashboard-overview-container {
    --bg-main: #f8fafc;
    --bg-card: #ffffff;
    --bg-hover: #f8fafc;
    --bg-card-hover: #ffffff;
    --text-primary: #0f172a;
    --text-secondary: #64748b;
    --text-muted: #94a3b8;
    --text-table: #334155;
    --border-color: #e2e8f0;
    --border-hover: #cbd5e1;
    --shadow-color: rgba(15, 19, 30, 0.08);
    --shadow-hover: rgba(15, 19, 30, 0.12);

    --accent-emerald: #10b981;
    --accent-blue: #2f5d94;
    --accent-amber: #f59e0b;
    --accent-red: #ef4444;
    --accent-orange: #f97316;
    
    --badge-slate-bg: #f1f5f9; --badge-slate-text: #475569; --badge-slate-border: #e2e8f0;
    --badge-blue-bg: #dbeafe; --badge-blue-text: #1e40af; --badge-blue-border: #bfdbfe;
    --badge-amber-bg: #fef3c7; --badge-amber-text: #92400e; --badge-amber-border: #fde68a;
    --badge-indigo-bg: #e0e7ff; --badge-indigo-text: #3730a3; --badge-indigo-border: #c7d2fe;
    --badge-purple-bg: #f3e8ff; --badge-purple-text: #6b21a8; --badge-purple-border: #d8b4fe;
    --badge-emerald-bg: #d1fae5; --badge-emerald-text: #065f46; --badge-emerald-border: #a7f3d0;
    --badge-red-bg: #fee2e2; --badge-red-text: #991b1b; --badge-red-border: #fecaca;
    --badge-orange-bg: #ffedd5; --badge-orange-text: #9a3412; --badge-orange-border: #fed7aa;
    
    --kpi-blue-bg: rgba(47, 93, 148, 0.08);
    --kpi-blue-bg-medium: rgba(47, 93, 148, 0.18);
    --kpi-amber-bg: rgba(245, 158, 11, 0.08);
    --kpi-red-bg: rgba(239, 68, 68, 0.08);
    --kpi-orange-bg: rgba(249, 115, 22, 0.08);
    --kpi-emerald-bg: rgba(16, 185, 129, 0.08);
  }

  /* Support for global .dark class toggle */
  :global(.dark) .dashboard-overview-container,
  .dark .dashboard-overview-container,
  .dashboard-overview-container.dark {
    --bg-main: #0f172a;
    --bg-card: #1e293b;
    --bg-hover: #334155;
    --bg-card-hover: #334155;
    --text-primary: #f8fafc;
    --text-secondary: #94a3b8;
    --text-muted: #64748b;
    --text-table: #e2e8f0;
    --border-color: #334155;
    --border-hover: #475569;
    --shadow-color: rgba(0, 0, 0, 0.4);
    --shadow-hover: rgba(0, 0, 0, 0.5);
    
    --accent-blue: #3b82f6;

    --badge-slate-bg: rgba(148, 163, 184, 0.15); --badge-slate-text: #94a3b8; --badge-slate-border: rgba(148, 163, 184, 0.3);
    --badge-blue-bg: rgba(59, 130, 246, 0.15); --badge-blue-text: #93c5fd; --badge-blue-border: rgba(59, 130, 246, 0.3);
    --badge-amber-bg: rgba(245, 158, 11, 0.15); --badge-amber-text: #fcd34d; --badge-amber-border: rgba(245, 158, 11, 0.3);
    --badge-indigo-bg: rgba(99, 102, 241, 0.15); --badge-indigo-text: #a5b4fc; --badge-indigo-border: rgba(99, 102, 241, 0.3);
    --badge-purple-bg: rgba(168, 85, 247, 0.15); --badge-purple-text: #d8b4fe; --badge-purple-border: rgba(168, 85, 247, 0.3);
    --badge-emerald-bg: rgba(16, 185, 129, 0.15); --badge-emerald-text: #6ee7b7; --badge-emerald-border: rgba(16, 185, 129, 0.3);
    --badge-red-bg: rgba(239, 68, 68, 0.15); --badge-red-text: #fca5a5; --badge-red-border: rgba(239, 68, 68, 0.3);
    --badge-orange-bg: rgba(249, 115, 22, 0.15); --badge-orange-text: #fdba74; --badge-orange-border: rgba(249, 115, 22, 0.3);

    --kpi-blue-bg: rgba(59, 130, 246, 0.2);
    --kpi-blue-bg-medium: rgba(59, 130, 246, 0.3);
    --kpi-amber-bg: rgba(245, 158, 11, 0.2);
    --kpi-red-bg: rgba(239, 68, 68, 0.2);
    --kpi-orange-bg: rgba(249, 115, 22, 0.2);
    --kpi-emerald-bg: rgba(16, 185, 129, 0.2);
  }
`;

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export default function DashboardOverview() {
  const { tenant, doubleScore, kpis, audits, capas } = MOCK_V2_DATA;

  const cardBase = {
    backgroundColor: "var(--bg-card)",
    borderRadius: "14px",
    boxShadow: "0 10px 26px var(--shadow-color)",
    border: "1px solid var(--border-color)",
    padding: "28px",
  };

  const sectionTitle = {
    margin: 0,
    fontSize: "16px",
    fontWeight: 700,
    color: "var(--text-primary)",
    letterSpacing: "-0.01em",
  };

  const badgeBase = {
    display: "inline-flex",
    alignItems: "center",
    fontSize: "11px",
    fontWeight: 800,
    padding: "4px 10px",
    borderRadius: "999px",
    letterSpacing: "0.02em",
    whiteSpace: "nowrap",
    border: "1px solid",
    lineHeight: 1,
  };

  return (
    <div
      className="dashboard-overview-container"
      style={{
        backgroundColor: "var(--bg-main)",
        minHeight: "100vh",
        padding: "28px",
        fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif",
        color: "var(--text-primary)",
      }}
    >
      <style>{cssVars}</style>

      {/* ── HEADER ── */}
      <div style={{ marginBottom: "28px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "6px",
            color: "var(--text-secondary)",
          }}
        >
          <IconBuilding />
          <span
            style={{
              fontSize: "12px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Tenant Workspace
          </span>
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: "28px",
            fontWeight: 800,
            letterSpacing: "-0.025em",
            color: "var(--text-primary)",
          }}
        >
          {tenant.name}
        </h1>
        <p style={{ margin: "6px 0 0", fontSize: "14px", color: "var(--text-secondary)" }}>
          ACOMED V2.0 Dashboard Overview
        </p>
      </div>

      {/* ── TOP SECTION: DOUBLE SCORE ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        {/* Compliance */}
        <div style={cardBase}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  backgroundColor: "var(--kpi-emerald-bg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent-emerald)",
                }}
              >
                <IconShield />
              </div>
              <h2 style={sectionTitle}>Compliance Score</h2>
            </div>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--accent-emerald)",
                backgroundColor: "var(--kpi-emerald-bg)",
                padding: "4px 10px",
                borderRadius: "8px",
              }}
            >
              +2.4%
            </span>
          </div>
          <p style={{ margin: "0 0 20px", fontSize: "13px", color: "var(--text-secondary)" }}>
            Regulatory & Normative Adherence
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CircularGauge value={doubleScore.compliance} color="var(--accent-emerald)" />
          </div>
        </div>

        {/* Maturity */}
        <div style={cardBase}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  backgroundColor: "var(--kpi-blue-bg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent-blue)",
                }}
              >
                <IconActivity />
              </div>
              <h2 style={sectionTitle}>Maturity Score</h2>
            </div>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--accent-blue)",
                backgroundColor: "var(--kpi-blue-bg)",
                padding: "4px 10px",
                borderRadius: "8px",
              }}
            >
              {doubleScore.maturity}%
            </span>
          </div>
          <p style={{ margin: "0 0 12px", fontSize: "13px", color: "var(--text-secondary)" }}>
            Process Quality & Operational Excellence
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <RadarChart data={doubleScore.maturityBreakdown} />
          </div>
        </div>
      </div>

      {/* ── MIDDLE SECTION: OPERATIONAL KPIs ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {[
          {
            label: "Total Audits",
            value: kpis.totalAudits,
            icon: <IconFileText />,
            color: "var(--accent-blue)",
            bg: "var(--kpi-blue-bg)",
            trend: "+8 vs last month",
          },
          {
            label: "Open CAPAs",
            value: kpis.openCapas,
            icon: <IconClock />,
            color: "var(--accent-amber)",
            bg: "var(--kpi-amber-bg)",
            trend: "3 new this week",
          },
          {
            label: "Critical NCs",
            value: kpis.criticalNonConformities,
            icon: <IconAlertTriangle />,
            color: "var(--accent-red)",
            bg: "var(--kpi-red-bg)",
            trend: "Requires action",
          },
          {
            label: "Overdue CAPAs",
            value: kpis.overdueCapas,
            icon: <IconTrendingUp />,
            color: "var(--accent-orange)",
            bg: "var(--kpi-orange-bg)",
            trend: "-2 resolved",
          },
        ].map((kpi, i) => (
          <div
            key={i}
            style={{
              ...cardBase,
              padding: "24px",
              display: "flex",
              alignItems: "flex-start",
              gap: "16px",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 14px 32px var(--shadow-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 26px var(--shadow-color)";
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: kpi.bg,
                color: kpi.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {kpi.icon}
            </div>
            <div>
              <p style={{ margin: "0 0 4px", fontSize: "13px", color: "var(--text-secondary)", fontWeight: 600 }}>
                {kpi.label}
              </p>
              <p style={{ margin: 0, fontSize: "28px", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>
                {kpi.value}
              </p>
              <p style={{ margin: "6px 0 0", fontSize: "12px", color: kpi.color, fontWeight: 700 }}>
                {kpi.trend}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── BOTTOM SECTION: AUDITS + CAPA ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "20px",
        }}
      >
        {/* Recent Audits */}
        <div style={cardBase}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <h2 style={sectionTitle}>Recent Audits</h2>
            <a
              href="#"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--accent-blue)",
                textDecoration: "none",
                transition: "opacity 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              View All <IconChevronRight />
            </a>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr>
                  {["Audit ID", "Facility", "Status", "Score"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "10px 12px",
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "var(--text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        borderBottom: "1px solid var(--border-color)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {audits.map((audit) => {
                  const meta = getAuditStatusMeta(audit.status);
                  return (
                    <tr
                      key={audit.id}
                      style={{
                        transition: "background-color 0.15s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-hover)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <td style={{ padding: "12px", whiteSpace: "nowrap" }}>
                        <span
                          style={{
                            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "var(--accent-blue)",
                          }}
                        >
                          {audit.id}
                        </span>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                          {audit.inspector}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          color: "var(--text-table)",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {audit.facility}
                      </td>
                      <td style={{ padding: "12px", whiteSpace: "nowrap" }}>
                        <span
                          style={{
                            ...badgeBase,
                            backgroundColor: meta.bg,
                            color: meta.color,
                            borderColor: meta.border,
                          }}
                        >
                          {meta.label}
                        </span>
                      </td>
                      <td style={{ padding: "12px", whiteSpace: "nowrap" }}>
                        {audit.score != null ? (
                          <span
                            style={{
                              fontWeight: 800,
                              color: audit.score >= 80 ? "var(--accent-emerald)" : audit.score >= 60 ? "var(--accent-amber)" : "var(--accent-red)",
                            }}
                          >
                            {audit.score}%
                          </span>
                        ) : (
                          <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* CAPA Action Board */}
        <div style={cardBase}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <h2 style={sectionTitle}>CAPA Action Board</h2>
            <a
              href="#"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--accent-emerald)",
                textDecoration: "none",
                transition: "opacity 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              View Board <IconArrowUpRight />
            </a>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {capas.map((capa) => {
              const statusMeta = getCapaStatusMeta(capa.status);
              const sevMeta = getSeverityMeta(capa.severity);
              const isOverdue = new Date(capa.dueDate) < new Date("2024-06-16");

              return (
                <div
                  key={capa.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "1px solid var(--border-color)",
                    backgroundColor: "var(--bg-main)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--bg-card-hover)";
                    e.currentTarget.style.boxShadow = "0 4px 12px var(--shadow-color)";
                    e.currentTarget.style.borderColor = "var(--border-hover)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--bg-main)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "var(--border-color)";
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "6px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          ...badgeBase,
                          backgroundColor: sevMeta.bg,
                          color: sevMeta.color,
                          borderColor: sevMeta.border,
                        }}
                      >
                        {sevMeta.label}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          color: isOverdue ? "var(--accent-red)" : "var(--text-secondary)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <IconClock />
                        {capa.dueDate}
                      </span>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={capa.title}
                    >
                      {capa.title}
                    </p>
                    <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--text-secondary)" }}>
                      {capa.assignee}
                    </p>
                  </div>

                  <div style={{ flexShrink: 0 }}>
                    <span
                      style={{
                        ...badgeBase,
                        backgroundColor: statusMeta.bg,
                        color: statusMeta.color,
                        borderColor: statusMeta.border,
                      }}
                    >
                      {statusMeta.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
