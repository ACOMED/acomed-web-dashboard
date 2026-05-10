import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      if (res.success && res.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        navigate('/overview');
      } else {
        setError(res.message || 'Invalid email or password.');
      }
    } catch {
      setError('Cannot reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', 'Segoe UI', sans-serif", background: '#ffffff' }}>
      
      {/* Left side - Login Form Area */}
      <div style={{
        flex: '0 0 50%',
        display: 'flex',
        flexDirection: 'column',
        padding: '40px 60px',
        background: '#ffffff',
        position: 'relative'
      }}>
        {/* Header: Logo & Log in link */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '80px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo.png" alt="ACOMED Logo" style={{ height: '32px' }} />
          </div>
          <a href="#" style={{ color: '#4b5563', fontSize: '14px', textDecoration: 'none', fontWeight: '500' }}>Contact Admin</a>
        </div>

        <div style={{ width: '100%', maxWidth: '440px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', marginBottom: '32px', textAlign: 'center', letterSpacing: '-0.02em' }}>
            Sign in to your account
          </h2>



          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px', fontSize: '13px', color: '#b91c1c', marginBottom: '24px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#374151', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>Company email <span style={{color: '#ef4444'}}>*</span></label>
              <input 
                type="email" 
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '12px',
                  color: '#111827',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'; }}
                onBlur={e => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ color: '#374151', fontSize: '12px', fontWeight: '600' }}>Password <span style={{color: '#ef4444'}}>*</span></label>
              </div>
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '12px',
                  color: '#111827',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'; }}
                onBlur={e => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{
                width: '100%',
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '14px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.8 : 1,
                transition: 'background 0.2s',
              }}
              onMouseOver={(e) => !loading && (e.target.style.background = '#1e293b')}
              onMouseOut={(e) => !loading && (e.target.style.background = '#0f172a')}
            >
              {loading ? 'Authenticating...' : 'Sign in'}
            </button>
          </form>
          
          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#4b5563' }}>
            Don't have an account? <a href="#" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>Contact Admin</a>
          </p>

          <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '11px', color: '#6b7280', lineHeight: '1.6' }}>
            By signing in, you agree to ACOMED's <a href="#" style={{ color: '#4b5563', textDecoration: 'underline' }}>Terms of Service</a> and <a href="#" style={{ color: '#4b5563', textDecoration: 'underline' }}>Privacy Policy</a>
          </p>
        </div>
      </div>

      {/* Right side - Image Cover Area */}
      <div style={{
        flex: '0 0 50%',
        background: 'url(/login_human_bg.png) center center / cover no-repeat',
        position: 'relative'
      }}>
      </div>

    </div>
  );
}
