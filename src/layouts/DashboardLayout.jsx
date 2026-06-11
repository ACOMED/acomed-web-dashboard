import React, { useEffect, useRef, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const menuOpenRef = useRef(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  const searchRef = useRef(null);
  const notifRef = useRef(null);

  // Fetch initial notifications
  useEffect(() => {
    api.getNotifications().then(res => {
      if (res.success && res.data) {
        setNotifications(res.data);
        setUnreadCount(res.data.length);
      }
    }).catch(() => {}); // ignore errors if endpoint not ready
  }, []);

  // Handle search typing
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }
    const timer = setTimeout(() => {
      setSearchLoading(true);
      api.globalSearch(searchQuery).then(res => {
        if (res.success && res.data) {
          setSearchResults(res.data);
          setIsSearchOpen(true);
        }
      }).catch(() => {
        // Mock fallback if backend isn't ready
        setSearchResults([{ id: 1, type: 'Audit', title: `Result for "${searchQuery}"`, link: '/audits-management' }]);
        setIsSearchOpen(true);
      }).finally(() => setSearchLoading(false));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const toggleMenu = () => {
    const isOpen = document.body.classList.toggle('menu-open');
    document.getElementById('sideMenu').setAttribute('aria-hidden', String(!isOpen));
    document.getElementById('menuToggle').setAttribute('aria-expanded', String(isOpen));
    menuOpenRef.current = isOpen;
  };

  const closeMenu = () => {
    document.body.classList.remove('menu-open');
    document.getElementById('sideMenu')?.setAttribute('aria-hidden', 'true');
    document.getElementById('menuToggle')?.setAttribute('aria-expanded', 'false');
    menuOpenRef.current = false;
  };

  // Close sidebar when route changes
  useEffect(() => { closeMenu(); }, [location.pathname]);

  // Close sidebar and dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpenRef.current) {
        const sideMenu = document.getElementById('sideMenu');
        const menuToggle = document.getElementById('menuToggle');
        if (sideMenu && !sideMenu.contains(event.target) && menuToggle && !menuToggle.contains(event.target)) {
          closeMenu();
        }
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) setIsSearchOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target)) setIsNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkRead = (id) => {
    api.markNotificationRead(id).catch(() => {});
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleToggleNotifMenu = () => {
    const opening = !isNotifOpen;
    setIsNotifOpen(opening);
    if (opening && unreadCount > 0) {
      setUnreadCount(0);
      api.markAllNotificationsRead().catch(() => {});
    }
  };

  // Group toggle for accordion nav
  const handleGroupToggle = (e) => {
    const btn = e.currentTarget;
    const group = btn.closest('.menu-group');
    const isOpen = group.classList.contains('open');
    document.querySelectorAll('.menu-group').forEach(g => g.classList.remove('open'));
    if (!isOpen) {
      group.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    } else {
      btn.setAttribute('aria-expanded', 'false');
    }
  };

  const isActive = (route) => location.pathname === `/${route}`;
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <>
      {/* ── Topbar ── */}
      <header className="topbar">
        <div className="topbar-inner">
          <div className="left-cluster">
            <button className="menu-btn" id="menuToggle" type="button" aria-label="Menu navigation" aria-controls="sideMenu" aria-expanded="false" onClick={toggleMenu}>
              <span className="lines" aria-hidden="true"><i></i><i></i><i></i></span>
            </button>
            <div className="brand">
              <img className="brand-logo" src="/logo.png" alt="ACOMED logo" />
            </div>
          </div>
          <nav className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="global-search" ref={searchRef} style={{ position: 'relative' }}>
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input 
                type="text" 
                placeholder="Search Audits, Facilities..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => { if (searchResults.length > 0) setIsSearchOpen(true); }}
              />
              {isSearchOpen && (
                <div style={{ position: 'absolute', top: '110%', left: 0, width: '100%', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', border: '1px solid #e2e7ef', overflow: 'hidden', zIndex: 100 }}>
                  {searchLoading ? (
                    <div style={{ padding: '12px', fontSize: '12px', color: '#88a8d4', textAlign: 'center' }}>Searching...</div>
                  ) : searchResults?.length > 0 ? (
                    searchResults.map(res => (
                      <div 
                        key={res.id} 
                        onClick={() => { navigate(res.link); setIsSearchOpen(false); setSearchQuery(''); }}
                        style={{ padding: '10px 12px', cursor: 'pointer', borderBottom: '1px solid #f5f8fd', display: 'flex', flexDirection: 'column' }}
                        onMouseOver={e => e.currentTarget.style.background = '#f5f8fd'}
                        onMouseOut={e => e.currentTarget.style.background = '#fff'}
                      >
                        <span style={{ fontSize: '11px', color: '#4a6fa5', fontWeight: '600', textTransform: 'uppercase' }}>{res.type}</span>
                        <span style={{ fontSize: '13px', color: '#121319' }}>{res.title}</span>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '12px', fontSize: '12px', color: '#88a8d4', textAlign: 'center' }}>No results found</div>
                  )}
                </div>
              )}
            </div>

            <div className="notif-container" ref={notifRef} style={{ position: 'relative' }}>
              <button className="notif-btn" aria-label="Notifications" onClick={handleToggleNotifMenu}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                {unreadCount > 0 && <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
              </button>
              {isNotifOpen && (
                <div style={{ position: 'absolute', top: '120%', right: 0, width: '300px', background: '#fff', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', border: '1px solid #e2e7ef', overflow: 'hidden', zIndex: 100 }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e7ef', fontWeight: '600', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Notifications
                    <span style={{ fontSize: '11px', color: '#4a6fa5', cursor: 'pointer' }} onClick={() => setNotifications([])}>Clear all</span>
                  </div>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {notifications?.length > 0 ? (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => handleMarkRead(n.id)}
                          style={{ padding: '12px 16px', borderBottom: '1px solid #f5f8fd', display: 'flex', gap: '12px', cursor: 'pointer', transition: 'background 0.2s' }}
                          onMouseOver={e => e.currentTarget.style.background = '#fbfcfe'}
                          onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4a6fa5', flexShrink: 0, marginTop: '6px' }}></div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '13px', color: '#121319', marginBottom: '4px' }}>{n.message}</div>
                            <div style={{ fontSize: '11px', color: '#88a8d4' }}>{n.time}</div>
                          </div>
                          <div style={{ color: '#c0c9d6' }}>
                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '24px', textAlign: 'center', color: '#88a8d4', fontSize: '13px' }}>You're all caught up!</div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <Link className={`pill ${isActive('knowledge-base') ? 'active' : ''}`} to="/knowledge-base" aria-label="Knowledge Base">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
              Knowledge Base
            </Link>
            <Link className={`pill ${isActive('profile') ? 'active' : ''}`} to="/profile" aria-label="Profile Settings">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"></circle><path d="M4 20c1.6-3.2 4.2-4.8 8-4.8s6.4 1.6 8 4.8"></path></svg>
              {storedUser.name || 'Account'}
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Overlay ── */}
      <div className="menu-overlay" id="menuOverlay" onClick={closeMenu}></div>

      {/* ── Sidebar ── */}
      <aside className="side-menu" id="sideMenu" aria-hidden="true">
        <div className="menu-head">
          <h3 className="menu-title"><img src="/logo.png" alt="ACOMED" /></h3>
          <button className="menu-close" id="menuClose" type="button" aria-label="Close menu" onClick={closeMenu}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6L18 18"></path><path d="M18 6L6 18"></path></svg>
          </button>
        </div>
        <nav className="menu-list" aria-label="Main menu">
          <section className={`menu-group ${isActive('overview') ? 'open' : ''}`} data-group="dashboard">
            <button className="group-toggle" type="button" aria-expanded={isActive('overview')} onClick={handleGroupToggle}>
              <span className="group-title">
                <svg className="group-icon" viewBox="0 0 24 24"><path d="M4 19V5"></path><path d="M10 19V9"></path><path d="M16 19v-6"></path><path d="M22 19V3"></path></svg>
                Dashboard
              </span>
              <svg className="group-chevron" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg>
            </button>
            <div className="group-content">
              <div className="group-inner">
                <Link className={`menu-sublink ${isActive('overview') ? 'active' : ''}`} to="/overview">Overview</Link>
              </div>
            </div>
          </section>

          <section className={`menu-group ${isActive('reports-hub') ? 'open' : ''}`} data-group="analytics">
            <button className="group-toggle" type="button" aria-expanded={isActive('reports-hub')} onClick={handleGroupToggle}>
              <span className="group-title">
                <svg className="group-icon" viewBox="0 0 24 24"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
                Analytics
              </span>
              <svg className="group-chevron" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg>
            </button>
            <div className="group-content">
              <div className="group-inner">
                <Link className={`menu-sublink ${isActive('reports-hub') ? 'active' : ''}`} to="/reports-hub">Reports Hub</Link>
              </div>
            </div>
          </section>

          <section className={`menu-group ${['template-builder','capa-workflow','prep-guides'].some(r=>isActive(r)) ? 'open' : ''}`} data-group="quality-management">
            <button className="group-toggle" type="button" aria-expanded={['template-builder','capa-workflow','prep-guides'].some(r=>isActive(r))} onClick={handleGroupToggle}>
              <span className="group-title">
                <svg className="group-icon" viewBox="0 0 24 24"><path d="M4 7h16"></path><path d="M4 12h11"></path><path d="M4 17h7"></path></svg>
                Quality Management
              </span>
              <svg className="group-chevron" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg>
            </button>
            <div className="group-content">
              <div className="group-inner">
                <Link className={`menu-sublink ${isActive('template-builder') ? 'active' : ''}`} to="/template-builder">Template Builder</Link>
                <Link className={`menu-sublink ${isActive('capa-workflow') ? 'active' : ''}`} to="/capa-workflow">CAPA Workflow</Link>
                <Link className={`menu-sublink ${isActive('prep-guides') ? 'active' : ''}`} to="/prep-guides">Preparation Guides</Link>
              </div>
            </div>
          </section>

          <section className={`menu-group ${isActive('audits-management') ? 'open' : ''}`} data-group="audits">
            <button className="group-toggle" type="button" aria-expanded={isActive('audits-management')} onClick={handleGroupToggle}>
              <span className="group-title">
                <svg className="group-icon" viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="2"></rect><path d="M4 10h16"></path></svg>
                Audits
              </span>
              <svg className="group-chevron" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg>
            </button>
            <div className="group-content">
              <div className="group-inner">
                <Link className={`menu-sublink ${isActive('audits-management') ? 'active' : ''}`} to="/audits-management">Audits Management</Link>
              </div>
            </div>
          </section>

          <section className={`menu-group ${isActive('tenant-settings') ? 'open' : ''}`} data-group="organization">
            <button className="group-toggle" type="button" aria-expanded={isActive('tenant-settings')} onClick={handleGroupToggle}>
              <span className="group-title">
                <svg className="group-icon" viewBox="0 0 24 24"><path d="M12 21v-6"></path><path d="M6 21v-3"></path><path d="M18 21v-9"></path><rect x="4" y="3" width="16" height="6" rx="2"></rect></svg>
                Organization
              </span>
              <svg className="group-chevron" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg>
            </button>
            <div className="group-content">
              <div className="group-inner">
                <Link className={`menu-sublink ${isActive('tenant-settings') ? 'active' : ''}`} to="/tenant-settings">Tenant Settings</Link>
              </div>
            </div>
          </section>
        </nav>
        <div className="menu-footer" style={{ padding: '16px', borderTop: '1px solid #e2e7ef', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #4a6fa5 0%, #355380 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700' }}>
              {(storedUser.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#121319', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{storedUser.name || 'Admin User'}</div>
              <div style={{ fontSize: '11px', color: '#88a8d4', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{storedUser.role || 'Administrator'}</div>
            </div>
          </div>
          <button 
            className="btn-logout"
            onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = '#/login'; }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Log Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className={location.pathname === '/template-builder' ? 'builder-mode' : ''}>
        <Outlet />
      </main>
    </>
  );
}
