import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import Overview from './pages/Overview';
import TemplateBuilder from './pages/TemplateBuilder';
import CapaBoard from './pages/CapaBoard';
import AuditsManagement from './pages/AuditsManagement';
import TenantSettings from './pages/TenantSettings';
import AuditReport from './pages/AuditReport';
import PrepGuides from './pages/PrepGuides';
import ReportsHub from './pages/ReportsHub';
import ProfileSettings from './pages/ProfileSettings';
import KnowledgeBase from './pages/KnowledgeBase';

// ── Guard: redirect to /login if no JWT in localStorage or if role is inspector ──
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token) return <Navigate to="/login" replace />;
  
  if (user.role && user.role.toLowerCase() === 'inspector') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login"   element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="overview"          element={<Overview />} />
          <Route path="template-builder"  element={<TemplateBuilder />} />
          <Route path="capa-workflow"     element={<CapaBoard />} />
          <Route path="audits-management" element={<AuditsManagement />} />
          <Route path="audit-report/:id"  element={<AuditReport />} />
          <Route path="audit-report"      element={<AuditReport />} />
          <Route path="tenant-settings"   element={<TenantSettings />} />
          <Route path="prep-guides"       element={<PrepGuides />} />
          <Route path="reports-hub"       element={<ReportsHub />} />
          <Route path="profile"           element={<ProfileSettings />} />
          <Route path="knowledge-base"    element={<KnowledgeBase />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
