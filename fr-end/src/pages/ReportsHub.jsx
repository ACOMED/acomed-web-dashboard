import React, { useState } from 'react';

export default function ReportsHub() {
  const [dateRange, setDateRange]   = useState('last30');
  const [facility, setFacility]     = useState('all');
  const [reportType, setReportType] = useState('compliance');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated]   = useState(false);

  const dateLabels = {
    last30:   'May 4, 2025 – Jun 2, 2025',
    quarter:  'Apr 1, 2025 – Jun 30, 2025',
    ytd:      'Jan 1, 2025 – Jun 2, 2025',
    custom:   'Plage personnalisée',
  };

  const facilityLabels = {
    all:      'All accessible facilities',
    stlouis:  'Hôpital Saint-Louis',
    alpes:    'Clinique des Alpes',
  };

  const typeLabels = {
    compliance: 'Summary of compliance metrics',
    capa:       'All open and closed CAPAs',
    maturity:   'Maturity progression over time',
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 1800);
  };

  return (
    <div className="dashboard rh-page">

      {/* ── Page Header ── */}
      <div className="rh-header">
        <div className="rh-header-text">
          <h1 className="rh-title">Global Reports Hub</h1>
          <p className="rh-subtitle">Generate and export aggregated system data with advanced filtering.</p>
        </div>
        <div className="rh-header-visual" aria-hidden="true">
          {/* decorative SVG illustration */}
          <svg viewBox="0 0 220 120" width="220" height="120" fill="none">
            {/* Globe */}
            <circle cx="170" cy="58" r="44" fill="#e8eeff" stroke="#c7d2fe" strokeWidth="1.5"/>
            <ellipse cx="170" cy="58" rx="22" ry="44" stroke="#c7d2fe" strokeWidth="1.2" fill="none"/>
            <line x1="126" y1="58" x2="214" y2="58" stroke="#c7d2fe" strokeWidth="1.2"/>
            <line x1="132" y1="38" x2="208" y2="38" stroke="#c7d2fe" strokeWidth="1"/>
            <line x1="132" y1="78" x2="208" y2="78" stroke="#c7d2fe" strokeWidth="1"/>
            {/* Document */}
            <rect x="14" y="20" width="68" height="80" rx="8" fill="#fff" stroke="#dbe4ff" strokeWidth="1.5"/>
            <rect x="22" y="32" width="40" height="5" rx="2" fill="#bfdbfe"/>
            <rect x="22" y="43" width="52" height="4" rx="2" fill="#e5e7eb"/>
            <rect x="22" y="53" width="44" height="4" rx="2" fill="#e5e7eb"/>
            <rect x="22" y="65" width="52" height="20" rx="4" fill="#eff6ff" stroke="#bfdbfe"/>
            {/* Bar chart inside doc */}
            <rect x="26" y="76" width="6" height="6" rx="1" fill="#6366f1"/>
            <rect x="35" y="72" width="6" height="10" rx="1" fill="#3b82f6"/>
            <rect x="44" y="68" width="6" height="14" rx="1" fill="#60a5fa"/>
            <rect x="53" y="74" width="6" height="8" rx="1" fill="#93c5fd"/>
            {/* Check badge */}
            <circle cx="75" cy="24" r="12" fill="#dcfce7" stroke="#86efac" strokeWidth="1.5"/>
            <polyline points="69,24 73,28 81,19" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Red dot on globe */}
            <circle cx="148" cy="36" r="5" fill="#fca5a5" stroke="#ef4444" strokeWidth="1.2"/>
          </svg>
        </div>
      </div>

      {/* ── Report Filters Card ── */}
      <div className="rh-card">
        <div className="rh-card-head">
          <div className="rh-card-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="#6366f1" strokeWidth="2" fill="none">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
          </div>
          <div>
            <div className="rh-card-title">Filtres de rapport</div>
            <div className="rh-card-sub">Configurez les paramètres de votre rapport</div>
          </div>
        </div>

        <div className="rh-filters-row">
          {/* Date Range */}
          <div className="rh-filter-group">
            <label className="rh-filter-label">
              <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2" fill="none" style={{marginRight:4}}>
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Plage de dates
            </label>
            <select className="rh-select" value={dateRange} onChange={e => { setDateRange(e.target.value); setGenerated(false); }}>
              <option value="last30">30 derniers jours</option>
              <option value="quarter">Dernier trimestre</option>
              <option value="ytd">Depuis le début de l'année</option>
              <option value="custom">Plage personnalisée...</option>
            </select>
            <span className="rh-filter-hint">{dateLabels[dateRange]}</span>
          </div>

          {/* Facility */}
          <div className="rh-filter-group">
            <label className="rh-filter-label">
              <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2" fill="none" style={{marginRight:4}}>
                <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
              Établissement
            </label>
            <select className="rh-select" value={facility} onChange={e => { setFacility(e.target.value); setGenerated(false); }}>
              <option value="all">Tous les établissements</option>
              <option value="stlouis">Hôpital Saint-Louis</option>
              <option value="alpes">Clinique des Alpes</option>
            </select>
            <span className="rh-filter-hint">{facilityLabels[facility]}</span>
          </div>

          {/* Report Type */}
          <div className="rh-filter-group">
            <label className="rh-filter-label">
              <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2" fill="none" style={{marginRight:4}}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              Type de rapport
            </label>
            <select className="rh-select" value={reportType} onChange={e => { setReportType(e.target.value); setGenerated(false); }}>
              <option value="compliance">Résumé de conformité</option>
              <option value="capa">Toutes les CAPAs (état)</option>
              <option value="maturity">Progression de maturité</option>
            </select>
            <span className="rh-filter-hint">{typeLabels[reportType]}</span>
          </div>

          {/* Generate Button */}
          <div className="rh-filter-group rh-generate-col">
            <button className="rh-btn-generate" onClick={handleGenerate} disabled={generating}>
              {generating ? (
                <>
                  <span className="rh-spinner" />
                  Génération...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2.5" fill="none">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Générer CSV/PDF
                </>
              )}
            </button>
            <span className="rh-secure-note">
              <svg viewBox="0 0 24 24" width="11" height="11" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Export sécurisé • Données chiffrées
            </span>
          </div>
        </div>
      </div>

      {/* ── Report Preview Card ── */}
      <div className="rh-card">
        <div className="rh-card-head">
          <div className="rh-card-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="#6366f1" strokeWidth="2" fill="none">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <div>
            <div className="rh-card-title">Aperçu du rapport</div>
            <div className="rh-card-sub">Prévisualisez vos données avant l'export</div>
          </div>
        </div>

        <div className="rh-preview-area">
          {generated ? (
            <div className="rh-preview-filled">
              <div className="rh-preview-table-head">
                <span>Établissement</span>
                <span>Score conformité</span>
                <span>Score maturité</span>
                <span>CAPAs ouvertes</span>
                <span>Statut</span>
              </div>
              {[
                ['Hôpital Saint-Louis', '92%', '78%', '1', 'Conforme'],
                ['Clinique des Alpes',  '81%', '65%', '3', 'En révision'],
                ['Centre Médical Nord', '88%', '72%', '0', 'Conforme'],
              ].map(([name, comp, mat, capa, status], i) => (
                <div key={i} className="rh-preview-row">
                  <span>{name}</span>
                  <span className="rh-score-pill blue">{comp}</span>
                  <span className="rh-score-pill teal">{mat}</span>
                  <span>{capa}</span>
                  <span className={`rh-status-badge ${status === 'Conforme' ? 'green' : 'amber'}`}>{status}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rh-preview-empty">
              <div className="rh-preview-icon">
                <svg viewBox="0 0 24 24" width="32" height="32" stroke="#a5b4fc" strokeWidth="1.5" fill="none">
                  <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </div>
              <p className="rh-empty-title">L'aperçu de votre rapport apparaîtra ici</p>
              <p className="rh-empty-sub">Sélectionnez vos filtres ci-dessus et cliquez sur &ldquo;Générer CSV/PDF&rdquo; pour prévisualiser les données.</p>

              <div className="rh-features-row">
                <div className="rh-feature-pill">
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="#6366f1" strokeWidth="2" fill="none">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  <div>
                    <div className="rh-pill-title">Sécurisé & Conforme</div>
                    <div className="rh-pill-sub">Données chiffrées et sécurisées</div>
                  </div>
                </div>
                <div className="rh-feature-pill">
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="#6366f1" strokeWidth="2" fill="none">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                  <div>
                    <div className="rh-pill-title">Génération rapide</div>
                    <div className="rh-pill-sub">Rapports générés en quelques secondes</div>
                  </div>
                </div>
                <div className="rh-feature-pill">
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="#6366f1" strokeWidth="2" fill="none">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  <div>
                    <div className="rh-pill-title">Formats multiples</div>
                    <div className="rh-pill-sub">Export CSV ou PDF</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
