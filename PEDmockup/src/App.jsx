import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import ExploreDashboard from './exploratory-dashboard';
import TreatmentDashboard from './treatment-experience-dashboard';
import DiseaseBurdenDashboard from './disease_burden_dashboard';
import QuestionsDashboard from './questions_dashboard';
import ResourcesReport from './resources_report';
function DisclaimerBanner() {
  return (
    <div style={{
      background: '#fef9c3', color: '#713f12', fontSize: '0.8rem',
      padding: '0.4rem 1.5rem', textAlign: 'center', borderBottom: '1px solid #fde68a',
    }}>
      Prototype only — all data shown are synthetic and do not represent real patients or clinical findings.
    </div>
  );
}

function Nav() {
  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '0.75rem 1.5rem', background: '#1e293b', borderBottom: '1px solid #334155' }}>
      <NavLink
        to="/explore"
        style={({ isActive }) => ({ color: isActive ? '#38bdf8' : '#94a3b8', textDecoration: 'none', fontWeight: 500 })}
      >
        Exploration
      </NavLink>
      <NavLink
        to="/treatment"
        end
        style={({ isActive }) => ({ color: isActive ? '#38bdf8' : '#94a3b8', textDecoration: 'none', fontWeight: 500 })}
      >
        Treatment Experience
      </NavLink>
      <NavLink
        to="/disease-burden"
        style={({ isActive }) => ({ color: isActive ? '#38bdf8' : '#94a3b8', textDecoration: 'none', fontWeight: 500 })}
      >
        Disease Burden
      </NavLink>
      <NavLink
        to="/questions"
        style={({ isActive }) => ({ color: isActive ? '#38bdf8' : '#94a3b8', textDecoration: 'none', fontWeight: 500 })}
      >
        FAQ Analysis
      </NavLink>
      <NavLink
        to="/rss-shared"
        style={({ isActive }) => ({ color: isActive ? '#38bdf8' : '#94a3b8', textDecoration: 'none', fontWeight: 500 })}
      >
        Resources Shared
      </NavLink>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/PEDmockup/dist">
      <DisclaimerBanner />
      <Nav />
      <Routes>
        <Route path="/" element={<Navigate to="/explore" replace />} />
        <Route path="/explore" element={<ExploreDashboard />} />
        <Route path="/treatment" element={<TreatmentDashboard />} />
        <Route path="/disease-burden" element={<DiseaseBurdenDashboard />} />
        <Route path="/questions" element={<QuestionsDashboard />} />
        <Route path="/rss-shared" element={<ResourcesReport />} />
      </Routes>
    </BrowserRouter>
  );
}