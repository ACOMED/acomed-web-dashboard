import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function TenantSettings() {
  const [activeTab, setActiveTab]       = useState('facilities');
  const [facilities, setFacilities]     = useState([]);
  const [users, setUsers]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [facilityModal, setFacilityModal] = useState(false);
  const [inspectorModal, setInspectorModal] = useState(false);
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [drawerFacility, setDrawerFacility] = useState(null);
  const [newFacility, setNewFacility]   = useState({ name: '', location: '', type: 'General Hospital' });
  const [editFacilityModal, setEditFacilityModal] = useState(false);
  const [editFacilityData, setEditFacilityData] = useState(null);
  const [deleteModal, setDeleteModal]   = useState({ open: false, id: null, type: null });
  const [newUser, setNewUser]           = useState({ name: '', email: '', role: 'Inspector', password: '' });
  const [submitting, setSubmitting]     = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([api.getFacilities(), api.getUsers()])
      .then(([fRes, uRes]) => {
        if (fRes.success) {
          setFacilities(fRes.data);
          setDrawerFacility(prev => prev ? fRes.data.find(f => f.id === prev.id) || prev : null);
        }
        if (uRes.success) setUsers(uRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const addFacility = async () => {
    if (!newFacility.name) return;
    setSubmitting(true);
    try {
      const res = await api.createFacility(newFacility);
      if (res.success) { setFacilities(p => [...p, res.data]); setFacilityModal(false); setNewFacility({ name: '', location: '', type: 'General Hospital' }); }
    } catch {}
    setSubmitting(false);
  };

  const handleEditFacility = async () => {
    if (!editFacilityData || !editFacilityData.name) return;
    setSubmitting(true);
    try {
      const res = await api.updateFacility(editFacilityData.id, editFacilityData);
      if (res.success) {
        setFacilities(p => p.map(f => f.id === editFacilityData.id ? res.data : f));
        setEditFacilityModal(false);
      }
    } catch {}
    setSubmitting(false);
  };

  const addUser = async () => {
    if (!newUser.name || !newUser.email) return;
    setSubmitting(true);
    try {
      const res = await api.createUser(newUser);
      if (res.success) { setUsers(p => [...p, res.data]); setInspectorModal(false); setNewUser({ name: '', email: '', role: 'Inspector', password: '' }); }
    } catch {}
    setSubmitting(false);
  };

  const handleDeleteFacility = (id) => {
    setDeleteModal({ open: true, id, type: 'facility' });
  };

  const handleDeleteUser = (id) => {
    setDeleteModal({ open: true, id, type: 'user' });
  };

  const executeDelete = async () => {
    const { id, type } = deleteModal;
    if (!id) return;
    try {
      if (type === 'facility') {
        const res = await api.deleteFacility(id);
        if (res.success) setFacilities(p => p.filter(f => f.id !== id));
      } else if (type === 'user') {
        const res = await api.deleteUser(id);
        if (res.success) setUsers(p => p.filter(u => u.id !== id));
      }
      setDeleteModal({ open: false, id: null, type: null });
    } catch {}
  };

  const toggleAssign = async (facilityId, inspectorId, isAssigned) => {
    try {
      if (isAssigned) await api.unassignInspector(facilityId, inspectorId);
      else await api.assignInspector(facilityId, inspectorId);
      loadData();
    } catch {}
  };

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="dashboard">
      <div className="section-head">
        <h2 className="section-title">Tenant Settings</h2>
        <p className="section-note">Multi-Tenant &amp; Facility Management</p>
      </div>

      <div className="admin-profile-card">
        <div className="admin-avatar">{(storedUser.name || 'AD').slice(0, 2).toUpperCase()}</div>
        <div className="admin-info">
          <h3>{storedUser.name || 'Admin User'}</h3>
          <p>{storedUser.email || 'admin@acomed.fr'}</p>
          <div className="admin-org">{storedUser.role || 'Admin'}</div>
        </div>
      </div>

      <div className="tabs-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className={`tab-btn ${activeTab === 'facilities' ? 'active' : ''}`} onClick={() => setActiveTab('facilities')}>Facilities</button>
          <button className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Team / Users</button>
        </div>
        <div>
          {activeTab === 'facilities'
            ? <button className="btn btn-primary" onClick={() => setFacilityModal(true)}>+ Add Facility</button>
            : <button className="btn btn-primary" onClick={() => setInspectorModal(true)}>+ Add Inspector</button>}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#88a8d4' }}>Loading…</div>
      ) : activeTab === 'facilities' ? (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Facility Name</th><th>Location</th><th>Type</th><th>Inspectors</th><th>Actions</th></tr></thead>
            <tbody>
              {facilities.length > 0 ? facilities.map(f => (
                <tr key={f.id}>
                  <td>{f.name}</td><td>{f.location}</td><td>{f.type}</td>
                  <td>
                    <button className="mapping-btn" onClick={() => { setDrawerFacility(f); setDrawerOpen(true); }}>
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                      {f.inspector_count ?? 0} Assigned
                    </button>
                  </td>
                  <td>
                    <button className="btn btn-secondary" onClick={() => { setEditFacilityData(f); setEditFacilityModal(true); }} style={{ padding: '4px 8px', fontSize: '10px', marginRight: '4px' }}>Edit</button>
                    <button className="btn btn-secondary" onClick={() => handleDeleteFacility(f.id)} style={{ padding: '4px 8px', fontSize: '10px', color: '#e05c6e', borderColor: '#e05c6e' }}>Delete</button>
                  </td>
                </tr>
              )) : <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px', color: '#88a8d4'}}>No facilities found. Add one above.</td></tr>}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Role</th><th>Email</th><th>Actions</th></tr></thead>
            <tbody>
              {users.length > 0 ? users.map(u => (
                <tr key={u.id}>
                  <td>{u.name}</td><td>{u.role}</td><td>{u.email}</td>
                  <td>
                    <select
                      className="form-control"
                      style={{ padding: '3px 6px', fontSize: '10px', width: 'auto' }}
                      value={u.role}
                      onChange={async e => {
                        const role = e.target.value;
                        try { await api.updateUserRole(u.id, role); setUsers(p => p.map(x => x.id === u.id ? { ...x, role } : x)); } catch {}
                      }}
                    >
                      <option>Admin</option><option>Inspector</option><option>Viewer</option>
                    </select>
                    <button className="btn btn-secondary" onClick={() => handleDeleteUser(u.id)} style={{ padding: '4px 8px', fontSize: '10px', color: '#e05c6e', borderColor: '#e05c6e', marginLeft: '8px' }}>Delete</button>
                  </td>
                </tr>
              )) : <tr><td colSpan="4" style={{textAlign: 'center', padding: '20px', color: '#88a8d4'}}>No users found. Add one above.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Assign Drawer */}
      {drawerOpen && drawerFacility && (
        <>
          <div className="assign-drawer-overlay open" onClick={() => setDrawerOpen(false)}></div>
          <div className="assign-drawer open">
            <div className="assign-drawer-head">
              <h3>Assign Inspectors</h3>
              <div style={{ fontSize: '12px', color: '#88a8d4' }}>{drawerFacility.name}</div>
              <button className="modal-close" onClick={() => setDrawerOpen(false)}>&times;</button>
            </div>
            <div className="assign-drawer-body">
              {users.filter(u => u.role === 'Inspector' || u.role === 'inspector').map(u => (
                <div key={u.id} className="inspector-assign-row">
                  <div className="inspector-info">
                    <div className="inspector-avatar">{u.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '13px' }}>{u.name}</div>
                      <div style={{ fontSize: '11px', color: '#88a8d4' }}>{u.role}</div>
                    </div>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={drawerFacility.inspector_ids?.includes(u.id) || drawerFacility.inspector_ids?.includes(String(u.id)) || false} 
                      onChange={() => toggleAssign(drawerFacility.id, u.id, drawerFacility.inspector_ids?.includes(u.id) || drawerFacility.inspector_ids?.includes(String(u.id)))} 
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              ))}
            </div>
            <div className="assign-drawer-foot">
              <button className="btn btn-primary" onClick={() => setDrawerOpen(false)}>Done</button>
            </div>
          </div>
        </>
      )}

      {/* Add Facility Modal */}
      {facilityModal && (
        <div className="modal-overlay open">
          <div className="modal-box">
            <div className="modal-head"><h3>Add New Facility</h3><button className="modal-close" onClick={() => setFacilityModal(false)}>&times;</button></div>
            <div className="modal-body">
              <div className="form-group"><label>Facility Name</label><input type="text" className="form-control" value={newFacility.name} onChange={e => setNewFacility(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Hôpital Ibn Sina" /></div>
              <div className="form-group"><label>Location</label><input type="text" className="form-control" value={newFacility.location} onChange={e => setNewFacility(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Casablanca, MA" /></div>
              <div className="form-group"><label>Type</label><select className="form-control" value={newFacility.type} onChange={e => setNewFacility(f => ({ ...f, type: e.target.value }))}><option>General Hospital</option><option>Specialized Clinic</option><option>Laboratory</option></select></div>
            </div>
            <div className="modal-foot">
              <button className="btn" onClick={() => setFacilityModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={addFacility} disabled={submitting}>{submitting ? 'Saving…' : 'Add Facility'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Facility Modal */}
      {editFacilityModal && editFacilityData && (
        <div className="modal-overlay open">
          <div className="modal-box">
            <div className="modal-head"><h3>Edit Facility</h3><button className="modal-close" onClick={() => setEditFacilityModal(false)}>&times;</button></div>
            <div className="modal-body">
              <div className="form-group"><label>Facility Name</label><input type="text" className="form-control" value={editFacilityData.name} onChange={e => setEditFacilityData(f => ({ ...f, name: e.target.value }))} /></div>
              <div className="form-group"><label>Location</label><input type="text" className="form-control" value={editFacilityData.location} onChange={e => setEditFacilityData(f => ({ ...f, location: e.target.value }))} /></div>
              <div className="form-group"><label>Type</label><select className="form-control" value={editFacilityData.type} onChange={e => setEditFacilityData(f => ({ ...f, type: e.target.value }))}><option>General Hospital</option><option>Specialized Clinic</option><option>Laboratory</option></select></div>
            </div>
            <div className="modal-foot">
              <button className="btn" onClick={() => setEditFacilityModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleEditFacility} disabled={submitting}>{submitting ? 'Saving…' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Inspector Modal */}
      {inspectorModal && (
        <div className="modal-overlay open">
          <div className="modal-box">
            <div className="modal-head"><h3>Add New Inspector</h3><button className="modal-close" onClick={() => setInspectorModal(false)}>&times;</button></div>
            <div className="modal-body">
              <div className="form-group"><label>Full Name</label><input type="text" className="form-control" value={newUser.name} onChange={e => setNewUser(u => ({ ...u, name: e.target.value }))} placeholder="Dr. Jane Doe" /></div>
              <div className="form-group"><label>Email</label><input type="email" className="form-control" value={newUser.email} onChange={e => setNewUser(u => ({ ...u, email: e.target.value }))} placeholder="jane.doe@acomed.fr" /></div>
              <div className="form-group"><label>Password</label><input type="password" className="form-control" value={newUser.password} onChange={e => setNewUser(u => ({ ...u, password: e.target.value }))} placeholder="Temporary password" /></div>
            </div>
            <div className="modal-foot">
              <button className="btn" onClick={() => setInspectorModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={addUser} disabled={submitting}>{submitting ? 'Saving…' : 'Add Inspector'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="modal-overlay open">
          <div className="modal-box" style={{ maxWidth: '400px' }}>
            <div className="modal-head">
              <h3>Confirm Delete</h3>
              <button className="modal-close" onClick={() => setDeleteModal({ open: false, id: null, type: null })}>&times;</button>
            </div>
            <div className="modal-body">
              <p style={{ color: '#121319', fontSize: '14px', margin: '0' }}>
                Are you sure you want to delete this {deleteModal.type}? This action cannot be undone.
              </p>
            </div>
            <div className="modal-foot">
              <button className="btn" onClick={() => setDeleteModal({ open: false, id: null, type: null })}>Cancel</button>
              <button className="btn" style={{ background: '#e05c6e', color: '#fff', border: 'none' }} onClick={executeDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
