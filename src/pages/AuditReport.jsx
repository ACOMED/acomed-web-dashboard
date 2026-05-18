import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';

export default function AuditReport() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    api.getAudit(id)
      .then(res => {
        if (res.success) setAudit(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="dashboard">
        <button className="btn btn-secondary" style={{ marginBottom: '16px' }} onClick={() => navigate('/audits-management')}>← Back to Audits</button>
        <div style={{ padding: '60px', textAlign: 'center', color: '#88a8d4' }}>Loading Audit Report...</div>
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="dashboard">
        <button className="btn btn-secondary" style={{ marginBottom: '16px' }} onClick={() => navigate('/audits-management')}>← Back to Audits</button>
        <div style={{ padding: '60px', textAlign: 'center', color: '#e05c6e' }}>Audit not found.</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <button className="btn btn-secondary" style={{ marginBottom: '16px' }} onClick={() => navigate('/audits-management')}>← Back to Audits</button>
      <div className="report-header">
        <div>
          <div className="report-title">Audit Ref: {audit.code || `AUD-${audit.id}`}</div>
          <div className="report-meta">Facility: {audit.facility_name || 'N/A'} &bull; Inspector: {audit.inspector_name || 'N/A'} &bull; Status: {audit.status?.toUpperCase() || 'UNKNOWN'}</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-primary">Mark as Reviewed</button>
          <button className="btn btn-secondary">Export to PDF</button>
        </div>
      </div>
      <div className="report-grid">
        <div className="qa-list">
          {audit.responses && audit.responses.length > 0 ? (
            audit.responses.map((resp, i) => (
              <div className="qa-item" key={resp.id || i}>
                <div className="qa-q">{i + 1}. {resp.question_text || resp.question_id}</div>
                <div className="qa-a" style={{ color: resp.answer_value === 'No' ? '#e05c6e' : '#3aad6e' }}>
                  {resp.answer_value}
                </div>
                {resp.evidence_url && (
                  <div style={{ marginTop: '8px', background: '#e2e7ef', borderRadius: '6px', padding: '12px', fontSize: '12px' }}>
                    <a href={resp.evidence_url} target="_blank" rel="noreferrer" style={{ color: '#4a6fa5', textDecoration: 'none', fontWeight: 600 }}>View Evidence Attachment</a>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{ padding: '20px', color: '#88a8d4', textAlign: 'center', border: '1px dashed #d6dce6', borderRadius: '8px' }}>
              No responses recorded for this audit.
            </div>
          )}
        </div>
        <div className="card-grid" style={{ gridTemplateColumns: '1fr', alignContent: 'start' }}>
          <div className="card card-md">
            <h4>Audit Compliance</h4>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#121319', textAlign: 'center', margin: '20px 0' }}>{audit.compliance_score ?? 0}%</div>
          </div>
          <div className="card card-md">
            <h4>Audit Maturity</h4>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#121319', textAlign: 'center', margin: '20px 0' }}>Level {audit.maturity_score ?? 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
