import React, { useState, useEffect, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════════
   DATA: FALLBACK MOCK AUDITS (V2.0 Schema)
   ═══════════════════════════════════════════════════════════════════ */
const FALLBACK_MOCK_AUDITS = [
  {
    id: "AUD-2024-001",
    facilityName: "Hôpital Saint-Louis",
    inspectorName: "Dr. Alice Martin",
    date: "2024-05-12T09:00:00Z",
    score: 87,
    status: "CLOTURE",
  },
  {
    id: "AUD-2024-002",
    facilityName: "Clinique du Parc",
    inspectorName: "Bob Bernard",
    date: "2024-05-15T14:30:00Z",
    score: 72,
    status: "REVU",
  },
  {
    id: "AUD-2024-003",
    facilityName: "Centre Médical Est",
    inspectorName: "Chloé Charpentier",
    date: "2024-06-01T08:00:00Z",
    score: null,
    status: "PLANIFIE",
  },
  {
    id: "AUD-2024-004",
    facilityName: "Hôpital Saint-Louis",
    inspectorName: "David Durand",
    date: "2024-06-05T10:00:00Z",
    score: 45,
    status: "EN_COURS",
  },
  {
    id: "AUD-2024-005",
    facilityName: "Clinique du Parc",
    inspectorName: "Dr. Alice Martin",
    date: "2024-04-20T11:00:00Z",
    score: 91,
    status: "CLOTURE",
  },
  {
    id: "AUD-2024-006",
    facilityName: "Centre Médical Est",
    inspectorName: "Bob Bernard",
    date: "2024-06-10T09:30:00Z",
    score: null,
    status: "BROUILLON",
  },
  {
    id: "AUD-2024-007",
    facilityName: "Hôpital Saint-Louis",
    inspectorName: "Chloé Charpentier",
    date: "2024-05-28T13:00:00Z",
    score: 68,
    status: "SOUMIS",
  },
];

const STATUS_META = {
  BROUILLON: { label: "BROUILLON", bg: "#f1f5f9", color: "#64748b", border: "#e2e8f0" },
  PLANIFIE: { label: "PLANIFIÉ", bg: "#dbeafe", color: "#1e40af", border: "#bfdbfe" },
  EN_COURS: { label: "EN COURS", bg: "#fef9c3", color: "#854d0e", border: "#fde047" },
  SOUMIS: { label: "SOUMIS", bg: "#e0e7ff", color: "#3730a3", border: "#c7d2fe" },
  REVU: { label: "REVU", bg: "#f3e8ff", color: "#6b21a8", border: "#d8b4fe" },
  CLOTURE: { label: "CLÔTURÉ", bg: "#dcfce7", color: "#166534", border: "#86efac" },
};

/* ═══════════════════════════════════════════════════════════════════
   INLINE SVG ICONS (Lucide Style)
   ═══════════════════════════════════════════════════════════════════ */
const SearchIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const EyeIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const DownloadIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   CSV EXPORT HELPER
   ═══════════════════════════════════════════════════════════════════ */
const exportToCSV = (data) => {
  const headers = ["ID", "Facility", "Inspector", "Date", "Status", "Score"];
  const rows = data.map((a) => [
    a.id,
    `"${a.facilityName}"`,
    `"${a.inspectorName}"`,
    new Date(a.date).toLocaleDateString("fr-FR"),
    a.status,
    a.score ?? "",
  ]);
  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "audits_history.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export default function AuditsHistory() {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchAudits = async () => {
      try {
        const res = await fetch("https://api.acomed.tech/api/audits");
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        if (mounted) setAudits(Array.isArray(data) ? data : FALLBACK_MOCK_AUDITS);
      } catch {
        if (mounted) setAudits(FALLBACK_MOCK_AUDITS);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchAudits();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return audits;
    return audits.filter(
      (a) =>
        a.facilityName.toLowerCase().includes(q) ||
        a.inspectorName.toLowerCase().includes(q)
    );
  }, [audits, query]);

  const getScoreColor = (score) => {
    if (score == null) return "var(--color-text-secondary)";
    if (score < 60) return "#dc2626";
    if (score < 80) return "#ea580c";
    return "#16a34a";
  };

  const formatDate = (iso) => {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100%" }}>
        <span className="text-muted" style={{ fontWeight: 500 }}>Chargement des audits...</span>
      </div>
    );
  }

  return (
    <div style={{ padding: "0" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 className="text-heading" style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.025em" }}>
          Audits History & Management
        </h1>
        <p className="text-muted" style={{ margin: "4px 0 0", fontSize: "0.875rem" }}>
          Historique et gestion des audits ACOMED V2.0
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 300px", maxWidth: "400px" }}>
          <div style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-secondary)", pointerEvents: "none", zIndex: 1, display: "flex" }}>
            <SearchIcon style={{ width: "16px", height: "16px", display: "block" }} />
          </div>
          <input
            type="text"
            className="input-standard"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par établissement ou inspecteur..."
            style={{ paddingLeft: "36px" }}
          />
        </div>

        <button onClick={() => exportToCSV(filtered)} className="btn-standard">
          <DownloadIcon style={{ width: "16px", height: "16px" }} />
          Export CSV
        </button>
      </div>

      <div className="history-card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                {["Facility", "Inspector", "Date", "Status", "Score", "Actions"].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "40px 20px", textAlign: "center" }} className="text-muted">
                    Aucun audit trouvé.
                  </td>
                </tr>
              ) : (
                filtered.map((audit) => {
                  const meta = STATUS_META[audit.status] || STATUS_META.BROUILLON;
                  const isHovered = hoveredRow === audit.id;
                  return (
                    <tr
                      key={audit.id}
                      onMouseEnter={() => setHoveredRow(audit.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      style={{ backgroundColor: isHovered ? "#f1f5f9" : "transparent", cursor: "default" }}
                    >
                      <td style={{ fontWeight: 700 }}>
                        {audit.facilityName}
                      </td>
                      <td>
                        {audit.inspectorName}
                      </td>
                      <td className="text-muted">
                        {formatDate(audit.date)}
                      </td>
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
                      <td>
                        {audit.score != null ? (
                          <span style={{ fontWeight: 700, color: getScoreColor(audit.score) }}>
                            {audit.score}%
                          </span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td>
                        <button
                          title="View Audit"
                          className="btn-standard"
                          style={{ padding: "6px", width: "32px", height: "32px", borderRadius: "6px" }}
                        >
                          <EyeIcon style={{ width: "16px", height: "16px" }} />
                        </button>
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
