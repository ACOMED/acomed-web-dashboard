import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const STATUS_FALLBACK = [
  { ref: 'AUD-2026-001', facility: 'Hôpital Saint-Louis',  inspector: 'Dr. Dupont',  date: 'Oct 12, 2026', status: 'soumis',   label: 'SOUMIS' },
  { ref: 'AUD-2026-002', facility: 'Clinique des Alpes',   inspector: 'Mme. Martin', date: 'Oct 15, 2026', status: 'planifie', label: 'PLANIFIE' },
  { ref: 'AUD-2026-003', facility: 'Centre Hospitalier Est', inspector: 'Dr. Bernard', date: 'Oct 05, 2026', status: 'cloture', label: 'CLOTURE' },
  { ref: 'AUD-2026-004', facility: 'Hôpital Nord',         inspector: 'Dr. Dupont',  date: 'Nov 02, 2026', status: 'brouillon',label: 'BROUILLON' },
];

const STATUS_LABEL = { soumis: 'SOUMIS', planifie: 'PLANIFIE', cloture: 'CLOTURE', brouillon: 'BROUILLON' };

export default function AuditsManagement() {
  const navigate = useNavigate();
  const [audits, setAudits]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modalOpen, setModalOpen]   = useState(false);
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [form, setForm]             = useState({ template_id: '', facility_id: '', inspector_id: '', date: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.getAudits()
      .then(res => setAudits(res.success ? res.data : STATUS_FALLBACK))
      .catch(() => setAudits(STATUS_FALLBACK))
      .finally(() => setLoading(false));

    api.getTemplates()
      .then(res => { if (res.success && res.data) setSavedTemplates(res.data); })
      .catch(() => {});
  }, []);

  const scheduleAudit = async () => {
    if (!form.date) return;
    setSubmitting(true);
    try {
      const res = await api.createAudit(form);
      if (res.success) {
        setAudits(prev => [...prev, {
          ...res.data,
          facility: form.facility_id,
          inspector: form.inspector_id,
          date: form.date,
          label: 'BROUILLON',
        }]);
        setModalOpen(false);
        setForm({ template_id: '', facility_id: '', inspector_id: '', date: '' });
      }
    } catch {}
    setSubmitting(false);
  };

  return (
    <div className="dashboard">
      <div className="section-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="section-title">Audits Management</h2>
          <p className="section-note">Audit Lifecycle &amp; Scheduling Module</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>Schedule Audit</button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#88a8d4' }}>Loading audits…</div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Audit Ref</th><th>Facility</th><th>Inspector</th><th>Date</th><th>Status</th></tr>
            </thead>
            <tbody>
              {audits.map(a => (
                <tr key={a.ref || a.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/audit-report/${a.id || a.ref}`)}>
                  <td>{a.ref || a.id}</td>
                  <td>{a.facility}</td>
                  <td>{a.inspector}</td>
                  <td>{a.date}</td>
                  <td><span className={`status-badge badge-${a.status}`}>{a.label || STATUS_LABEL[a.status] || a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="modal-overlay open">
          <div className="modal-box">
            <div className="modal-head">
              <h3>Schedule New Audit</h3>
              <button className="modal-close" onClick={() => setModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Template</label>
                <select className="form-control" value={form.template_id} onChange={e => setForm(f => ({ ...f, template_id: e.target.value }))}>
                  <option value="">-- Select Template --</option>
                  <option value="iso">ISO 9001 Standard Audit</option>
                  <option value="hygiene">Hygiene &amp; Safety Walkthrough</option>
                  {savedTemplates.map((t, i) => <option key={i} value={t.code}>{t.name} (Custom)</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Facility</label>
                <input className="form-control" placeholder="Facility name or ID" value={form.facility_id} onChange={e => setForm(f => ({ ...f, facility_id: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Inspector</label>
                <input className="form-control" placeholder="Inspector name or ID" value={form.inspector_id} onChange={e => setForm(f => ({ ...f, inspector_id: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" className="form-control" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={scheduleAudit} disabled={submitting}>
                {submitting ? 'Scheduling…' : 'Confirm Scheduling'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
