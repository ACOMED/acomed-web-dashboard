import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const CATEGORIES = ['General FAQ', 'Audit Execution', 'CAPA Resolution', 'Templates'];

export default function KnowledgeBase() {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getKnowledgeBaseArticles()
      .then(res => { if (res.success) setArticles(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = articles.filter(a => {
    if (activeCat !== 'All' && a.category !== activeCat) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="dashboard" style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '40px' }}>
      
      {/* Hero Search Section */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', background: 'linear-gradient(135deg, #e8f0fe 0%, #d1e0fc 100%)', borderRadius: '20px', color: '#4a6fa5', marginBottom: '24px', boxShadow: '0 8px 16px rgba(74, 111, 165, 0.15)' }}>
          <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#121319', marginBottom: '16px', letterSpacing: '-1px' }}>How can we help?</h1>
        <p style={{ fontSize: '16px', color: '#5c5d66', marginBottom: '32px' }}>Search our knowledge base or browse categories below to find answers.</p>
        
        <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="#88a8d4" strokeWidth="2" fill="none" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            placeholder="Search articles, guides, and FAQs..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '20px 20px 20px 56px',
              fontSize: '16px',
              border: '2px solid transparent',
              borderRadius: '16px',
              boxShadow: '0 12px 32px rgba(18, 19, 25, 0.08)',
              outline: 'none',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => e.target.style.border = '2px solid #4a6fa5'}
            onBlur={(e) => e.target.style.border = '2px solid transparent'}
          />
        </div>
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '40px', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setActiveCat('All')}
          style={{ padding: '10px 20px', borderRadius: '30px', border: 'none', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease', background: activeCat === 'All' ? '#121319' : '#fff', color: activeCat === 'All' ? '#fff' : '#5c5d66', boxShadow: activeCat === 'All' ? '0 4px 12px rgba(18, 19, 25, 0.2)' : '0 2px 4px rgba(18,19,25,0.05)' }}
        >All Categories</button>
        {CATEGORIES.map(c => (
          <button 
            key={c}
            onClick={() => setActiveCat(c)}
            style={{ padding: '10px 20px', borderRadius: '30px', border: 'none', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease', background: activeCat === c ? '#121319' : '#fff', color: activeCat === c ? '#fff' : '#5c5d66', boxShadow: activeCat === c ? '0 4px 12px rgba(18, 19, 25, 0.2)' : '0 2px 4px rgba(18,19,25,0.05)' }}
          >{c}</button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', color: '#88a8d4' }}>Loading articles...</div>
        ) : filtered.length > 0 ? filtered.map(a => (
          <div 
            key={a.id} 
            style={{ 
              background: '#fff', 
              borderRadius: '16px', 
              padding: '32px', 
              boxShadow: '0 4px 12px rgba(18, 19, 25, 0.04)',
              border: '1px solid #e2e7ef',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 32px rgba(18, 19, 25, 0.1)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(18, 19, 25, 0.04)'; }}
          >
            <div style={{ display: 'inline-block', padding: '6px 12px', background: '#f5f8fd', color: '#4a6fa5', borderRadius: '20px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '16px' }}>
              {a.category}
            </div>
            <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#121319', marginBottom: '12px', lineHeight: '1.4' }}>{a.title}</h4>
            <p style={{ color: '#5c5d66', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>{a.snippet}</p>
            <div style={{ color: '#4a6fa5', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Read Article <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </div>
          </div>
        )) : (
          <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', background: '#fff', borderRadius: '16px', border: '1px dashed #c0c9d6' }}>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#121319', marginBottom: '8px' }}>No results found</div>
            <p style={{ color: '#88a8d4', fontSize: '15px' }}>Try adjusting your search query or category filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
