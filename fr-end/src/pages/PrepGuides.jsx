import React from 'react';

export default function PrepGuides() {
  return (
    <div className="dashboard">
      <div className="section-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="section-title">Preparation Guides</h2>
          <p className="section-note">Downloadable resources and checklists for audit preparation</p>
        </div>
        <button className="btn btn-primary">Upload New Guide</button>
      </div>
      <div style={{ padding: '60px', textAlign: 'center', background: '#fff', borderRadius: '12px', border: '1px solid #e2e7ef', marginTop: '20px' }}>
        <div style={{ color: '#88a8d4', fontSize: '14px' }}>No preparation guides available yet.</div>
      </div>
    </div>
  );
}
