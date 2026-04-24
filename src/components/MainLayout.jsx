import { useState, useCallback } from "react";
import Sidebar from "./Sidebar";
import MapView from "./MapView";
import StatsView from "./StatsView";
import InspectorsView from "./InspectorsView";
import { useTheme } from "../context/ThemeContext";
import { HOSPITALS, NATIONAL_AVERAGE } from "../data/hospitalData";
import PreAuditTools from './PreAuditTools';

// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║  MAIN COMPONENT  (static mock-data mode — no API calls)                    ║
// ╚══════════════════════════════════════════════════════════════════════════════╝
export default function MainLayout({ onLogout }) {
  const { darkMode } = useTheme();

  /* ── UI state ────────────────────────────────────────────────────────────── */
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [currentView, setCurrentView] = useState("map");
  const [selectedHospital, setSelectedHospital] = useState(null);

  /* ── Navigation callbacks ────────────────────────────────────────────────── */
  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const handleNavigate = useCallback((pageId) => {
    setActivePage(pageId);
    if (pageId === "dashboard") {
      setCurrentView("map");
      setSelectedHospital(null);
    }
  }, []);

  const handleSelectHospital = useCallback((hospital) => {
    setSelectedHospital(hospital);
    setCurrentView("stats");
  }, []);

  const handleBackToMap = useCallback(() => {
    setCurrentView("map");
    setSelectedHospital(null);
  }, []);

  /* ── Derived: current page title ─────────────────────────────────────────── */
  const pageTitle =
    activePage === "dashboard" ? "Tableau de Bord"
      : activePage === "pre_audit" ? "Checklists Pré-Audit"
        : activePage === "capa" ? "Gestion des CAPA"
          : activePage === "inspectors" ? "Inspecteurs"
            : "Historique";

  const today = new Date().toLocaleDateString("fr-MA", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  /* ── Render ──────────────────────────────────────────────────────────────── */
  return (
    <div className="app-layout">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        activePage={activePage}
        onNavigate={handleNavigate}
        onLogout={onLogout}
      />

      <div className="main-panel">
        {/* ── Top Bar ──────────────────────────────────────────────────────── */}
        <header className="topbar">
          <div className="topbar-left">
            <button className="topbar-hamburger" onClick={openSidebar} aria-label="Open menu">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="topbar-title-group">
              <h2 className="topbar-title">{pageTitle}</h2>
              <span className="topbar-breadcrumb">
                ACOMED
                {currentView === "stats" && selectedHospital
                  ? ` / ${selectedHospital.name}`
                  : ""}
              </span>
            </div>
          </div>

          <div className="topbar-right">
            {/* Static data indicator */}
            <div className="topbar-api-status">
              <span className="api-status-dot api-status-ok" title="Données statiques (mode démo)" />
              <span className="topbar-api-label">{HOSPITALS.length} hôpitaux</span>
            </div>

            <span className="topbar-date">{today}</span>
            <div className="topbar-avatar">A</div>
          </div>
        </header>

        {/* ── Content Area ─────────────────────────────────────────────────── */}
        <main className="content-area">

          {/* ── Dashboard page ──────────────────────────────────────────────── */}
          {activePage === "dashboard" && (
            <>
              {/* Map view — pass static HOSPITALS list */}
              {currentView === "map" && (
                <MapView
                  onSelectHospital={handleSelectHospital}
                  hospitals={HOSPITALS}
                  summaryData={null}
                />
              )}

              {/* Stats view */}
              {currentView === "stats" && selectedHospital && (
                <StatsView
                  hospital={selectedHospital}
                  onBack={handleBackToMap}
                />
              )}
            </>
          )}

          {/* ── Inspecteurs page ─────────────────────────────────────────────── */}
          {activePage === "inspectors" && <InspectorsView />}

          {/* ── Pré-Audit placeholder ────────────────────────────────────────── */}
          {activePage === "pre_audit" && <PreAuditTools />}

          {/* ── CAPA placeholder ──────────────────────────────────────────── */}
          {activePage === "capa" && (
            <div className="placeholder-view">
              <span className="placeholder-icon">🛠️</span>
              <h2 className="placeholder-title">Gestion des CAPA</h2>
              <p className="placeholder-text">Tableau Kanban (À faire → En cours → Clôturée) pour le suivi des actions correctives.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
