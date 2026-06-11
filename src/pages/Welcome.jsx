import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      <div className="welcome-bg">
        <div className="bg-orb-nav"></div>
        <div className="bg-orb-hero"></div>
      </div>

      <header className="welcome-nav">
        <div className="nav-brand">
          <img src="/logo.png" alt="ACOMED logo" />
        </div>

        <nav className="nav-center">
          <a href="#features">Fonctionnalités</a>
          <a href="#pricing">Tarifs</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="nav-actions">
          <button className="nav-link" onClick={() => navigate('/login')}>
            Sign In
          </button>
          <button className="nav-btn-solid">
            Request Demo
          </button>
        </div>
      </header>

      <div className="top-section-wrapper">
        <main className="welcome-hero">
          <div className="hero-copy">
            <span className="hero-kicker">'Offline-First'</span>
            <h1>Audit Anywhere,<br/>Sync Everywhere.</h1>
            <p>
              Our robust, offline-first logic engine ensures healthcare
              compliance in any environment. Capture data, complete audits,
              and sync seamlessly.
            </p>
          </div>

          <div className="hero-media">
            <img
              src="/mobile_desktop_without_bg.png"
              alt="Mobile and desktop audit experience"
            />
          </div>
        </main>
      </div>

      <section className="feature-strip">
        <div className="feature-card card-cyan">
          <div className="feature-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h3>Audit Engine</h3>
          <p>Flexible, configurable audit tools for any workflow</p>
        </div>
        <div className="feature-card card-blue">
          <div className="feature-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.92-10.26l5.43 3.27"/>
            </svg>
          </div>
          <h3>Sync Manager</h3>
          <p>Reliable data synchronization, even with intermittent connectivity</p>
        </div>
        <div className="feature-card card-purple">
          <div className="feature-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <path d="M3 9h18M9 21V9"/>
            </svg>
          </div>
          <h3>Scoring Engine</h3>
          <p>Automated, real-time scoring and risk assessment</p>
        </div>
        <div className="feature-card card-pink">
          <div className="feature-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <polyline points="16 6 12 2 8 6"/>
              <line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
          </div>
          <h3>CAPA Workflow</h3>
          <p>Integrated Corrective & Preventive Action tracking</p>
        </div>
      </section>

      <section id="features" className="modern-section">
        <div className="section-head">
          <h2 className="section-title">Pilotage Complet des Audits</h2>
          <p className="section-subtitle">
            Une plateforme robuste pour l'évaluation de conformité et de maturité dans le secteur médical
          </p>
        </div>
        <div className="features-grid">
          <div className="feature-box">
            <div className="feature-number">01</div>
            <h3>Exécution Terrain Offline-First</h3>
            <p>Réalisez des audits même avec une connectivité faible ou intermittente. Synchronisation automatique dès le retour en ligne.</p>
          </div>
          <div className="feature-box">
            <div className="feature-number">02</div>
            <h3>Évaluation Structurée</h3>
            <p>Moteur de logique conditionnelle pour afficher ou masquer des questions selon des prérequis définis.</p>
          </div>
          <div className="feature-box">
            <div className="feature-number">03</div>
            <h3>Double Scoring</h3>
            <p>Mesure séparée de la conformité réglementaire et de la maturité opérationnelle pour une vision complète.</p>
          </div>
          <div className="feature-box">
            <div className="feature-number">04</div>
            <h3>Gestion des CAPA</h3>
            <p>Transformation des non-conformités en Actions Correctives et Préventives avec suivi rigoureux.</p>
          </div>
          <div className="feature-box">
            <div className="feature-number">05</div>
            <h3>Multi-Tenant Sécurisé</h3>
            <p>Gestion isolée de plusieurs établissements avec sécurité et traçabilité complète des données.</p>
          </div>
          <div className="feature-box">
            <div className="feature-number">06</div>
            <h3>Outils de Pré-Audit</h3>
            <p>Checklists et guides de préparation pour l'auto-évaluation avant l'audit officiel.</p>
          </div>
        </div>
      </section>

      <section id="pricing" className="pricing-section">
        <div className="section-head">
          <h2 className="section-title">Tarification Transparente</h2>
          <p className="section-subtitle">Choisissez le plan adapté à votre établissement</p>
        </div>
        <div className="pricing-cards">
          <div className="p-card">
            <div className="p-header">
              <h4>Essentiel</h4>
              <div className="p-price">€99<span>/mois</span></div>
              <p className="p-desc">Pour les petites structures</p>
            </div>
            <ul className="p-features">
              <li><svg viewBox="0 0 20 20"><path d="M16 5L8 13l-4-4" stroke="currentColor" strokeWidth="2" fill="none"/></svg> Audits offline-first</li>
              <li><svg viewBox="0 0 20 20"><path d="M16 5L8 13l-4-4" stroke="currentColor" strokeWidth="2" fill="none"/></svg> 1 établissement</li>
              <li><svg viewBox="0 0 20 20"><path d="M16 5L8 13l-4-4" stroke="currentColor" strokeWidth="2" fill="none"/></svg> 5 templates d'audit</li>
              <li><svg viewBox="0 0 20 20"><path d="M16 5L8 13l-4-4" stroke="currentColor" strokeWidth="2" fill="none"/></svg> Support email</li>
            </ul>
            <button className="btn-outline">Choisir Essentiel</button>
          </div>
          
          <div className="p-card featured">
            <div className="p-badge">Recommandé</div>
            <div className="p-header">
              <h4>Professionnel</h4>
              <div className="p-price">€299<span>/mois</span></div>
              <p className="p-desc">Pour les réseaux de santé</p>
            </div>
            <ul className="p-features">
              <li><svg viewBox="0 0 20 20"><path d="M16 5L8 13l-4-4" stroke="currentColor" strokeWidth="2" fill="none"/></svg> Tout de l'Essentiel</li>
              <li><svg viewBox="0 0 20 20"><path d="M16 5L8 13l-4-4" stroke="currentColor" strokeWidth="2" fill="none"/></svg> Multi-tenant (5 établissements)</li>
              <li><svg viewBox="0 0 20 20"><path d="M16 5L8 13l-4-4" stroke="currentColor" strokeWidth="2" fill="none"/></svg> Templates illimités</li>
              <li><svg viewBox="0 0 20 20"><path d="M16 5L8 13l-4-4" stroke="currentColor" strokeWidth="2" fill="none"/></svg> Gestion CAPA complète</li>
              <li><svg viewBox="0 0 20 20"><path d="M16 5L8 13l-4-4" stroke="currentColor" strokeWidth="2" fill="none"/></svg> Double scoring</li>
            </ul>
            <button className="btn-primary">Choisir Professionnel</button>
          </div>
          
          <div className="p-card">
            <div className="p-header">
              <h4>Enterprise</h4>
              <div className="p-price">Sur mesure</div>
              <p className="p-desc">Pour les grands groupes hospitaliers</p>
            </div>
            <ul className="p-features">
              <li><svg viewBox="0 0 20 20"><path d="M16 5L8 13l-4-4" stroke="currentColor" strokeWidth="2" fill="none"/></svg> Tout du Professionnel</li>
              <li><svg viewBox="0 0 20 20"><path d="M16 5L8 13l-4-4" stroke="currentColor" strokeWidth="2" fill="none"/></svg> Établissements illimités</li>
              <li><svg viewBox="0 0 20 20"><path d="M16 5L8 13l-4-4" stroke="currentColor" strokeWidth="2" fill="none"/></svg> API personnalisée</li>
              <li><svg viewBox="0 0 20 20"><path d="M16 5L8 13l-4-4" stroke="currentColor" strokeWidth="2" fill="none"/></svg> Support dédié 24/7</li>
              <li><svg viewBox="0 0 20 20"><path d="M16 5L8 13l-4-4" stroke="currentColor" strokeWidth="2" fill="none"/></svg> Formation sur site</li>
            </ul>
            <button className="btn-outline">Nous contacter</button>
          </div>
        </div>
      </section>

      <style>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        html, body {
          overflow: hidden;
          height: 100vh;
          margin: 0;
          padding: 0;
        }

        .welcome-page {
          height: 100vh;
          overflow-y: auto;
          overflow-x: hidden;
          background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%);
          color: #0f172a;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
          display: flex;
          flex-direction: column;
          position: relative;
          scroll-behavior: smooth;
        }

        .welcome-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .bg-orb-nav {
          position: absolute;
          top: -10%;
          left: 5%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.15), rgba(59, 130, 246, 0.1) 40%, transparent 70%);
          filter: blur(60px);
          animation: float 20s ease-in-out infinite;
        }

        .bg-orb-hero {
          position: absolute;
          top: 20%;
          right: 10%;
          width: 700px;
          height: 700px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.12), rgba(59, 130, 246, 0.08) 40%, transparent 70%);
          filter: blur(80px);
          animation: float 25s ease-in-out infinite reverse;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        .top-section-wrapper {
          position: relative;
          z-index: 1;
          padding-top: 40px;
          padding-bottom: 60px;
        }

        /* NAVBAR */
        .welcome-nav {
          position: sticky;
          top: 24px;
          margin: 24px auto 0;
          width: min(1200px, 92vw);
          padding: 16px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 8px 32px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.05);
          backdrop-filter: blur(20px) saturate(180%);
          z-index: 100;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .welcome-nav:hover {
          background: rgba(255, 255, 255, 0.85);
          box-shadow: 0 12px 40px rgba(15, 23, 42, 0.12), 0 2px 6px rgba(15, 23, 42, 0.08);
        }

        .nav-brand img {
          height: 32px;
          display: block;
          transition: transform 0.3s ease;
        }

        .nav-brand img:hover {
          transform: scale(1.05);
        }

        .nav-center {
          display: flex;
          align-items: center;
          gap: 40px;
          font-size: 15px;
          font-weight: 500;
          color: #475569;
        }

        .nav-center a {
          text-decoration: none;
          color: inherit;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.3s ease;
          position: relative;
          padding: 8px 0;
        }

        .nav-center a::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          transition: width 0.3s ease;
        }

        .nav-center a:hover {
          color: #0f172a;
        }

        .nav-center a:hover::after {
          width: 100%;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .nav-link {
          background: transparent;
          border: 0;
          color: #475569;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 8px 16px;
          border-radius: 8px;
        }

        .nav-link:hover {
          color: #0f172a;
          background: rgba(15, 23, 42, 0.05);
        }

        .nav-btn-solid {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: #fff;
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .nav-btn-solid:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }

        .nav-btn-solid:active {
          transform: translateY(0);
        }

        /* HERO */
        .welcome-hero {
          width: min(1200px, 92vw);
          margin: 60px auto 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 40px;
        }

        .hero-copy {
          max-width: 540px;
        }

        .hero-kicker {
          color: rgba(15, 23, 42, 0.6);
          font-size: 20px;
          font-weight: 500;
          display: block;
          margin-bottom: 12px;
          letter-spacing: 0.5px;
        }

        .hero-copy h1 {
          margin: 0 0 24px;
          font-size: clamp(40px, 5vw, 56px);
          font-weight: 700;
          line-height: 1.1;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .hero-copy p {
          margin: 0;
          font-size: 17px;
          line-height: 1.6;
          color: rgba(15, 23, 42, 0.7);
        }

        .hero-media {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .hero-media img {
          width: 100%;
          max-width: 600px;
          height: auto;
          display: block;
        }

        /* FEATURE STRIP */
        .feature-strip {
          width: min(1200px, 92vw);
          margin: 80px auto;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 24px;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 32px 28px;
          position: relative;
          overflow: hidden;
          min-height: 180px;
          border: 1px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 8px 32px rgba(15, 23, 42, 0.06);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 48px rgba(15, 23, 42, 0.12);
          border-color: rgba(255, 255, 255, 1);
        }

        .feature-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 2px;
          background: linear-gradient(135deg, transparent 0%, var(--gradient) 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .feature-card:hover::before {
          opacity: 1;
        }

        .card-cyan { --gradient: linear-gradient(135deg, #06b6d4, #3b82f6); }
        .card-blue { --gradient: linear-gradient(135deg, #3b82f6, #8b5cf6); }
        .card-purple { --gradient: linear-gradient(135deg, #8b5cf6, #d946ef); }
        .card-pink { --gradient: linear-gradient(135deg, #ec4899, #f43f5e); }

        .feature-icon {
          width: 56px;
          height: 56px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          position: relative;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.6));
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
          transition: all 0.3s ease;
        }

        .feature-card:hover .feature-icon {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }

        .feature-icon svg {
          width: 24px;
          height: 24px;
        }
        
        .card-cyan .feature-icon svg { color: #06b6d4; }
        .card-blue .feature-icon svg { color: #3b82f6; }
        .card-purple .feature-icon svg { color: #8b5cf6; }
        .card-pink .feature-icon svg { color: #ec4899; }

        .feature-card h3 {
          margin: 0 0 12px;
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.01em;
        }

        .feature-card p {
          margin: 0;
          font-size: 14px;
          line-height: 1.6;
          color: #64748b;
        }

        /* MODERN SECTIONS */
        .modern-section {
          width: min(1200px, 92vw);
          margin: 120px auto;
        }

        .section-head {
          text-align: center;
          margin-bottom: 72px;
        }

        .section-title {
          font-size: 48px;
          font-weight: 800;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 20px;
          line-height: 1.1;
        }

        .section-subtitle {
          font-size: 19px;
          color: #64748b;
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.7;
          font-weight: 400;
        }

        /* FEATURES GRID */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .feature-box {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          padding: 40px 36px;
          border: 1px solid rgba(255, 255, 255, 0.8);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .feature-box::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s ease;
        }

        .feature-box:hover {
          transform: translateY(-8px);
          box-shadow: 0 24px 48px rgba(15, 23, 42, 0.12);
          border-color: rgba(255, 255, 255, 1);
        }

        .feature-box:hover::after {
          transform: scaleX(1);
        }

        .feature-number {
          font-size: 13px;
          font-weight: 800;
          color: #fff;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
          transition: all 0.3s ease;
        }

        .feature-box:hover .feature-number {
          transform: scale(1.1) rotate(-5deg);
          box-shadow: 0 12px 24px rgba(59, 130, 246, 0.4);
        }

        .feature-box h3 {
          font-size: 22px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 16px;
          letter-spacing: -0.01em;
        }

        .feature-box p {
          font-size: 15px;
          color: #64748b;
          line-height: 1.7;
          margin: 0;
        }

        /* PRICING SECTION */
        .pricing-section {
          width: min(1200px, 92vw);
          margin: 120px auto;
        }

        .pricing-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          align-items: start;
        }

        .p-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 28px;
          padding: 48px 40px;
          box-shadow: 0 8px 32px rgba(15, 23, 42, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.8);
          position: relative;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .p-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 48px rgba(15, 23, 42, 0.12);
        }

        .p-card.featured {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
          border: 2px solid #3b82f6;
          box-shadow: 0 20px 60px rgba(59, 130, 246, 0.2);
          transform: scale(1.05);
        }

        .p-card.featured:hover {
          transform: scale(1.05) translateY(-8px);
          box-shadow: 0 28px 72px rgba(59, 130, 246, 0.25);
        }

        .p-badge {
          position: absolute;
          top: -16px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          padding: 8px 20px;
          border-radius: 99px;
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
          letter-spacing: 0.5px;
        }

        .p-header h4 {
          font-size: 22px;
          color: #0f172a;
          margin: 0 0 20px;
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        .p-price {
          font-size: 56px;
          font-weight: 800;
          background: linear-gradient(135deg, #0f172a 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          margin-bottom: 12px;
          letter-spacing: -0.03em;
        }

        .p-price span {
          font-size: 18px;
          color: #64748b;
          font-weight: 500;
        }

        .p-desc {
          font-size: 15px;
          color: #64748b;
          margin: 0 0 36px;
          line-height: 1.6;
        }

        .p-features {
          list-style: none;
          padding: 0;
          margin: 0 0 36px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .p-features li {
          font-size: 15px;
          color: #334155;
          display: flex;
          align-items: center;
          gap: 12px;
          line-height: 1.6;
        }

        .p-features svg {
          width: 22px;
          height: 22px;
          color: #3b82f6;
          flex-shrink: 0;
        }

        .btn-primary, .btn-outline {
          width: 100%;
          padding: 16px;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          letter-spacing: 0.3px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: #fff;
          border: none;
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.35);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(59, 130, 246, 0.45);
        }

        .btn-primary:active {
          transform: translateY(0);
        }

        .btn-outline {
          background: rgba(255, 255, 255, 0.8);
          color: #0f172a;
          border: 2px solid #e2e8f0;
        }

        .btn-outline:hover {
          border-color: #3b82f6;
          color: #3b82f6;
          background: rgba(59, 130, 246, 0.05);
          transform: translateY(-2px);
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .welcome-hero {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 24px;
          }
          .hero-copy {
            margin: 0 auto;
          }
          .feature-strip {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .pricing-cards {
            grid-template-columns: 1fr;
          }
          .p-card.featured {
            transform: scale(1);
          }
        }
        @media (max-width: 768px) {
          .nav-center { display: none; }
          .feature-strip {
            grid-template-columns: 1fr;
          }
          .features-grid {
            grid-template-columns: 1fr;
          }
          .section-title {
            font-size: 32px;
          }
        }
      `}</style>
    </div>
  );
}
