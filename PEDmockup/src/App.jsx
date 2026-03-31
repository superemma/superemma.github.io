import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import TreatmentDashboard from './treatment-experience-dashboard';
import Dashboard from './dashboard';
import QuestionsDashboard from './questions_dashboard';

function Nav() {
  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '0.75rem 1.5rem', background: '#1e293b', borderBottom: '1px solid #334155' }}>
      <NavLink
        to="/"
        end
        style={({ isActive }) => ({ color: isActive ? '#38bdf8' : '#94a3b8', textDecoration: 'none', fontWeight: 500 })}
      >
        Treatment Experience
      </NavLink>
      <NavLink
        to="/wheel"
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
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/PEDmockup/dist">
      <Nav />
      <Routes>
        <Route path="/" element={<TreatmentDashboard />} />
        <Route path="/wheel" element={<Dashboard />} />
        <Route path="/questions" element={<QuestionsDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}