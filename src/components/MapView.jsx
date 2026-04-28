import { useState, useCallback } from "react";
import { HOSPITALS, getScoreColor, getAccreditationColor } from "../data/hospitalData";
import { useMockData } from "../context/MockDataContext";
import { useTheme } from "../context/ThemeContext";

/* ── Inline SVG Icons ──────────────────────────────────────────────────────────── */
const IcoPlus = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const IcoX = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

/* ── Add Facility Modal ────────────────────────────────────────────────────────── */
const MODAL_OVERLAY_STYLE = {
  position: "fixed", inset: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  backdropFilter: "blur(4px)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 9999,
};

const MODAL_CARD_STYLE = {
  width: "100%", maxWidth: "480px",
  borderRadius: "0.75rem",
  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
  padding: "2rem",
  position: "relative",
};

const FIELD_LABEL_STYLE = {
  display: "block", fontSize: "0.75rem",
  fontWeight: "600", marginBottom: "0.35rem",
};

const FIELD_INPUT_STYLE = {
  width: "100%", padding: "0.6rem 0.75rem",
  borderRadius: "0.5rem", border: "1px solid",
  fontSize: "0.875rem", outline: "none",
  transition: "border-color 0.2s",
  fontFamily: "inherit",
};

function AddFacilityModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({ name: "", region: "", type: "" });

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit(form);
    setForm({ name: "", region: "", type: "" });
    onClose();
  };

  if (!isOpen) return null;

  const cardBg = "#ffffff";
  const inputBg = "#ffffff";
  const inputBorder = "var(--color-border)";
  const labelColor = "var(--color-text-secondary)";
  const textColor = "var(--color-text-primary)";

  return (
    <div style={MODAL_OVERLAY_STYLE} onClick={onClose}>
      <div
        style={{ ...MODAL_CARD_STYLE, backgroundColor: cardBg, color: textColor }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "1rem", right: "1rem",
            background: "none", border: "none", cursor: "pointer",
            color: labelColor, padding: "4px",
          }}
        >
          <IcoX style={{ width: "1.2rem", height: "1.2rem" }} />
        </button>

        <h2 style={{ fontSize: "1.15rem", fontWeight: "700", marginBottom: "1.5rem" }}>
          Ajouter un Etablissement
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ ...FIELD_LABEL_STYLE, color: labelColor }}>Nom *</label>
            <input
              style={{ ...FIELD_INPUT_STYLE, backgroundColor: inputBg, borderColor: inputBorder, color: textColor }}
              value={form.name}
              onChange={handleChange("name")}
              placeholder="Ex: Hopital Hassan II"
              required
            />
          </div>
          <div>
            <label style={{ ...FIELD_LABEL_STYLE, color: labelColor }}>Region</label>
            <input
              style={{ ...FIELD_INPUT_STYLE, backgroundColor: inputBg, borderColor: inputBorder, color: textColor }}
              value={form.region}
              onChange={handleChange("region")}
              placeholder="Ex: Souss-Massa"
            />
          </div>
          <div>
            <label style={{ ...FIELD_LABEL_STYLE, color: labelColor }}>Type</label>
            <select
              style={{ ...FIELD_INPUT_STYLE, backgroundColor: inputBg, borderColor: inputBorder, color: textColor }}
              value={form.type}
              onChange={handleChange("type")}
            >
              <option value="">Selectionner un type...</option>
              <option value="Hopital Regional">Hopital Regional</option>
              <option value="Hopital Prefectoral">Hopital Prefectoral</option>
              <option value="Polyclinique">Polyclinique</option>
              <option value="Centre de Sante">Centre de Sante</option>
              <option value="Clinique Privee">Clinique Privee</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "0.6rem 1.25rem", borderRadius: "0.5rem",
                border: `1px solid ${inputBorder}`,
                background: "none", cursor: "pointer",
                fontSize: "0.875rem", fontWeight: "600",
                color: labelColor, fontFamily: "inherit",
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              style={{
                padding: "0.6rem 1.25rem", borderRadius: "0.5rem",
                border: "none", background: "#6366f1",
                color: "white", cursor: "pointer",
                fontSize: "0.875rem", fontWeight: "600",
                fontFamily: "inherit",
              }}
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Main MapView Component ────────────────────────────────────────────────────── */
// `hospitals` prop = live API data; falls back to static mock when not provided
export default function MapView({ hospitals, onSelectHospital }) {
  const displayHospitals = hospitals && hospitals.length > 0 ? hospitals : HOSPITALS;
  const [hoveredId, setHoveredId] = useState(null);
  const [facilityModalOpen, setFacilityModalOpen] = useState(false);
  const { addFacility } = useMockData();

  const handlePinClick = useCallback(
    (hospital) => onSelectHospital(hospital),
    [onSelectHospital]
  );

  return (
    <div className="map-view">
      <div className="map-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 className="map-title">Carte des Hopitaux -- Agadir</h1>
          <p className="map-subtitle">
            Selectionnez un etablissement pour consulter son rapport de conformite
          </p>
        </div>
        <button
          className="inspectors-add-btn"
          onClick={() => setFacilityModalOpen(true)}
          style={{ flexShrink: 0 }}
        >
          <IcoPlus style={{ width: "1rem", height: "1rem" }} />
          Ajouter Facility
        </button>
      </div>

      <div className="map-wrapper">
        <div className="map-container">
          <svg className="map-svg" viewBox="0 0 1000 650" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e40af" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.10" />
              </linearGradient>
              <linearGradient id="beachGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.04" />
              </linearGradient>
            </defs>

            {/* Ocean */}
            <path d="M0,0 L370,0 Q330,120 290,260 Q260,380 290,490 Q310,570 360,650 L0,650 Z" className="map-ocean" fill="url(#oceanGradient)" />

            {/* Beach strip */}
            <path d="M370,0 Q330,120 290,260 Q260,380 290,490 Q310,570 360,650 L400,650 Q340,570 320,490 Q290,380 320,260 Q350,120 400,0 Z" fill="url(#beachGradient)" />

            {/* Coastline */}
            <path d="M370,0 Q330,120 290,260 Q260,380 290,490 Q310,570 360,650" className="map-coastline" />

            {/* Roads */}
            <line x1="380" y1="120" x2="980" y2="120" className="map-highway" />
            <text x="960" y="112" className="map-road-label">N1</text>
            <line x1="480" y1="120" x2="750" y2="500" className="map-highway" />
            <text x="755" y="495" className="map-road-label">N8</text>
            <line x1="370" y1="310" x2="900" y2="310" className="map-road" />
            <line x1="520" y1="0" x2="520" y2="650" className="map-road" />
            <line x1="680" y1="120" x2="680" y2="650" className="map-road" />
            <line x1="370" y1="480" x2="900" y2="480" className="map-road" />

            {/* Zones */}
            <circle cx="520" cy="210" r="90" className="map-zone" />
            <text x="520" y="215" className="map-zone-label">Agadir Centre</text>
            <circle cx="720" cy="440" r="75" className="map-zone" />
            <text x="720" y="445" className="map-zone-label">Inezgane</text>
            <circle cx="380" cy="370" r="60" className="map-zone" />
            <text x="380" y="375" className="map-zone-label">Anza</text>
            <circle cx="620" cy="160" r="50" className="map-zone" />
            <text x="620" y="165" className="map-zone-label">Hay Mohammadi</text>

            {/* Port */}
            <rect x="340" y="220" width="50" height="40" rx="4" className="map-port" />
            <text x="365" y="245" className="map-zone-label" fontSize="9">Port</text>

            {/* Compass */}
            <g transform="translate(920, 580)">
              <circle r="22" className="map-compass-bg" />
              <text y="-8" className="map-compass-letter">N</text>
              <line x1="0" y1="-5" x2="0" y2="5" className="map-compass-line" />
              <line x1="-5" y1="0" x2="5" y2="0" className="map-compass-line" />
              <polygon points="0,-16 -4,-8 4,-8" className="map-compass-arrow" />
            </g>

            {/* Ocean label */}
            <text x="140" y="350" className="map-ocean-label" transform="rotate(-75, 140, 350)">
              Ocean Atlantique
            </text>
          </svg>

          {/* Hospital pins */}
          {displayHospitals.map((hospital) => (
            <div
              key={hospital.id}
              className="map-pin-wrapper"
              style={{ left: hospital.pinPosition.x, top: hospital.pinPosition.y }}
              onMouseEnter={() => setHoveredId(hospital.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handlePinClick(hospital)}
              role="button"
              tabIndex={0}
              aria-label={`Voir les details de ${hospital.name}`}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handlePinClick(hospital); }}
            >
              <span className="map-pin-pulse" />
              <span className="map-pin-pulse map-pin-pulse-delayed" />

              <svg className="map-pin-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
              </svg>

              <span className="map-pin-name">{hospital.name}</span>

              <div className={`map-pin-card ${hoveredId === hospital.id ? "map-pin-card-visible" : ""}`}>
                <div className="map-pin-card-arrow" />
                <span className="map-pin-card-type">{hospital.type}</span>
                <span className="map-pin-card-hospital">{hospital.name}</span>
                <div className="map-pin-card-score-row">
                  <span className="map-pin-card-score" style={{ color: getScoreColor(hospital.globalScore) }}>
                    {hospital.globalScore}%
                  </span>
                  <span className="map-pin-card-score" style={{ color: getScoreColor(hospital.scoreConformite) }}>
                    {hospital.scoreConformite}%
                  </span>
                </div>
                <span className="map-pin-card-cta">Cliquez pour les details</span>
              </div>
            </div>
          ))}
        </div>

        <div className="map-legend">
          <span className="map-legend-title">Legende</span>
          <div className="map-legend-item"><span className="map-legend-dot map-legend-dot-green" /><span>Score &ge; 85%</span></div>
          <div className="map-legend-item"><span className="map-legend-dot map-legend-dot-blue" /><span>Score 70-84%</span></div>
          <div className="map-legend-item"><span className="map-legend-dot map-legend-dot-amber" /><span>Score 50-69%</span></div>
          <div className="map-legend-item"><span className="map-legend-dot map-legend-dot-red" /><span>Score &lt; 50%</span></div>
        </div>
      </div>

      {/* ── Add Facility Modal ── */}
      <AddFacilityModal
        isOpen={facilityModalOpen}
        onClose={() => setFacilityModalOpen(false)}
        onSubmit={addFacility}
      />
    </div>
  );
}
