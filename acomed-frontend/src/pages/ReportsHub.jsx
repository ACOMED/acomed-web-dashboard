import React from 'react';

export default function ReportsHub() {
  return (
    <div className="dashboard">
      <div className="section-head">
        <h2 className="section-title">Global Reports Hub</h2>
        <p className="section-note">Generate and export aggregated system data</p>
      </div>
      <div className="reports-filters">
        <div className="form-group" style={{ margin: 0 }}>
          <label>Date Range</label>
          <select className="form-control" style={{ width: '180px' }}>
            <option>Last 30 Days</option>
            <option>Last Quarter</option>
            <option>Year to Date</option>
            <option>Custom Range...</option>
          </select>
        </div>
        <div className="form-group" style={{ margin: 0 }}>
          <label>Facility</label>
          <select className="form-control" style={{ width: '180px' }}>
            <option>All Facilities</option>
            <option>Hôpital Saint-Louis</option>
            <option>Clinique des Alpes</option>
          </select>
        </div>
        <div className="form-group" style={{ margin: 0 }}>
          <label>Report Type</label>
          <select className="form-control" style={{ width: '200px' }}>
            <option>Compliance Summary</option>
            <option>All CAPAs (Status Report)</option>
            <option>Maturity Progression</option>
          </select>
        </div>
        <button className="btn btn-primary" style={{ height: '35px' }}>Generate CSV/PDF Export</button>
      </div>
      <div className="card">
        <h4 style={{ marginTop: 0, color: '#5c5d66', fontSize: '13px', fontWeight: '600' }}>Report Preview</h4>
        <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fbfcfe', border: '1px dashed #d6dce6', borderRadius: '8px', color: '#88a8d4', fontSize: '13px' }}>
          Select filters and click Generate to preview data here.
        </div>
      </div>
    </div>
  );
}
