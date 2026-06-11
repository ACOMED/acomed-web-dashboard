import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function ReportsHub() {
  const [filters, setFilters] = useState({ dateRange: '30', facilityId: '', reportType: 'compliance' });
  const [facilities, setFacilities] = useState([]);
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getFacilities()
      .then(res => { if (res.success && res.data) setFacilities(res.data); })
      .catch(() => {});
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setPreviewData(null);
    try {
      const res = await api.generateReport({
        date_range: filters.dateRange,
        facility_id: filters.facilityId,
        report_type: filters.reportType
      });
      if (res.success) {
        setPreviewData(res.data);
      } else {
        setError(res.message || 'Failed to generate report.');
      }
    } catch (err) {
      setError('Could not reach the server to generate report.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!previewData || !previewData.headers || !previewData.rows) return;
    const csvContent = [
      previewData.headers.join(','),
      ...previewData.rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${filters.reportType}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="dashboard">
      <div className="section-head">
        <h2 className="section-title">Global Reports Hub</h2>
        <p className="section-note">Generate and export aggregated system data</p>
      </div>
      <div className="reports-filters" style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#5c5d66', marginBottom: '6px' }}>Date Range</label>
          <select className="form-control" style={{ width: '180px', padding: '8px', borderRadius: '6px', border: '1px solid #d6dce6' }} value={filters.dateRange} onChange={e => setFilters(f => ({ ...f, dateRange: e.target.value }))}>
            <option value="30">Last 30 Days</option>
            <option value="90">Last Quarter</option>
            <option value="ytd">Year to Date</option>
            <option value="all">All Time</option>
          </select>
        </div>
        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#5c5d66', marginBottom: '6px' }}>Facility</label>
          <select className="form-control" style={{ width: '180px', padding: '8px', borderRadius: '6px', border: '1px solid #d6dce6' }} value={filters.facilityId} onChange={e => setFilters(f => ({ ...f, facilityId: e.target.value }))}>
            <option value="">All Facilities</option>
            {facilities.map(fac => (
              <option key={fac.id} value={fac.id}>{fac.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#5c5d66', marginBottom: '6px' }}>Report Type</label>
          <select className="form-control" style={{ width: '200px', padding: '8px', borderRadius: '6px', border: '1px solid #d6dce6' }} value={filters.reportType} onChange={e => setFilters(f => ({ ...f, reportType: e.target.value }))}>
            <option value="compliance">Compliance Summary</option>
            <option value="capas">All CAPAs (Status Report)</option>
            <option value="maturity">Maturity Progression</option>
          </select>
        </div>
        <button className="btn btn-primary" style={{ height: '35px', background: '#4a6fa5', color: '#fff', border: 'none', borderRadius: '6px', padding: '0 16px', fontWeight: 'bold', cursor: 'pointer' }} onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Preview'}
        </button>
      </div>

      {error && <div style={{ color: '#e05c6e', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h4 style={{ margin: 0, color: '#121319', fontSize: '14px', fontWeight: '700' }}>Report Preview</h4>
          {previewData && <button className="btn btn-secondary" onClick={handleExportCSV} style={{ padding: '6px 12px', fontSize: '11px' }}>⬇ Export CSV</button>}
        </div>
        
        {!previewData && !loading && (
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fbfcfe', border: '1px dashed #d6dce6', borderRadius: '8px', color: '#88a8d4', fontSize: '13px' }}>
            Select filters and click Generate to preview data here.
          </div>
        )}
        
        {loading && (
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fbfcfe', border: '1px dashed #d6dce6', borderRadius: '8px', color: '#88a8d4', fontSize: '13px' }}>
            Loading report data...
          </div>
        )}
        
        {previewData && (
          <div style={{ overflowX: 'auto', background: '#fff', border: '1px solid #f0f2f7', borderRadius: '8px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f5f8fd', color: '#5c5d66', borderBottom: '2px solid #e2e8f0' }}>
                  {previewData.headers?.map((h, i) => (
                    <th key={i} style={{ padding: '12px', fontWeight: '600' }}>{h}</th>
                  )) || <th style={{ padding: '12px' }}>Data</th>}
                </tr>
              </thead>
              <tbody>
                {previewData.rows?.length > 0 ? previewData.rows.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f0f2f7' }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ padding: '12px', color: '#121319' }}>{cell}</td>
                    ))}
                  </tr>
                )) : (
                  <tr><td colSpan="100%" style={{ padding: '20px', textAlign: 'center', color: '#88a8d4' }}>No data found for these filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
