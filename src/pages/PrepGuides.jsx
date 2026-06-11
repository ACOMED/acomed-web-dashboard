import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function PrepGuides() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', file: null });
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fetchGuides = () => {
    setLoading(true);
    api.getGuides()
      .then(res => { if (res.success && res.data) setGuides(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  const handleUpload = async () => {
    if (!form.title || !form.file) {
      alert('Please provide a title and select a file.');
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('file', form.file);

    try {
      const res = await api.uploadGuide(formData);
      if (res.success) {
        setModalOpen(false);
        setForm({ title: '', file: null });
        fetchGuides();
      } else {
        alert(res.message || 'Upload failed.');
      }
    } catch (err) {
      alert('Failed to connect to the server.');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setForm(f => ({ ...f, file: e.dataTransfer.files[0] }));
    }
  };

  return (
    <div className="dashboard">
      <div className="section-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="section-title">Preparation Guides</h2>
          <p className="section-note">Downloadable resources and checklists for audit preparation</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>Upload New Guide</button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#88a8d4' }}>Loading guides…</div>
      ) : guides.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', background: '#fff', borderRadius: '12px', border: '1px solid #e2e7ef', marginTop: '20px' }}>
          <div style={{ color: '#88a8d4', fontSize: '14px' }}>No preparation guides available yet.</div>
        </div>
      ) : (
        <div className="table-wrap" style={{ marginTop: '20px' }}>
          <table className="data-table">
            <thead>
              <tr><th>Title</th><th>Upload Date</th><th>Action</th></tr>
            </thead>
            <tbody>
              {guides.map(g => (
                <tr key={g.id}>
                  <td style={{ fontWeight: 500 }}>{g.title}</td>
                  <td>{g.created_at ? new Date(g.created_at).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <a href={g.file_url} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '11px', textDecoration: 'none' }}>Download</a>
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
              <h3>Upload Preparation Guide</h3>
              <button className="modal-close" onClick={() => setModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Guide Title</label>
                <input type="text" className="form-control" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. ISO 9001 Preparation Checklist" />
              </div>
              <div className="form-group">
                <label>Document File</label>
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-upload').click()}
                  style={{
                    border: `2px dashed ${isDragging ? '#4a6fa5' : '#cbd5e1'}`,
                    background: isDragging ? '#f5f8fd' : '#fbfcfe',
                    borderRadius: '8px',
                    padding: '30px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <input 
                    id="file-upload"
                    type="file" 
                    onChange={e => setForm(f => ({ ...f, file: e.target.files[0] }))} 
                    accept=".pdf,.doc,.docx,.xlsx" 
                    style={{ display: 'none' }}
                  />
                  <div style={{ color: '#4a6fa5', marginBottom: '8px' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                  </div>
                  <div style={{ color: '#121319', fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>
                    {form.file ? form.file.name : 'Click to upload or drag and drop'}
                  </div>
                  <div style={{ color: '#5c5d66', fontSize: '12px' }}>
                    {form.file ? `${(form.file.size / 1024 / 1024).toFixed(2)} MB` : 'PDF, DOCX, XLSX (max. 10MB)'}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Uploading…' : 'Upload File'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
