import React, { createContext, useState, useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom';

export const AppContext = createContext();

const Sidebar = ({ isOpen, setOpen, onLogout }) => {
  return (
    <>
      <div className={`mob-overlay ${isOpen ? 'open' : ''}`} onClick={() => setOpen(false)}></div>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="s-logo">
          <div className="logo-mark">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M3 12L12 3l9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
             <h1>TransGlobal</h1>
             <p>Panneau Admin</p>
          </div>
        </div>
        <nav className="s-nav">
          <div className="nlabel">Navigation</div>
          <NavLink to="/contacts" onClick={()=>setOpen(false)} className={({isActive}) => `ni ${isActive ? 'active' : ''}`}>
            <svg fill="none" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm11 5v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> Contacts
          </NavLink>
          <NavLink to="/offices" onClick={()=>setOpen(false)} className={({isActive}) => `ni ${isActive ? 'active' : ''}`}>
            <svg fill="none" viewBox="0 0 24 24"><path d="M3 21h18M9 21V9l6-6 6 6v12M9 21H3M21 21h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> Agences
          </NavLink>
          <NavLink to="/general-info" onClick={()=>setOpen(false)} className={({isActive}) => `ni ${isActive ? 'active' : ''}`}>
            <svg fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/><path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> Infos Générales
          </NavLink>
          <NavLink to="/sponsors" onClick={()=>setOpen(false)} className={({isActive}) => `ni ${isActive ? 'active' : ''}`}>
            <svg fill="none" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> Sponsors
          </NavLink>

          <div className="nlabel" style={{marginTop: '8px'}}>Contenu</div>
          <NavLink to="/content-blocks" onClick={()=>setOpen(false)} className={({isActive}) => `ni ${isActive ? 'active' : ''}`}>
            <svg fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/><line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="1.8"/><circle cx="8" cy="15" r="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M14 13h4M14 17h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> Blocs de Contenu
          </NavLink>
        </nav>
        <div className="s-foot">
          <div className="s-user">
            <div className="avatar">AD</div>
            <div style={{flex:1}}><div className="u-name">Admin</div><div className="u-role">Super-admin</div></div>
            <button className="btn btn-sm" onClick={onLogout} title="Déconnexion" style={{padding:'6px',border:'1px solid var(--bdr2)'}}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

const ApiBar = () => {
  const { theme, toggleTheme } = useContext(AppContext);

  return (
    <>
      <div className="api-bar">
        <div className="api-bar-r" style={{marginLeft: 'auto'}}>
          <button className="api-cfg-btn" onClick={toggleTheme} title="Basculer le thème" style={{display:'flex', alignItems:'center', gap:'4px'}}>
             {theme === 'dark' ? '☀️ Clair' : '🌙 Sombre'}
          </button>
        </div>
      </div>
    </>
  );
};

const Toast = () => {
  const { toastMsg, toastShow, toastOk } = useContext(AppContext);
  return (
    <div className={`toast ${toastShow ? 'show' : ''}`}>
      <div className="td" style={{background: toastOk ? 'var(--ok)' : 'var(--err)'}}></div>
      <span>{toastMsg}</span>
    </div>
  );
}

const routeMeta = {
  '/contacts': ['Contacts', 'Gestion des demandes de contact entrantes'],
  '/offices': ['Agences', 'Gérer les bureaux et agences régionales'],
  '/general-info': ['Infos Générales', 'Paramètres et informations de l\'entreprise'],
  '/sponsors': ['Sponsors', 'Gestion des logos partenaires et sponsors'],
  '/content-blocks': ['Blocs de Contenu', 'Titre · Description · Image — Gestion modulaire']
};

const Topbar = ({ setSidebarOpen }) => {
  const location = useLocation();
  const meta = routeMeta[location.pathname] || ['Dashboard', 'Vue d\'ensemble'];
  const { triggerAction } = useContext(AppContext);

  return (
    <div className="topbar">
      <div style={{display:'flex', alignItems:'center', gap:'16px'}}>
        <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
           <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <div>
          <div className="tb-title">{meta[0]}</div>
          <div className="tb-sub">{meta[1]}</div>
        </div>
      </div>
      <div id="tb-acts">
        {location.pathname === '/offices' && (
          <button className="btn btn-p" onClick={() => triggerAction('new-office')}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
            <span style={{display: window.innerWidth < 640 ? 'none' : 'inline'}}>Nouvelle Agence</span>
          </button>
        )}
        {location.pathname === '/content-blocks' && (
          <button className="btn btn-p" onClick={() => triggerAction('new-block')}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
            <span style={{display: window.innerWidth < 640 ? 'none' : 'inline'}}>Nouveau Bloc</span>
          </button>
        )}
      </div>
    </div>
  );
};

/* ─── Route guard: redirects to /login if not authenticated ─── */
const ProtectedRoute = ({ admin, children }) => {
  if (!admin) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

/* ─── Login wrapper: uses useNavigate to redirect after login ─── */
import LoginPage from './pages/Login';

const LoginRoute = ({ admin, onLogin }) => {
  const navigate = useNavigate();

  // If already logged in, redirect to contacts
  if (admin) {
    return <Navigate to="/contacts" replace />;
  }

  const handleLogin = (adminData) => {
    onLogin(adminData);
    navigate('/contacts', { replace: true });
  };

  return <LoginPage onLogin={handleLogin} />;
};

import Contacts from './pages/Contacts';
import Offices from './pages/Offices';
import GeneralInfo from './pages/GeneralInfo';
import Sponsors from './pages/Sponsors';
import ContentBlocks from './pages/ContentBlocks';

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem('tg_theme') || 'dark');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toastShow, setToastShow] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastOk, setToastOk] = useState(true);
  
  const [baseUrl, setBaseUrl] = useState(
    localStorage.getItem('tg_api') || import.meta.env.VITE_API_URL || 'http://localhost:9090'
  );
  const [actionTrigger, setActionTrigger] = useState(null); 

  // ─── Auth state ───
  const [admin, setAdmin] = useState(() => {
    try {
      const stored = localStorage.getItem('tg_admin');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const handleLogin = (adminData) => {
    setAdmin(adminData);
  };

  const handleLogout = () => {
    localStorage.removeItem('tg_admin');
    setAdmin(null);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('tg_theme', newTheme);
  };

  let toastTimeout;
  const showToast = (msg, ok = true) => {
    setToastMsg(msg); setToastOk(ok); setToastShow(true);
    clearTimeout(toastTimeout); toastTimeout = setTimeout(() => setToastShow(false), 3500);
  };

  const pingUrl = async (url) => {};

  const triggerAction = (action) => setActionTrigger({ action, ts: Date.now() });

  return (
    <AppContext.Provider value={{
      baseUrl, setBaseUrl, pingUrl,
      toastShow, toastMsg, toastOk, showToast,
      actionTrigger, triggerAction, theme, toggleTheme,
      admin
    }}>
      <BrowserRouter>
        <Routes>
          {/* ─── Login route (public) ─── */}
          <Route path="/login" element={<LoginRoute admin={admin} onLogin={handleLogin} />} />

          {/* ─── Protected routes (need auth) ─── */}
          <Route path="/*" element={
            <ProtectedRoute admin={admin}>
              <Sidebar isOpen={sidebarOpen} setOpen={setSidebarOpen} onLogout={handleLogout} />
              <main className="main">
                <ApiBar />
                <Topbar setSidebarOpen={setSidebarOpen} />
                <div className="content">
                  <Routes>
                    <Route path="/" element={<Navigate to="/contacts" replace />} />
                    <Route path="/contacts" element={<Contacts />} />
                    <Route path="/offices" element={<Offices />} />
                    <Route path="/general-info" element={<GeneralInfo />} />
                    <Route path="/sponsors" element={<Sponsors />} />
                    <Route path="/content-blocks" element={<ContentBlocks />} />
                    <Route path="*" element={<Navigate to="/contacts" replace />} />
                  </Routes>
                </div>
              </main>
            </ProtectedRoute>
          } />
        </Routes>
        <Toast />
      </BrowserRouter>
    </AppContext.Provider>
  );
}
