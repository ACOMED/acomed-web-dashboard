import React from "react";

const IconCloudCheck = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    <path d="M9 14l2 2l4-4" />
  </svg>
);

const IconCloudAlert = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    <path d="M12 11v4" />
    <path d="M12 17h.01" />
  </svg>
);

const IconBuilding = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <path d="M9 22V12h6v10" />
    <path d="M9 6h.01M15 6h.01M9 10h.01M15 10h.01" />
  </svg>
);

const IconMapPin = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconChevronRight = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export default function FacilitiesList({ hospitals, onSelectHospital }) {
  return (
    <div style={{ padding: "0 24px 40px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 className="text-heading" style={{ margin: "0 0 6px 0", fontSize: "1.5rem", fontWeight: 700 }}>
          Liste des Établissements ({hospitals?.length || 0})
        </h1>
        <p className="text-muted" style={{ margin: 0, fontSize: "0.9375rem" }}>
          Supervision des audits en cours et de la conformité globale.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {hospitals?.map((hospital) => {
          // Synthetic mock data for UI visualization bridging missing hospital static fields
          const isSynced = hospital.id % 2 !== 0; // Odd ids are synced
          const completedAudits = hospital.id * 4;
          const totalAudits = 20;
          const progressPercentage = Math.min(100, Math.round((completedAudits / totalAudits) * 100));

          return (
            <div
              key={hospital.id}
              className="card"
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1fr 1fr 150px",
                gap: "20px",
                alignItems: "center",
                padding: "20px 24px",
                transition: "transform 0.2s ease, box-shadow 0.2s ease"
              }}
            >
              {/* 1. Facility Name & Location */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#10b981",
                  flexShrink: 0
                }}>
                  <IconBuilding />
                </div>
                <div>
                  <h3 className="text-heading" style={{ margin: "0 0 4px 0", fontSize: "1rem", fontWeight: 700 }}>
                    {hospital.name}
                  </h3>
                  <div className="text-muted" style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.8125rem", fontWeight: 500 }}>
                    <IconMapPin />
                    {hospital.city}, {hospital.region}
                  </div>
                </div>
              </div>

              {/* 2. Audit Progress */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", justifyContent: "center" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8125rem", fontWeight: 600 }}>
                  <span className="text-heading">{progressPercentage}% Terminé</span>
                  <span className="text-muted">{completedAudits}/{totalAudits} Audits</span>
                </div>
                <div style={{ width: "100%", height: "8px", backgroundColor: "var(--color-border)", borderRadius: "4px", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${progressPercentage}%`,
                      backgroundColor: "#10b981",
                      borderRadius: "4px",
                      transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
                    }}
                  />
                </div>
              </div>

              {/* 3. Sync Status */}
              <div style={{ display: "flex", alignItems: "center" }}>
                {isSynced ? (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 12px", borderRadius: "8px", backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#059669" }}>
                    <IconCloudCheck />
                    <span style={{ fontSize: "0.8125rem", fontWeight: 700 }}>Synchronisé</span>
                  </div>
                ) : (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 12px", borderRadius: "8px", backgroundColor: "rgba(245, 158, 11, 0.1)", color: "#d97706" }}>
                    <IconCloudAlert />
                    <span style={{ fontSize: "0.8125rem", fontWeight: 700 }}>Attente de Synchro</span>
                  </div>
                )}
              </div>

              {/* 4. Actions */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  className="btn-primary"
                  onClick={() => onSelectHospital(hospital)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "10px 16px",
                    borderRadius: "10px",
                    border: "1px solid #10b981",
                    background: "linear-gradient(180deg, #10b981 0%, #059669 100%)",
                    color: "#ffffff",
                    fontWeight: "700",
                    fontSize: "14px",
                    cursor: "pointer",
                    boxShadow: "0 4px 15px rgba(16, 185, 129, 0.5)",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(16, 185, 129, 0.8)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.filter = "brightness(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(16, 185, 129, 0.5)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.filter = "brightness(1)";
                  }}
                >
                  Tableau de bord
                  <IconChevronRight />
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
