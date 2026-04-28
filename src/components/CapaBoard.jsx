import React, { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════════
   DATA: FALLBACK MOCK CAPAS (V2.0 Schema)
   ═══════════════════════════════════════════════════════════════════ */
const FALLBACK_MOCK_CAPAS = [
  {
    id: "capa_001",
    title: "Température chambre froide dépassée secteur B",
    facilityName: "Hôpital Saint-Louis",
    assignee: { name: "Dr. Alice Martin", initials: "AM" },
    severity: "Critical",
    dueDate: "2024-06-15",
    status: "A_FAIRE",
  },
  {
    id: "capa_002",
    title: "Formation hygiène du personnel non renouvelée",
    facilityName: "Clinique du Parc",
    assignee: { name: "Bob Bernard", initials: "BB" },
    severity: "Major",
    dueDate: "2024-06-20",
    status: "EN_COURS",
  },
  {
    id: "capa_003",
    title: "Traceur de stérilisation manquant lot #4421",
    facilityName: "Hôpital Saint-Louis",
    assignee: { name: "Chloé Charpentier", initials: "CC" },
    severity: "Minor",
    dueDate: "2024-06-25",
    status: "A_FAIRE",
  },
  {
    id: "capa_004",
    title: "Joint de porte de bloc opératoire défectueux",
    facilityName: "Clinique du Parc",
    assignee: { name: "Dr. Alice Martin", initials: "AM" },
    severity: "Critical",
    dueDate: "2024-06-10",
    status: "EN_ATTENTE_VALIDATION",
  },
  {
    id: "capa_005",
    title: "Protocole de lavage des mains non affiché",
    facilityName: "Centre Médical Est",
    assignee: { name: "David Durand", initials: "DD" },
    severity: "Major",
    dueDate: "2024-06-18",
    status: "CLOTUREE",
  },
  {
    id: "capa_006",
    title: "Maintenance préventive automate retardée",
    facilityName: "Hôpital Saint-Louis",
    assignee: { name: "Bob Bernard", initials: "BB" },
    severity: "Minor",
    dueDate: "2024-07-01",
    status: "EN_COURS",
  },
  {
    id: "capa_007",
    title: "Désinfection quotidienne non enregistrée",
    facilityName: "Centre Médical Est",
    assignee: { name: "Chloé Charpentier", initials: "CC" },
    severity: "Major",
    dueDate: "2024-06-22",
    status: "A_FAIRE",
  },
  {
    id: "capa_008",
    title: "Vérification calibrage balance réussie",
    facilityName: "Clinique du Parc",
    assignee: { name: "David Durand", initials: "DD" },
    severity: "Minor",
    dueDate: "2024-06-12",
    status: "CLOTUREE",
  },
];

const COLUMNS = [
  { key: "A_FAIRE", label: "À FAIRE" },
  { key: "EN_COURS", label: "EN COURS" },
  { key: "EN_ATTENTE_VALIDATION", label: "EN ATTENTE VALIDATION" },
  { key: "CLOTUREE", label: "CLÔTURÉE" },
];

/* ═══════════════════════════════════════════════════════════════════
   INLINE SVG ICONS (Lucide Style)
   ═══════════════════════════════════════════════════════════════════ */
const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const BuildingIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <line x1="9" y1="12" x2="9.01" y2="12" />
    <line x1="15" y1="12" x2="15.01" y2="12" />
    <line x1="9" y1="16" x2="9.01" y2="16" />
    <line x1="15" y1="16" x2="15.01" y2="16" />
    <line x1="9" y1="8" x2="9.01" y2="8" />
    <line x1="15" y1="8" x2="15.01" y2="8" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const RotateCcwIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SEVERITY BADGE STYLES
   ═══════════════════════════════════════════════════════════════════ */
const getSeverityStyle = (severity) => {
  switch (severity) {
    case "Critical":
      return {
        backgroundColor: "#fee2e2",
        color: "#991b1b",
        border: "1px solid #fecaca",
      };
    case "Major":
      return {
        backgroundColor: "#ffedd5",
        color: "#9a3412",
        border: "1px solid #fed7aa",
      };
    case "Minor":
      return {
        backgroundColor: "#fef9c3",
        color: "#854d0e",
        border: "1px solid #fde047",
      };
    default:
      return {
        backgroundColor: "#f1f5f9",
        color: "#334155",
        border: "1px solid #e2e8f0",
      };
  }
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export default function CapaBoard() {
  const [capas, setCapas] = useState([]);
  const [loading, setLoading] = useState(true);

  /* GRACEFUL DEGRADATION: API FETCH */
  useEffect(() => {
    let mounted = true;
    const fetchCapas = async () => {
      try {
        const response = await fetch("https://api.acomed.tech/api/capa");
        if (!response.ok) throw new Error("API request failed");
        const data = await response.json();
        if (mounted) setCapas(Array.isArray(data) ? data : FALLBACK_MOCK_CAPAS);
      } catch {
        if (mounted) setCapas(FALLBACK_MOCK_CAPAS);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchCapas();
    return () => {
      mounted = false;
    };
  }, []);

  /* MOVE TO NEXT STAGE (cycles forward; loops back from CLOTUREE) */
  const advanceCapa = (id) => {
    setCapas((prev) =>
      prev.map((capa) => {
        if (capa.id !== id) return capa;
        const idx = COLUMNS.findIndex((c) => c.key === capa.status);
        if (idx === -1) return capa;
        const nextIdx = idx === COLUMNS.length - 1 ? 0 : idx + 1;
        return { ...capa, status: COLUMNS[nextIdx].key };
      })
    );
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100%" }}>
        <span className="text-muted" style={{ fontWeight: 500 }}>Chargement du board CAPA...</span>
      </div>
    );
  }

  return (
    <div style={{ padding: "0" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 className="text-heading" style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.025em" }}>
          CAPA Kanban Board
        </h1>
        <p className="text-muted" style={{ margin: "4px 0 0", fontSize: "0.875rem" }}>
          Suivi des actions correctives et préventives — ACOMED V2.0
        </p>
      </div>

      <div style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "8px" }}>
        {COLUMNS.map((col) => {
          const items = capas.filter((c) => c.status === col.key);

          return (
            <div
              key={col.key}
              style={{
                flexShrink: 0,
                width: "300px",
                backgroundColor: "#f1f5f9",
                borderRadius: "12px",
                border: "1px solid var(--color-border)",
                display: "flex",
                flexDirection: "column",
                maxHeight: "calc(100vh - 140px)",
              }}
            >
              {/* COLUMN HEADER */}
              <div
                style={{
                  padding: "16px",
                  borderBottom: "1px solid var(--color-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    color: "var(--color-text-primary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {col.label}
                </span>
                <span
                  style={{
                    backgroundColor: "#e2e8f0",
                    color: "var(--color-text-secondary)",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "2px 10px",
                    borderRadius: "999px",
                  }}
                >
                  {items.length}
                </span>
              </div>

              {/* CARDS LIST */}
              <div style={{ padding: "12px", overflowY: "auto", flex: 1 }}>
                {items.map((capa) => {
                  const severityStyle = getSeverityStyle(capa.severity);
                  const isClosed = capa.status === "CLOTUREE";

                  return (
                    <div
                      key={capa.id}
                      className="capa-card"
                      style={{
                        padding: "16px",
                        marginBottom: "12px",
                        transition: "transform 120ms ease, box-shadow 120ms ease",
                      }}
                    >
                      {/* Severity Badge */}
                      <div style={{ marginBottom: "10px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            fontSize: "0.6875rem",
                            fontWeight: 800,
                            padding: "2px 8px",
                            borderRadius: "4px",
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            ...severityStyle,
                          }}
                        >
                          {capa.severity}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-heading"
                        style={{
                          margin: 0,
                          fontSize: "0.9375rem",
                          fontWeight: 600,
                          lineHeight: 1.4,
                          marginBottom: "12px",
                        }}
                      >
                        {capa.title}
                      </h3>

                      {/* Facility */}
                      <div className="text-muted"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "0.8125rem",
                          marginBottom: "6px",
                        }}
                      >
                        <BuildingIcon />
                        <span>{capa.facilityName}</span>
                      </div>

                      {/* Due Date */}
                      <div className="text-muted"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "0.8125rem",
                          marginBottom: "14px",
                        }}
                      >
                        <CalendarIcon />
                        <span>
                          {new Date(capa.dueDate).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      {/* Footer: Avatar + Action */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          borderTop: "1px solid var(--color-border)",
                          paddingTop: "12px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div
                            style={{
                              width: "28px",
                              height: "28px",
                              borderRadius: "50%",
                              backgroundColor: "#4f46e5",
                              color: "#ffffff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {capa.assignee.initials}
                          </div>
                          <span className="text-muted"
                            style={{
                              fontSize: "0.8125rem",
                              fontWeight: 500,
                            }}
                          >
                            {capa.assignee.name}
                          </span>
                        </div>

                        <button
                          onClick={() => advanceCapa(capa.id)}
                          title={isClosed ? "Réouvrir la CAPA" : "Avancer au prochain statut"}
                          className="btn-standard"
                          style={{
                            padding: "6px 10px",
                            fontSize: "0.75rem",
                          }}
                        >
                          <span>{isClosed ? "Reopen" : "Next Stage"}</span>
                          {isClosed ? <RotateCcwIcon /> : <ArrowRightIcon />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
