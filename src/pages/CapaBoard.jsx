import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const COLUMNS = [
  { key: 'todo',       label: 'À Faire' },
  { key: 'inProgress', label: 'En Cours' },
  { key: 'review',     label: 'En Attente de Validation' },
  { key: 'closed',     label: 'Clôturée / Rejetée' },
];


function groupByStatus(capas) {
  const groups = { todo: [], inProgress: [], review: [], closed: [] };
  capas.forEach(c => {
    const key = c.status in groups ? c.status : 'todo';
    groups[key].push({
      id: c.id,
      severity: c.severity,
      title: c.title,
      due: c.due_date ? new Date(c.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '—',
      avatar: c.avatar_url || null,
      assignee_name: c.assignee_name || 'Unassigned',
      closed: c.status === 'closed',
    });
  });
  return groups;
}

export default function CapaBoard() {
  const [capas, setCapas]     = useState({ todo: [], inProgress: [], review: [], closed: [] });
  const [dragging, setDragging] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addModal, setAddModal] = useState(false);
  const [newCapa, setNewCapa] = useState({ title: '', severity: 'minor' });
  const [submitting, setSubmitting] = useState(false);

  const loadCapas = () => {
    setLoading(true);
    api.getCapas()
      .then(res => {
        if (res.success && res.data) setCapas(groupByStatus(res.data));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCapas();
  }, []);

  const handleAddCapa = async () => {
    if (!newCapa.title.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.createCapa(newCapa);
      if (res.success) {
        setAddModal(false);
        setNewCapa({ title: '', severity: 'minor' });
        loadCapas();
      } else {
        alert(res.message || 'Failed to create CAPA');
      }
    } catch {
      alert('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDragStart = (card, fromCol) => setDragging({ card, fromCol });

  const handleDrop = async (toCol) => {
    if (!dragging || dragging.fromCol === toCol) return;
    const card = dragging.card;
    setCapas(prev => {
      const next = { ...prev };
      next[dragging.fromCol] = prev[dragging.fromCol].filter(c => c.id !== card.id);
      next[toCol] = [...prev[toCol], { ...card, closed: toCol === 'closed' }];
      return next;
    });
    setDragging(null);
    try { await api.updateCapaStatus(card.id, toCol); } catch {}
  };

  return (
    <div className="dashboard">
      <div className="section-head">
        <h2 className="section-title">CAPA Kanban Board</h2>
        <p className="section-note">Agile view for Non-Conformities</p>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#88a8d4' }}>Loading CAPAs…</div>
      ) : (
        <div className="kanban-grid" id="capaBoard">
          {COLUMNS.map(({ key, label }) => (
            <div
              key={key}
              className="kanban-column"
              data-status={key}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(key)}
            >
              <div className="kanban-col-header">
                <h4 className="kanban-col-title">{label}</h4>
                <span className="kanban-col-count">{capas[key].length}</span>
              </div>
              <div className="kanban-list" style={{ minHeight: '150px' }}>
                {capas[key].map(card => (
                  <div
                    key={card.id}
                    className="kanban-card"
                    draggable
                    onDragStart={() => handleDragStart(card, key)}
                    style={card.closed ? { opacity: 0.7 } : {}}
                  >
                    <div className={`severity ${card.severity}`}>
                      {card.severity.charAt(0).toUpperCase() + card.severity.slice(1)}
                    </div>
                    <h5 className="kanban-title" style={card.closed ? { textDecoration: 'line-through' } : {}}>
                      {card.title}
                    </h5>
                    <div className="meta-line">
                      <span>{card.closed ? 'Resolved:' : 'Due:'} {card.due}</span>
                      {card.avatar ? (
                        <img src={card.avatar} alt="avatar" style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                      ) : (
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#4a6fa5', color: '#fff', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {card.assignee_name !== 'Unassigned' ? card.assignee_name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : '?'}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button className="kanban-add-btn" onClick={() => setAddModal(true)}>+ Add CAPA</button>
            </div>
          ))}
        </div>
      )}

      {addModal && (
        <div className="modal-overlay open">
          <div className="modal-box">
            <div className="modal-head">
              <h3>Add New CAPA</h3>
              <button className="modal-close" onClick={() => setAddModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Title / Description</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newCapa.title} 
                  onChange={e => setNewCapa(c => ({ ...c, title: e.target.value }))} 
                  placeholder="e.g. Broken equipment in room 2" 
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Severity</label>
                <select 
                  className="form-control" 
                  value={newCapa.severity} 
                  onChange={e => setNewCapa(c => ({ ...c, severity: e.target.value }))}
                >
                  <option value="minor">Minor</option>
                  <option value="major">Major</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn" onClick={() => setAddModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAddCapa} disabled={submitting}>
                {submitting ? 'Creating...' : 'Create CAPA'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
