import React, { useState } from 'react';

export default function ProfileSettings() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [formData, setFormData] = useState({ name: user.name || '', email: user.email || '', password: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await api.updateProfile(formData);
      if (res.success && res.data) {
        setMessage('Profile updated successfully.');
        const updatedUser = { ...user, name: res.data.name, email: res.data.email };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        // Clear password field after successful update
        setFormData(prev => ({ ...prev, password: '' }));
      }
    } catch {
      setMessage('Failed to update profile.');
    }
    setSaving(false);
  };

  return (
    <div className="dashboard" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '40px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#121319', letterSpacing: '-0.5px' }}>Profile Settings</h2>
        <p style={{ fontSize: '15px', color: '#5c5d66', marginTop: '4px' }}>Update your personal details and security preferences.</p>
      </div>

      <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 8px 24px rgba(18, 19, 25, 0.04)', border: '1px solid #e2e7ef', overflow: 'hidden' }}>
        
        {/* Profile Header Gradient */}
        <div style={{ height: '120px', background: 'linear-gradient(135deg, #4a6fa5 0%, #3aad6e 100%)', position: 'relative' }}>
          <div style={{ position: 'absolute', bottom: '-40px', left: '32px', width: '80px', height: '80px', background: '#fff', borderRadius: '50%', padding: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <div style={{ width: '100%', height: '100%', background: '#f5f8fd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '700', color: '#4a6fa5' }}>
              {(user.name || 'U').slice(0, 1).toUpperCase()}
            </div>
          </div>
        </div>

        <div style={{ padding: '56px 32px 32px 32px' }}>
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#121319' }}>{user.name || 'User'}</h3>
            <p style={{ color: '#88a8d4', fontSize: '14px', fontWeight: '500' }}>{user.role || 'Admin'} • {user.email}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#5c5d66', marginBottom: '8px' }}>Full Name</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={e => setFormData({ ...formData, name: e.target.value })} 
                style={{ width: '100%', padding: '12px 16px', border: '1px solid #c0c9d6', borderRadius: '10px', fontSize: '15px', outline: 'none', transition: 'all 0.2s' }}
                onFocus={(e) => { e.target.style.border = '1px solid #4a6fa5'; e.target.style.boxShadow = '0 0 0 3px rgba(74, 111, 165, 0.1)'; }}
                onBlur={(e) => { e.target.style.border = '1px solid #c0c9d6'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#5c5d66', marginBottom: '8px' }}>Email Address</label>
              <input 
                type="email" 
                value={formData.email} 
                onChange={e => setFormData({ ...formData, email: e.target.value })} 
                style={{ width: '100%', padding: '12px 16px', border: '1px solid #c0c9d6', borderRadius: '10px', fontSize: '15px', outline: 'none', transition: 'all 0.2s' }}
                onFocus={(e) => { e.target.style.border = '1px solid #4a6fa5'; e.target.style.boxShadow = '0 0 0 3px rgba(74, 111, 165, 0.1)'; }}
                onBlur={(e) => { e.target.style.border = '1px solid #c0c9d6'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#5c5d66', marginBottom: '8px' }}>New Password</label>
            <input 
              type="password" 
              placeholder="Leave blank to keep current password"
              value={formData.password} 
              onChange={e => setFormData({ ...formData, password: e.target.value })} 
              style={{ width: '100%', padding: '12px 16px', border: '1px solid #c0c9d6', borderRadius: '10px', fontSize: '15px', outline: 'none', transition: 'all 0.2s' }}
              onFocus={(e) => { e.target.style.border = '1px solid #4a6fa5'; e.target.style.boxShadow = '0 0 0 3px rgba(74, 111, 165, 0.1)'; }}
              onBlur={(e) => { e.target.style.border = '1px solid #c0c9d6'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {message && (
            <div style={{ background: '#eefbee', color: '#206848', border: '1px solid #3aad6e', borderRadius: '10px', padding: '12px 16px', marginBottom: '24px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              {message}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '24px', borderTop: '1px solid #e2e7ef' }}>
            <button 
              onClick={handleSave} 
              disabled={saving}
              style={{
                background: '#121319',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 24px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.7 : 1,
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => { if (!saving) e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 4px 12px rgba(18, 19, 25, 0.2)'; }}
              onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}
            >
              {saving ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
