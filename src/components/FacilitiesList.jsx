import React, { useState, useEffect } from "react";

const IconCloudCheck = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    <path d="M9 14l2 2l4-4" />
  </svg>
);

const IconCloudAlert = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    <path d="M12 11v4" />
    <path d="M12 17h.01" />
  </svg>
);

const IconBuilding = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <path d="M9 22V12h6v10" />
    <path d="M9 6h.01M15 6h.01M9 10h.01M15 10h.01" />
  </svg>
);

const IconMapPin = ({ size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconChevronRight = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export default function FacilitiesList({ hospitals, onSelectHospital }) {
  const [localHospitals, setLocalHospitals] = useState(hospitals || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", city: "", region: "", ref: "" });

  useEffect(() => {
    if (hospitals) {
      setLocalHospitals(hospitals);
    }
  }, [hospitals]);
  const handleAddHospital = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.city.trim()) return;

    const newHospital = {
      id: Date.now(),
      name: formData.name,
      city: formData.city,
      region: formData.region,
      ref: formData.ref,
      syncs: 0,           // ديما زيرو فـ الأول
      audits: 0,          // ديما زيرو فـ الأول
      globalScore: 0,
      scoreConformite: 0,
      isNew: true         // باش نعرفوه سبيطار جديد
    };

    setLocalHospitals([newHospital, ...localHospitals]);
    setIsModalOpen(false);
    setFormData({ name: "", city: "", region: "", ref: "" });
  };
  const totalHospitals = localHospitals.length;
  const totalAudits = totalHospitals * 20;

  const completedAuditsGlobal = localHospitals.reduce((sum, h) => sum + (h.id % 20 !== 0 ? 4 : 0), 0);
  const globalProgressPercentage =
    totalAudits > 0 ? Math.min(100, Math.round((completedAuditsGlobal / totalAudits) * 100)) : 0;

  const syncedCount = localHospitals.reduce((sum, h) => sum + (h.id % 2 !== 0 ? 1 : 0), 0);
  const waitingCount = Math.max(0, totalHospitals - syncedCount);

  return (
    <div className="facilitieslist-root">
      <style>{`
        .facilitieslist-root{
          font-family: var(--font-sans);
          color: #0b1220;
        }

        .facilitieslist-container{
          padding: 0 24px 40px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .facilitieslist-header{
          margin-bottom: 18px;
        }

        .facilitieslist-titleRow{
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 14px;
        }

        .facilitieslist-heading{
          margin: 0 0 6px 0;
          font-size: 1.55rem;
          font-weight: 850;
          letter-spacing: -0.02em;
          line-height: 1.15;
        }

        .facilitieslist-subtitle{
          margin: 0;
          font-size: 0.9375rem;
          font-weight: 550;
          color: rgba(17,24,39,0.62);
          line-height: 1.45;
        }

        .facilitieslist-statsStrip{
          position: relative;
          border-radius: 22px;
          padding: 14px;
          border: 1px solid rgba(0,0,0,0.05);
          background:
            linear-gradient(135deg, rgba(16,185,129,0.10), rgba(59,130,246,0.06));
          box-shadow: 0 14px 35px -22px rgba(0,0,0,0.14);
          backdrop-filter: blur(10px);
          overflow: hidden;
        }

        .facilitieslist-statsStrip:before{
          content:"";
          position:absolute;
          inset:-2px;
          background:
            radial-gradient(600px 140px at 18% 0%, rgba(16,185,129,0.22), rgba(16,185,129,0) 55%),
            radial-gradient(520px 140px at 88% 0%, rgba(59,130,246,0.18), rgba(59,130,246,0) 55%);
          pointer-events:none;
          opacity:0.85;
        }

        .facilitieslist-statsGrid{
          position: relative;
          display:grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .facilitieslist-statCard{
          position: relative;
          border-radius: 18px;
          border: 1px solid rgba(0,0,0,0.05);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.78), rgba(255,255,255,0.58));
          padding: 14px 14px 12px;
          overflow: hidden;
          transition: transform .2s ease, box-shadow .25s ease, border-color .25s ease;
          backdrop-filter: blur(8px);
        }

        .facilitieslist-statCard:after{
          content:"";
          position:absolute;
          inset:-40px -20px auto auto;
          width: 180px;
          height: 180px;
          border-radius: 999px;
          background: radial-gradient(circle at 30% 30%, rgba(16,185,129,0.18), rgba(16,185,129,0) 60%);
          transform: rotate(18deg);
          pointer-events:none;
          opacity:.9;
        }

        .facilitieslist-statTop{
          display:flex;
          align-items:center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 10px;
          position: relative;
        }

        .facilitieslist-statIcon{
          width: 38px;
          height: 38px;
          border-radius: 14px;
          display:flex;
          align-items:center;
          justify-content:center;
          border: 1px solid rgba(0,0,0,0.06);
          background: rgba(16,185,129,0.08);
          color: #059669;
        }

        .facilitieslist-statIcon.is-amber{
          background: rgba(245, 158, 11, 0.10);
          color: #d97706;
        }

        .facilitieslist-statLabel{
          position: relative;
          font-size: 0.8125rem;
          font-weight: 700;
          color: rgba(17,24,39,0.62);
          letter-spacing: .01em;
        }

        .facilitieslist-statValue{
          position: relative;
          font-size: 1.25rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          margin-top: 4px;
          line-height: 1.1;
        }

        .facilitieslist-statHint{
          position: relative;
          margin-top: 6px;
          font-size: 0.8125rem;
          font-weight: 650;
          color: rgba(17,24,39,0.54);
        }

        .facilitieslist-headerActions{
          display:flex;
          align-items:flex-start;
          gap: 10px;
        }

        .facilitieslist-btn-primary {
          background: linear-gradient(180deg, #10b981 0%, #059669 100%);
          color: #ffffff;
          border: 1px solid #047857;
          border-radius: 10px;
          padding: 10px 18px;
          font-size: 14px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          text-decoration: none;
          box-shadow:
            0 4px 12px rgba(16, 185, 129, 0.35),
            inset 0 1px 1px rgba(255, 255, 255, 0.3);
          text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          user-select:none;
          white-space: nowrap;
        }

        .facilitieslist-btn-primary:hover {
          background: linear-gradient(180deg, #34d399 0%, #10b981 100%);
          box-shadow:
            0 6px 16px rgba(16, 185, 129, 0.5),
            inset 0 1px 1px rgba(255, 255, 255, 0.4);
          transform: translateY(-2px);
        }

        .facilitieslist-btn-primary:active {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
        }

        .facilitieslist-hospitalList{
          display:flex;
          flex-direction: column;
          gap: 16px;
        }

        .facilitieslist-hospitalCard{
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 150px;
          gap: 20px;
          align-items: center;
          padding: 20px 22px;
          border-radius: 22px;
          border: 1px solid rgba(0,0,0,0.05);
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(10px);
          box-shadow: 0 10px 24px -18 rgba(0,0,0,0.14);
          transition:
            transform .2s ease,
            box-shadow .25s ease,
            border-color .25s ease,
            background .25s ease;
          position: relative;
          overflow: hidden;
        }

        .facilitieslist-hospitalCard:before{
          content:"";
          position:absolute;
          inset:-1px;
          background:
            radial-gradient(600px 140px at 10% 0%, rgba(16,185,129,0.12), rgba(16,185,129,0) 55%),
            radial-gradient(420px 120px at 88% 10%, rgba(59,130,246,0.10), rgba(59,130,246,0) 55%);
          opacity: 0;
          transition: opacity .25s ease;
          pointer-events:none;
        }

        .facilitieslist-hospitalCard:hover{
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.08);
          border-color: rgba(16,185,129,0.22);
          background: rgba(255,255,255,0.84);
        }

        .facilitieslist-hospitalCard:hover:before{
          opacity: 1;
        }

        .facilitieslist-identity{
          display:flex;
          align-items:center;
          gap: 16px;
          min-width: 0;
        }

        .facilitieslist-avatar{
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background-color: rgba(16, 185, 129, 0.10);
          display:flex;
          align-items:center;
          justify-content:center;
          color: #10b981;
          border: 1px solid rgba(16,185,129,0.20);
          flex-shrink: 0;
        }

        .facilitieslist-hospitalName{
          margin: 0 0 4px 0;
          font-size: 1rem;
          font-weight: 900;
          letter-spacing: -0.01em;
          color: #0b1220;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .facilitieslist-location{
          display:flex;
          align-items:center;
          gap: 8px;
          font-size: 0.8125rem;
          font-weight: 650;
          color: rgba(17,24,39,0.60);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .facilitieslist-progressBlock{
          display:flex;
          flex-direction: column;
          gap: 8px;
          justify-content: center;
        }

        .facilitieslist-progressTop{
          display:flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8125rem;
          font-weight: 800;
          letter-spacing: .01em;
        }

        .facilitieslist-progressTop .done{
          color: #0b1220;
        }

        .facilitieslist-progressTop .meta{
          color: rgba(17,24,39,0.55);
          font-weight: 750;
        }

        .facilitieslist-progressTrack{
          width: 100%;
          height: 10px;
          background: rgba(0,0,0,0.05);
          border-radius: 999px;
          overflow: hidden;
          position: relative;
        }

        .facilitieslist-progressTrack:after{
          content:"";
          position:absolute;
          inset:0;
          background: linear-gradient(90deg, rgba(16,185,129,0.18), rgba(16,185,129,0));
          opacity: .45;
          pointer-events:none;
        }

        .facilitieslist-progressBar{
          height: 100%;
          width: 0%;
          border-radius: 999px;
          background: linear-gradient(90deg, #10b981, #059669);
          box-shadow: 0 8px 18px rgba(16,185,129,0.28);
          transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .facilitieslist-syncBlock{
          display:flex;
          align-items:center;
          justify-content:flex-start;
        }

        .facilitieslist-badge{
          display:inline-flex;
          align-items:center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          font-size: 0.8125rem;
          font-weight: 900;
          border: 1px solid rgba(0,0,0,0.06);
          background: rgba(16,185,129,0.08);
          color: #059669;
          white-space: nowrap;
        }

        .facilitieslist-badge.is-waiting{
          background: rgba(245, 158, 11, 0.10);
          color: #d97706;
          border-color: rgba(217,119,6,0.18);
        }

        .facilitieslist-action{
          display:flex;
          justify-content:flex-end;
          align-items:center;
        }

        .facilitieslist-btn-dashboard{
          width: 100%;
          display:flex;
          align-items:center;
          justify-content:center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 12px;
          border: 1px solid rgba(16,185,129,0.35);
          background: linear-gradient(180deg, #10b981 0%, #059669 100%);
          color: #ffffff;
          font-weight: 800;
          font-size: 14px;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.5);
          transition: all 0.2s ease;
          user-select:none;
        }

        .facilitieslist-btn-dashboard:hover{
          filter: brightness(1.06);
        }

        .facilitieslist-modalOverlay{
          position: fixed;
          inset: 0;
          display:flex;
          align-items:center;
          justify-content:center;
          padding: 18px;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(8px);
          opacity: 0;
          pointer-events: none;
          transition: opacity .18s ease;
          z-index: 50;
        }

        .facilitieslist-modalOverlay.is-open{
          opacity: 1;
          pointer-events: auto;
        }

        .facilitieslist-modalCard{
          width: min(500px, calc(100vw - 36px));
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0px 30px 60px #00000040;
          transform: translateY(10px) scale(0.985);
          transition: transform .18s ease;
          overflow: hidden;
          border: 0;
        }

        .facilitieslist-modalOverlay.is-open .facilitieslist-modalCard{
          transform: translateY(0) scale(1);
        }

        .facilitieslist-v-modalInner{
          display:flex;
          flex-direction:column;
          min-height: 597px;
          max-height: 85vh;
        }

        .facilitieslist-v-header{
          display:flex;
          align-items:flex-start;
          justify-content: space-between;
          gap: 16px;
          padding: 22px 18px 0 18px;
        }

        .facilitieslist-v-title{
          margin: 0;
          font-family: Inter, var(--font-sans);
          font-size: 28px;
          line-height: 42px;
          font-weight: 800;
          color: #0F172AFF;
          letter-spacing: -0.01em;
        }

        .facilitieslist-v-subtitle{
          margin: 10px 0 0 0;
          font-family: Inter, var(--font-sans);
          font-size: 16px;
          line-height: 24px;
          font-weight: 400;
          color: #64748BFF;
          max-width: 420px;
        }

        .facilitieslist-v-close{
          width: 36px;
          height: 36px;
          border-radius: 12px;
          display:flex;
          align-items:center;
          justify-content:center;
          text-decoration:none;
          cursor:pointer;
          border: 1px solid rgba(226,232,240,1);
          background: rgba(248,250,252,1);
          color: rgba(15,23,42,0.7);
          font-size: 20px;
          line-height: 1;
          user-select:none;
          transition: transform .15s ease, background .15s ease;
          flex-shrink: 0;
        }
        .facilitieslist-v-close:hover{
          transform: translateY(-1px);
          background: rgba(255,255,255,1);
        }

        .facilitieslist-v-form{
          display:flex;
          flex-direction:column;
          flex: 1;
          padding: 0 40px 22px;
          overflow: auto;
        }

        .facilitieslist-v-fields{
          margin-top: 96px;
          display:flex;
          flex-direction:column;
          gap: 24px;
        }

        .facilitieslist-v-field{
          display:flex;
          flex-direction:column;
          gap: 8px;
        }

        .facilitieslist-v-label{
          font-family: Inter, var(--font-sans);
          font-size: 14px;
          line-height: 22px;
          font-weight: 600;
          color: #334155;
        }

        .facilitieslist-v-input{
          width: 100%;
          height: 61px;
          padding-left: 12px;
          padding-right: 12px;
          font-family: Inter, var(--font-sans);
          font-size: 16px;
          line-height: 26px;
          font-weight: 400;
          background: #FFFFFFFF;
          border-radius: 12px;
          border: 1px solid #E2E8F0FF;
          outline: none;
          color: #0F172A;
          transition: border-color .15s ease, color .15s ease, background .15s ease;
          box-sizing: border-box;
        }

        .facilitieslist-v-input--pad34{
          padding-left: 34px;
        }

        .facilitieslist-v-input:hover{
          color: #9CA3AFFF;
          background: #FFFFFFFF;
          border-color: #E2E8F0FF;
        }

        .facilitieslist-v-input:focus{
          color: #9CA3AFFF;
          background: #FFFFFFFF;
          border-color: #E2E8F0FF;
        }

        .facilitieslist-v-input:disabled{
          color: #9CA3AFFF;
          background: #FFFFFFFF;
          border-color: #E2E8F0FF;
          cursor: not-allowed;
        }

        .facilitieslist-v-input--gray{
          height: 52px;
          background: #EFEFEFFF;
        }

        .facilitieslist-v-actions{
          margin-top: auto;
          padding-top: 22px;
          display:flex;
          align-items:center;
          justify-content: space-between;
          gap: 16px;
        }

        .facilitieslist-v-cancel{
          height: 52px;
          border-radius: 12px;
          background: #F1F5F9;
          border: 1px solid rgba(226,232,240,1);
          padding: 0 12px;
          display:flex;
          align-items:center;
          justify-content:center;
          font-family: Inter, var(--font-sans);
          font-size: 15px;
          line-height: 24px;
          font-weight: 700;
          color: #334155;
          text-decoration:none;
          cursor:pointer;
          user-select:none;
          transition: transform .15s ease, background .15s ease;
          width: 160px;
          flex-shrink: 0;
        }
        .facilitieslist-v-cancel:hover{
          transform: translateY(-1px);
          background: #EEF2FF;
        }

        .facilitieslist-btn-save{
          width: 275.546875px;
          max-width: 100%;
          height: 52px;
          padding: 0 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: Inter, var(--font-sans);
          font-size: 15px;
          line-height: 24px;
          font-weight: 700;
          color: #171A1FFF;
          background: linear-gradient(100.69deg, #10B981FF 0%, #059669FF 100%);
          opacity: 1;
          border-radius: 12px;
          border-width: 0px;
          border-style: solid;
          box-shadow: 0px 8px 20px #10B98180, 0px 0px 0px #171a1f00;
          cursor: pointer;
          transition: filter .15s ease, transform .15s ease;
          user-select:none;
        }

        .facilitieslist-btn-save:hover{
          color: #262A33FF;
          filter: brightness(1.05) saturate(1.05);
          transform: translateY(-1px);
        }

        .facilitieslist-btn-save:active{
          color: #323842FF;
          transform: translateY(0px);
          filter: brightness(1.02) saturate(1.02);
        }

        .facilitieslist-btn-save:disabled{
          opacity: 0.4;
          cursor: not-allowed;
        }

        @media (max-width: 980px){
          .facilitieslist-statsGrid{
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .facilitieslist-hospitalCard{
            grid-template-columns: 1.4fr 1fr;
            grid-auto-rows: auto;
          }
          .facilitieslist-action{
            grid-column: 1 / -1;
            justify-content: stretch;
          }
          .facilitieslist-action .facilitieslist-btn-dashboard{
            width: 100%;
          }
        }

        @media (max-width: 520px){
          .facilitieslist-container{
            padding: 0 14px 36px;
          }
          .facilitieslist-titleRow{
            flex-direction: column;
            align-items: stretch;
          }
          .facilitieslist-headerActions{
            justify-content: flex-start;
          }

          .facilitieslist-modalCard{
            width: min(500px, calc(100vw - 20px));
          }

          .facilitieslist-v-form{
            padding-left: 16px;
            padding-right: 16px;
          }
          .facilitieslist-v-fields{
            margin-top: 72px;
          }
          .facilitieslist-v-actions{
            padding-top: 16px;
          }
          .facilitieslist-v-cancel{
            width: 140px;
          }
        }
      `}</style>

      <div className="facilitieslist-container">
        <div className="facilitieslist-header">
          <div className="facilitieslist-titleRow">
            <div>
              <h1 className="facilitieslist-heading">Liste des Établissements ({totalHospitals})</h1>
              <p className="facilitieslist-subtitle">Supervision des audits en cours et de la conformité globale.</p>
            </div>

            <div className="facilitieslist-headerActions">
              <button
                className="facilitieslist-btn-primary"
                onClick={() => setIsModalOpen(true)}
              >
                + Ajouter Hôpital
              </button>
            </div>
          </div>

          <div className="facilitieslist-statsStrip" aria-label="Résumé des établissements">
            <div className="facilitieslist-statsGrid">
              <div className="facilitieslist-statCard">
                <div className="facilitieslist-statTop">
                  <div className="facilitieslist-statIcon" aria-hidden="true">
                    <IconBuilding />
                  </div>
                  <div className="facilitieslist-statLabel">Établissements</div>
                </div>
                <div className="facilitieslist-statValue">{totalHospitals}</div>
                <div className="facilitieslist-statHint">Sur votre périmètre</div>
              </div>

              <div className="facilitieslist-statCard">
                <div className="facilitieslist-statTop">
                  <div
                    className="facilitieslist-statIcon"
                    aria-hidden="true"
                    style={{ background: "rgba(16,185,129,0.10)" }}
                  >
                    <IconCloudCheck />
                  </div>
                  <div className="facilitieslist-statLabel">Progression globale</div>
                </div>
                <div className="facilitieslist-statValue">{globalProgressPercentage}%</div>
                <div className="facilitieslist-statHint">
                  {completedAuditsGlobal}/{totalAudits} audits
                </div>
              </div>

              <div className="facilitieslist-statCard">
                <div className="facilitieslist-statTop">
                  <div
                    className="facilitieslist-statIcon"
                    aria-hidden="true"
                    style={{ background: "rgba(16,185,129,0.10)" }}
                  >
                    <IconCloudCheck />
                  </div>
                  <div className="facilitieslist-statLabel">Synchronisés</div>
                </div>
                <div className="facilitieslist-statValue">{syncedCount}</div>
                <div className="facilitieslist-statHint">OK pour le suivi</div>
              </div>

              <div className="facilitieslist-statCard">
                <div className="facilitieslist-statTop">
                  <div className="facilitieslist-statIcon is-amber" aria-hidden="true">
                    <IconCloudAlert />
                  </div>
                  <div className="facilitieslist-statLabel">En attente</div>
                </div>
                <div className="facilitieslist-statValue">{waitingCount}</div>
                <div className="facilitieslist-statHint">Synchronisation en cours</div>
              </div>
            </div>
          </div>
        </div>

        <div className="facilitieslist-hospitalList">
          {localHospitals.map((hospital) => {
            const isNew = hospital.isNew || !hospital.scoreConformite;
            const progressPercentage = isNew ? 0 : hospital.scoreConformite;
            const completedAudits = isNew ? 0 : 14; // رقم تقريبي للأوديت لي دازو
            const isSynced = !isNew;

            return (
              <div key={hospital.id} className="facilitieslist-hospitalCard">
                <div className="facilitieslist-identity">
                  <div className="facilitieslist-avatar" aria-hidden="true">
                    <IconBuilding />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h3 className="facilitieslist-hospitalName">{hospital.name}</h3>
                    <div className="facilitieslist-location">
                      <span aria-hidden="true" style={{ display: "inline-flex" }}>
                        <IconMapPin />
                      </span>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                        {hospital.city}, {hospital.region}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="facilitieslist-progressBlock">
                  <div className="facilitieslist-progressTop">
                    <span className="done">{progressPercentage}% Terminé</span>
                    <span className="meta">
                      {completedAudits}/20 Audits
                    </span>
                  </div>

                  <div className="facilitieslist-progressTrack" aria-label={`Progression ${progressPercentage}%`}>
                    <div
                      className="facilitieslist-progressBar"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="facilitieslist-syncBlock">
                  {isSynced ? (
                    <div className="facilitieslist-badge" role="status" aria-label="Synchronisé">
                      <IconCloudCheck />
                      <span>Synchronisé</span>
                    </div>
                  ) : (
                    <div className="facilitieslist-badge is-waiting" role="status" aria-label="Attente de synchro">
                      <IconCloudAlert />
                      <span>Attente de Synchro</span>
                    </div>
                  )}
                </div>

                <div className="facilitieslist-action">
                  <button
                    className="facilitieslist-btn-dashboard"
                    onClick={() => onSelectHospital(hospital)}
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

      <div className={`facilitieslist-modalOverlay ${isModalOpen ? "is-open" : ""}`}>
        <div className="facilitieslist-modalCard" role="dialog" aria-modal="true" aria-label="Ajouter un hôpital">
          <div className="facilitieslist-v-modalInner">
            <div className="facilitieslist-v-header">
              <div>
                <h2 className="facilitieslist-v-title">Ajouter un Hôpital</h2>
                <p className="facilitieslist-v-subtitle">Renseignez les détails pour intégrer un nouvel hôpital au réseau.</p>
              </div>

              <button
                className="facilitieslist-v-close"
                onClick={() => setIsModalOpen(false)}
                aria-label="Fermer"
              >
                ×
              </button>
            </div>

            <form
              className="facilitieslist-v-form"
              onSubmit={handleAddHospital}
            >
              <div className="facilitieslist-v-fields">
                <div className="facilitieslist-v-field">
                  <div className="facilitieslist-v-label">Nom</div>
                  <input
                    className="facilitieslist-v-input"
                    placeholder="Ex: Centre Hospitalier Aurora"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="facilitieslist-v-field">
                  <div className="facilitieslist-v-label">Ville</div>
                  <input
                    className="facilitieslist-v-input facilitieslist-v-input--pad34"
                    placeholder="Ex: Lyon"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>

                <div className="facilitieslist-v-field">
                  <div className="facilitieslist-v-label">Région</div>
                  <input
                    className="facilitieslist-v-input"
                    placeholder="Ex: Auvergne-Rhône-Alpes"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  />
                </div>

                <div className="facilitieslist-v-field">
                  <div className="facilitieslist-v-label">Référence (optionnel)</div>
                  <input
                    className="facilitieslist-v-input facilitieslist-v-input--gray"
                    placeholder="Ex: H-2026-014"
                    value={formData.ref}
                    onChange={(e) => setFormData({ ...formData, ref: e.target.value })}
                  />
                </div>
              </div>

              <div className="facilitieslist-v-actions">
                <button
                  type="button"
                  className="facilitieslist-v-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Annuler
                </button>

                <button type="submit" className="facilitieslist-btn-save">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}