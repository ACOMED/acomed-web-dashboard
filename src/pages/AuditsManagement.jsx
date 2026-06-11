import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';



const STATUS_LABEL = { soumis: 'SOUMIS', planifie: 'PLANIFIE', cloture: 'CLOTURE', brouillon: 'BROUILLON' };

export default function AuditsManagement() {
  const navigate = useNavigate();
  const [audits, setAudits]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modalOpen, setModalOpen]   = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [inspectors, setInspectors] = useState([]);
  const [form, setForm]             = useState({ template_id: '', facility_id: '', inspector_id: '', date: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.getAudits()
      .then(res => setAudits(res.success && res.data ? res.data : []))
      .catch(() => setAudits([]))
      .finally(() => setLoading(false));

    api.getTemplates()
      .then(res => { if (res.success && res.data) setSavedTemplates(res.data); })
      .catch(() => {});

    api.getFacilities()
      .then(res => { if (res.success && res.data) setFacilities(res.data); })
      .catch(() => {});

    api.getUsers()
      .then(res => { 
        if (res.success && res.data) {
          const ins = res.data.filter(u => u.role === 'inspector');
          setInspectors(ins.length > 0 ? ins : res.data); // Fallback to all users if no role matches
        } 
      })
      .catch(() => {});
  }, []);

  const scheduleAudit = async () => {
    if (!form.template_id || !form.facility_id || !form.inspector_id || !form.date) {
      alert("Please select a template, facility, inspector, and date.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.createAudit(form);
      if (res.success) {
        // Map IDs to names for immediate UI update
        const fac = facilities.find(f => String(f.id) === String(form.facility_id));
        const ins = inspectors.find(i => String(i.id) === String(form.inspector_id));
        
        setAudits(prev => [{
          ...res.data,
          facility: fac ? fac.name : form.facility_id,
          inspector: ins ? (ins.name || ins.email || ins.full_name) : form.inspector_id,
          date: form.date,
          label: 'BROUILLON',
        }, ...prev]);
        
        setModalOpen(false);
        setForm({ template_id: '', facility_id: '', inspector_id: '', date: '' });
      } else {
        alert("Error scheduling audit: " + (res.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to the server. Please ensure the backend is running.");
    }
    setSubmitting(false);
  };

  const handleDeleteAudit = (e, id) => {
    e.stopPropagation();
    setDeleteModal({ open: true, id });
  };

  const executeDeleteAudit = async () => {
    const id = deleteModal.id;
    if (!id) return;
    try {
      const res = await api.deleteAudit(id);
      if (res.success) {
        setAudits(prev => prev.filter(a => a.id !== id && a.ref !== id));
        setDeleteModal({ open: false, id: null });
      } else {
        alert(res.message || "Failed to delete audit");
      }
    } catch {
      alert("Network error. Please try again.");
    }
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
              <tr><th>Audit Ref</th><th>Facility</th><th>Inspector</th><th>Date</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {audits.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', color: '#88a8d4', padding: '20px' }}>No records found</td></tr>
              ) : audits.map(a => (
                <tr key={a.ref || a.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/audit-report/${a.id || a.ref}`)}>
                  <td>{a.ref || a.id}</td>
                  <td>{a.facility}</td>
                  <td>{a.inspector}</td>
                  <td>{a.date}</td>
                  <td><span className={`status-badge badge-${a.status}`}>{a.label || STATUS_LABEL[a.status] || a.status}</span></td>
                  <td>
                    <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '10px', color: '#e05c6e', borderColor: '#e05c6e' }} onClick={(e) => handleDeleteAudit(e, a.id || a.ref)}>Delete</button>
                  </td>
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
                  {savedTemplates.map((t, i) => <option key={t.id || i} value={t.id}>{t.name} (Custom)</option>)}
                  {savedTemplates.length === 0 && (
                    <option value="" disabled>No templates available</option>
                  )}
                </select>
              </div>
              <div className="form-group">
                <label>Facility</label>
                <select className="form-control" value={form.facility_id} onChange={e => setForm(f => ({ ...f, facility_id: e.target.value }))}>
                  <option value="">-- Select Facility --</option>
                  {facilities.map(fac => (
                    <option key={fac.id} value={fac.id}>{fac.name}</option>
                  ))}
                  {facilities.length === 0 && (
                    <option value="" disabled>No facilities available</option>
                  )}
                </select>
              </div>
              <div className="form-group">
                <label>Inspector</label>
                <select className="form-control" value={form.inspector_id} onChange={e => setForm(f => ({ ...f, inspector_id: e.target.value }))}>
                  <option value="">-- Select Inspector --</option>
                  {inspectors.map(ins => (
                    <option key={ins.id} value={ins.id}>{ins.name || ins.email}</option>
                  ))}
                  {inspectors.length === 0 && (
                    <option value="" disabled>No inspectors available</option>
                  )}
                </select>
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

      {deleteModal.open && (
        <div className="modal-overlay open">
          <div className="modal-box" style={{ maxWidth: '400px' }}>
            <div className="modal-head">
              <h3>Confirm Delete</h3>
              <button className="modal-close" onClick={() => setDeleteModal({ open: false, id: null })}>&times;</button>
            </div>
            <div className="modal-body">
              <p style={{ color: '#121319', fontSize: '14px', margin: '0' }}>Are you sure you want to delete this audit? This action cannot be undone.</p>
            </div>
            <div className="modal-foot">
              <button className="btn" onClick={() => setDeleteModal({ open: false, id: null })}>Cancel</button>
              <button className="btn" style={{ background: '#e05c6e', color: '#fff', border: 'none' }} onClick={executeDeleteAudit}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
