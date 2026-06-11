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

  const handleMarkReviewed = async () => {
    try {
      const res = await api.updateAuditStatus(id, 'cloture');
      if (res.success) setAudit(prev => ({ ...prev, status: 'cloture' }));
    } catch {}
  };

  const handleExportPDF = () => {
    window.print();
  };

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
      <div className="report-header" style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        padding: '24px',
        borderRadius: '12px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid #cbd5e1',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
      }}>
        <div>
          <div className="report-title" style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
            Audit Ref: {audit.code || `AUD-${audit.id}`}
          </div>
          <div className="report-meta" style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#475569', fontWeight: '500' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              {audit.facility_name || 'N/A'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              {audit.inspector_name || 'N/A'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: audit.status === 'cloture' ? '#3aad6e' : '#f59e0b' }}></div>
              {audit.status?.toUpperCase() || 'UNKNOWN'}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }} className="no-print">
          <button className="btn" style={{ background: audit.status === 'cloture' ? '#e2e8f0' : '#4a6fa5', color: audit.status === 'cloture' ? '#94a3b8' : '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', transition: 'all 0.2s' }} onClick={handleMarkReviewed} disabled={audit.status === 'cloture'}>
            {audit.status === 'cloture' ? 'Reviewed' : 'Mark as Reviewed'}
          </button>
          <button className="btn" style={{ background: '#fff', color: '#1e293b', border: '1px solid #cbd5e1', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }} onClick={handleExportPDF} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = '#fff'}>
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Export PDF
          </button>
        </div>
      </div>
      <div className="report-grid">
        <div className="qa-list">
          {(audit.responses || audit.answers) && (audit.responses || audit.answers).length > 0 ? (
            (audit.responses || audit.answers).map((resp, i) => {
              const isPass = (resp.answer_value || resp.value)?.toLowerCase() === 'yes' || (resp.answer_value || resp.value)?.toLowerCase() === 'pass';
              const isFail = (resp.answer_value || resp.value)?.toLowerCase() === 'no' || (resp.answer_value || resp.value)?.toLowerCase() === 'fail';
              return (
                <div className="qa-item" key={resp.id || i} style={{ 
                  background: '#fff', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '12px', 
                  padding: '20px', 
                  marginBottom: '16px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  transition: 'transform 0.2s',
                }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'none'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div className="qa-q" style={{ fontWeight: '700', color: '#1e293b', fontSize: '15px', lineHeight: '1.4' }}>
                      <span style={{ color: '#94a3b8', marginRight: '8px' }}>{i + 1}.</span> 
                      {resp.question_text || resp.question || resp.label || resp.title || resp.text || resp.question_id}
                    </div>
                    <div className="qa-a" style={{ 
                      background: isPass ? '#dcfce7' : isFail ? '#fee2e2' : '#f1f5f9',
                      color: isPass ? '#166534' : isFail ? '#991b1b' : '#334155',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {isPass && <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="3" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      {isFail && <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="3" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>}
                      {((resp.answer_value || resp.value) || '').startsWith('file://') || ((resp.answer_value || resp.value) || '').startsWith('http') ? (
                        <a href={resp.answer_value || resp.value} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>Media</a>
                      ) : (
                        resp.answer_value === 'pass' ? 'Pass' : resp.answer_value === 'fail' ? 'Fail' : (resp.answer_value || resp.value)
                      )}
                    </div>
                  </div>
                  {resp.evidence_url && (
                    <div style={{ marginTop: '12px', background: '#f8fafc', borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px dashed #cbd5e1' }}>
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="#64748b" strokeWidth="2" fill="none"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                      <a href={resp.evidence_url} target="_blank" rel="noreferrer" style={{ color: '#4a6fa5', textDecoration: 'none', fontWeight: 600, fontSize: '13px' }}>View Attached Evidence</a>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div style={{ padding: '20px', color: '#88a8d4', textAlign: 'center', border: '1px dashed #d6dce6', borderRadius: '8px' }}>
              No responses recorded for this audit.
            </div>
          )}
        </div>
        <div className="card-grid" style={{ gridTemplateColumns: '1fr', alignContent: 'start', gap: '24px' }}>
          <div className="card card-md" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', border: '1px solid #cbd5e1', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: '#e2e8f0', borderRadius: '50%', opacity: 0.5, filter: 'blur(20px)' }}></div>
            <h4 style={{ color: '#475569', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Overall Compliance</h4>
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '120px', height: '120px', borderRadius: '50%', background: `conic-gradient(#3aad6e ${(audit.compliance_score ?? 0)}%, #e2e8f0 ${(audit.compliance_score ?? 0)}%)` }}>
              <div style={{ position: 'absolute', width: '100px', height: '100px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a' }}>{audit.compliance_score ?? 0}%</span>
              </div>
            </div>
            <div style={{ marginTop: '20px', fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Based on regulatory standards</div>
          </div>
          <div className="card card-md" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', border: '1px solid #cbd5e1', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', width: '100px', height: '100px', background: '#e2e8f0', borderRadius: '50%', opacity: 0.5, filter: 'blur(20px)' }}></div>
            <h4 style={{ color: '#475569', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Maturity Level</h4>
            <div style={{ fontSize: '48px', fontWeight: '900', color: '#0f172a', margin: '20px 0', background: 'linear-gradient(90deg, #4a6fa5, #3aad6e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Level {audit.maturity_score ?? 0}
            </div>
            <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(100, (audit.maturity_score ?? 0) * 20)}%`, background: 'linear-gradient(90deg, #4a6fa5, #3aad6e)', borderRadius: '4px' }}></div>
            </div>
            <div style={{ marginTop: '16px', fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Process Maturity Assessment</div>
          </div>
        </div>
      </div>
    </div>
  );
}
