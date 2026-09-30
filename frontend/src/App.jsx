import React, { useState, useRef, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import {
  Activity, Mic, Square, User, Lock, LogOut, Users,
  Plus, TrendingUp, CheckCircle, ChevronRight, Volume2,
  Brain, Zap, Heart, Star, Upload, BarChart2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API = 'http://localhost:8000';

// ══════════════════════════════════════════════════
// Global Styles
// ══════════════════════════════════════════════════
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    font-family: 'Inter', system-ui, sans-serif;
    background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
    min-height: 100vh;
    color: #e2e8f0;
  }

  /* ── 3D Text Effect ── */
  .text-3d {
    background: linear-gradient(135deg, #a78bfa, #60a5fa, #34d399);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 0 20px rgba(167,139,250,0.5));
  }
  .text-3d-sm {
    background: linear-gradient(90deg, #f472b6, #a78bfa, #60a5fa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── Glass Cards ── */
  .glass {
    background: rgba(255,255,255,0.07);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 20px;
  }
  .glass-light {
    background: rgba(255,255,255,0.95);
    border: 1px solid rgba(167,139,250,0.2);
    border-radius: 20px;
    color: #1e293b;
  }

  /* ── Glow Effects ── */
  .glow-purple { box-shadow: 0 0 30px rgba(139,92,246,0.4), 0 0 60px rgba(139,92,246,0.1); }
  .glow-blue   { box-shadow: 0 0 30px rgba(59,130,246,0.4), 0 0 60px rgba(59,130,246,0.1); }
  .glow-green  { box-shadow: 0 0 30px rgba(52,211,153,0.4), 0 0 60px rgba(52,211,153,0.1); }

  /* ── Buttons ── */
  .btn-glow {
    background: linear-gradient(135deg, #7c3aed, #4f46e5);
    color: white; border: none;
    padding: 12px 28px; border-radius: 999px;
    font-weight: 700; font-size: 14px; cursor: pointer;
    transition: all 0.25s cubic-bezier(.22,.68,0,1.2);
    box-shadow: 0 4px 20px rgba(79,70,229,0.5);
    display: inline-flex; align-items: center; gap: 8px;
  }
  .btn-glow:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 8px 30px rgba(79,70,229,0.7); }
  .btn-glow:active { transform: scale(0.97); }
  .btn-glow:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .btn-danger {
    background: linear-gradient(135deg, #dc2626, #ef4444);
    color: white; border: none;
    padding: 12px 28px; border-radius: 999px;
    font-weight: 700; font-size: 14px; cursor: pointer;
    display: inline-flex; align-items: center; gap: 8px;
    box-shadow: 0 4px 20px rgba(239,68,68,0.5);
  }
  .btn-outline-glow {
    background: transparent;
    color: #a78bfa; border: 1.5px solid rgba(167,139,250,0.5);
    padding: 10px 20px; border-radius: 999px;
    font-weight: 600; font-size: 13px; cursor: pointer;
    display: inline-flex; align-items: center; gap: 7px;
    transition: all 0.2s;
  }
  .btn-outline-glow:hover { background: rgba(167,139,250,0.1); border-color: #a78bfa; }

  /* ── Tab Buttons ── */
  .tab-btn {
    padding: 10px 22px; border-radius: 999px; border: none;
    font-weight: 600; font-size: 13px; cursor: pointer;
    display: inline-flex; align-items: center; gap: 7px;
    transition: all 0.2s;
  }
  .tab-active { background: linear-gradient(135deg, #7c3aed, #4f46e5); color: white; box-shadow: 0 4px 16px rgba(79,70,229,0.4); }
  .tab-inactive { background: rgba(255,255,255,0.08); color: #94a3b8; }
  .tab-inactive:hover { background: rgba(255,255,255,0.12); color: #c4b5fd; }

  /* ── Animations ── */
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-8px); }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(167,139,250,0.3); }
    50%       { box-shadow: 0 0 40px rgba(167,139,250,0.8), 0 0 80px rgba(167,139,250,0.3); }
  }
  @keyframes record-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
    70%       { box-shadow: 0 0 0 16px rgba(239,68,68,0); }
  }
  @keyframes spin { 100% { transform: rotate(360deg); } }
  @keyframes slide-in {
    from { opacity: 0; transform: translateX(50px) scale(0.95); }
    to   { opacity: 1; transform: translateX(0) scale(1); }
  }
  @keyframes slide-out {
    from { opacity: 1; transform: translateX(0) scale(1); }
    to   { opacity: 0; transform: translateX(-50px) scale(0.95); }
  }
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pop {
    0%   { transform: scale(0.7); opacity: 0; }
    70%  { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes shimmer {
    0%   { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
  @keyframes orb {
    0%   { transform: translate(0,0) scale(1); }
    33%  { transform: translate(30px,-20px) scale(1.05); }
    66%  { transform: translate(-20px,10px) scale(0.95); }
    100% { transform: translate(0,0) scale(1); }
  }

  .float       { animation: float 3s ease-in-out infinite; }
  .pulse-glow  { animation: pulse-glow 2s ease-in-out infinite; }
  .recording   { animation: record-pulse 1.2s ease-out infinite; }
  .spinner     { animation: spin 1s linear infinite; }
  .slide-in    { animation: slide-in 0.45s cubic-bezier(.22,.68,0,1.2) both; }
  .slide-out   { animation: slide-out 0.3s ease both; }
  .fade-up     { animation: fade-up 0.5s ease both; }
  .pop         { animation: pop 0.4s cubic-bezier(.22,.68,0,1.2) both; }

  /* Orb background */
  .orb { animation: orb 8s ease-in-out infinite; border-radius: 50%; filter: blur(80px); position: absolute; opacity: 0.15; pointer-events: none; }

  /* Table styles */
  table { width: 100%; border-collapse: collapse; }
  th { font-size: 12px; font-weight: 600; color: #64748b; text-align: left; padding: 10px 14px; border-bottom: 1px solid rgba(255,255,255,0.06); }
  td { font-size: 14px; padding: 14px; border-bottom: 1px solid rgba(255,255,255,0.04); }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); }
  ::-webkit-scrollbar-thumb { background: rgba(167,139,250,0.3); border-radius: 99px; }

  /* Audio element */
  audio { width: 100%; filter: invert(1) hue-rotate(180deg); opacity: 0.8; }

  /* Input */
  .input-glass {
    background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.15);
    border-radius: 12px; color: #e2e8f0; padding: 11px 16px; font-size: 14px;
    outline: none; transition: border-color 0.2s;
  }
  .input-glass::placeholder { color: #64748b; }
  .input-glass:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.2); }
`;

// ══════════════════════════════════════════════════
// Root
// ══════════════════════════════════════════════════
export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const s = localStorage.getItem('ns_user');
    if (s) try { setUser(JSON.parse(s)); } catch {}
  }, []);

  const login  = u  => { setUser(u); localStorage.setItem('ns_user', JSON.stringify(u)); };
  const logout = () => { setUser(null); localStorage.removeItem('ns_user'); };

  return (
    <>
      <style>{CSS}</style>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          {/* Ambient orbs */}
          <div className="orb" style={{ width: 500, height: 500, background: '#7c3aed', top: -100, left: -100 }} />
          <div className="orb" style={{ width: 400, height: 400, background: '#2563eb', top: 200, right: -50, animationDelay: '3s' }} />
          <div className="orb" style={{ width: 300, height: 300, background: '#059669', bottom: 50, left: '40%', animationDelay: '6s' }} />

          <Header user={user} onLogout={logout} />

          <main style={{ flex: 1, padding: '1.5rem 2rem', position: 'relative', zIndex: 1 }}>
            <Routes>
              <Route path="/"          element={!user ? <AuthScreen onLogin={login} /> : <Navigate to={`/${user.role}`} />} />
              <Route path="/patient"   element={user?.role === 'patient'   ? <PatientDashboard user={user} />   : <Navigate to="/" />} />
              <Route path="/clinician" element={user?.role === 'clinician' ? <ClinicianDashboard user={user} /> : <Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </>
  );
}

// ══════════════════════════════════════════════════
// Header
// ══════════════════════════════════════════════════
function Header({ user, onLogout }) {
  return (
    <header style={{
      padding: '1rem 2rem',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      background: 'rgba(0,0,0,0.2)',
      backdropFilter: 'blur(20px)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="pulse-glow" style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Brain size={22} color="white" />
        </div>
        <div>
          <span className="text-3d" style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.5, display: 'block', lineHeight: 1 }}>NeuroSpeak</span>
          <span style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>Clinical AI Assessment Platform</span>
        </div>
      </div>

      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#a78bfa,#60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>
              {user.username[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{user.username}</div>
              <div style={{ fontSize: 11, color: '#7c3aed', fontWeight: 600, textTransform: 'capitalize' }}>{user.role}</div>
            </div>
          </div>
          <button onClick={onLogout} className="btn-outline-glow" style={{ fontSize: 12, padding: '7px 14px' }}>
            <LogOut size={13} /> Logout
          </button>
        </div>
      )}
    </header>
  );
}

// ══════════════════════════════════════════════════
// Auth Screen
// ══════════════════════════════════════════════════
function AuthScreen({ onLogin }) {
  const [reg, setReg] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const ep = reg ? '/api/register' : '/api/login';
      const res = await axios.post(`${API}${ep}`, reg ? { username, password, role } : { username, password });
      onLogin(res.data.user);
      nav(`/${res.data.user.role}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 440, margin: '4rem auto' }} className="fade-up">
      {/* Logo area */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="float" style={{ display: 'inline-block' }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 0 40px rgba(124,58,237,0.6)' }}>
            <Brain size={36} color="white" />
          </div>
        </div>
        <h1 className="text-3d" style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, marginBottom: 6 }}>NeuroSpeak AI</h1>
        <p style={{ color: '#64748b', fontSize: 14 }}>Clinical Speech Assessment Platform</p>
      </div>

      <div className="glass" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: '1.5rem', color: '#e2e8f0', textAlign: 'center' }}>
          {reg ? 'Create Account' : 'Welcome Back'}
        </h2>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '10px 14px', borderRadius: 10, marginBottom: '1rem', fontSize: 14 }}>
            {error}
          </div>
        )}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <div style={{ position: 'relative' }}>
            <User size={16} style={{ position: 'absolute', left: 14, top: 13, color: '#64748b' }} />
            <input className="input-glass" type="text" placeholder="Username" value={username} required
              onChange={e => setUsername(e.target.value)} style={{ width: '100%', paddingLeft: 40 }} />
          </div>
          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position: 'absolute', left: 14, top: 13, color: '#64748b' }} />
            <input className="input-glass" type="password" placeholder="Password" value={password} required
              onChange={e => setPassword(e.target.value)} style={{ width: '100%', paddingLeft: 40 }} />
          </div>
          {reg && (
            <select value={role} onChange={e => setRole(e.target.value)} className="input-glass" style={{ width: '100%' }}>
              <option value="patient">Patient</option>
              <option value="clinician">Clinician</option>
            </select>
          )}
          <button type="submit" className="btn-glow" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: 13, fontSize: 15, borderRadius: 12, marginTop: 4 }}>
            {loading ? <><Activity size={16} className="spinner" /> Please wait…</> : reg ? 'Create Account' : 'Sign In →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: 13, color: '#64748b' }}>
          {reg ? 'Already have an account? ' : 'New here? '}
          <span onClick={() => setReg(!reg)} style={{ color: '#a78bfa', fontWeight: 600, cursor: 'pointer' }}>
            {reg ? 'Sign In' : 'Register'}
          </span>
        </p>

        {!reg && (
          <div style={{ marginTop: '1.25rem', padding: '10px 14px', background: 'rgba(167,139,250,0.08)', borderRadius: 10, fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>
            Demo: <b style={{ color: '#c4b5fd' }}>patient1 / pass123</b> · <b style={{ color: '#c4b5fd' }}>clinician1 / admin123</b>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// Patient Dashboard
// ══════════════════════════════════════════════════
function PatientDashboard({ user }) {
  const [data, setData] = useState({ assessments: [], rehab: [] });
  const [words, setWords] = useState([]);
  const [tab, setTab] = useState('trends');

  const refresh = useCallback(() => {
    axios.get(`${API}/api/patient/${user.id}/progress`).then(r => setData(r.data)).catch(console.error);
    axios.get(`${API}/api/words`).then(r => setWords(r.data)).catch(console.error);
  }, [user.id]);

  useEffect(() => { refresh(); }, [refresh]);

  const sevMap = { Normal: 4, Mild: 3, Moderate: 2, Severe: 1 };
  const chartData = data.assessments.map((a, i) => {
    const m = JSON.parse(a.metrics || '{}');
    return { name: `S${i + 1}`, score: sevMap[a.severity] || 0, severity: a.severity, f0_std: m.f0_std || 0, centroid: m.spectral_centroid || 0 };
  });

  const tabs = [
    { id: 'trends', icon: <TrendingUp size={15} />, label: 'Acoustic Trends' },
    { id: 'rehab',  icon: <Zap size={15} />, label: 'Rehab Studio' },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {[
          { icon: <BarChart2 size={20} />, label: 'Total Sessions', value: data.assessments.length, color: '#7c3aed' },
          { icon: <Brain size={20} />, label: 'Latest Severity', value: data.assessments.length ? data.assessments.at(-1).severity : 'N/A', color: '#0ea5e9' },
          { icon: <CheckCircle size={20} />, label: 'Words Mastered', value: data.rehab.filter(r => r.score >= 80).length, color: '#10b981' },
          { icon: <Star size={20} />, label: 'Rehab Words', value: words.length, color: '#f59e0b' },
        ].map((s, i) => (
          <div key={i} className="glass fade-up" style={{ padding: '1.25rem', animationDelay: `${i * 0.08}s` }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, marginBottom: 10 }}>
              {s.icon}
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#e2e8f0', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8 }}>
        {tabs.map(t => (
          <button key={t.id} className={`tab-btn ${tab === t.id ? 'tab-active' : 'tab-inactive'}`} onClick={() => setTab(t.id)}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── TRENDS TAB ── */}
      {tab === 'trends' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="fade-up">
          <div className="glass" style={{ padding: '1.75rem' }}>
            <SectionHeader icon={<Mic size={18} />} title="Real-Time Utterance Analyzer" sub="Record or upload speech · Full HuBERT + Whisper 4-stage pipeline" />
            <AudioAnalyzer patientId={user.id} onComplete={refresh} showPipeline />
          </div>

          <div className="glass" style={{ padding: '1.75rem' }}>
            <SectionHeader icon={<TrendingUp size={18} />} title="Overall Recovery Progress" />
            {chartData.length > 0
              ? <GlowChart data={chartData} dataKey="score" color="#a78bfa" yDomain={[0,4]} yFormatter={v => v===4?'Normal':v===3?'Mild':v===2?'Moderate':'Severe'} tooltipFn={(_, __, p) => [p.payload.severity, 'Status']} />
              : <EmptyState />}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="glass" style={{ padding: '1.75rem' }}>
              <SectionHeader icon={<Activity size={16} />} title="Pitch Stability (F0 Std)" />
              {chartData.length > 0 ? <GlowChart data={chartData} dataKey="f0_std" color="#34d399" /> : <EmptyState />}
            </div>
            <div className="glass" style={{ padding: '1.75rem' }}>
              <SectionHeader icon={<Zap size={16} />} title="Spectral Centroid" />
              {chartData.length > 0 ? <GlowChart data={chartData} dataKey="centroid" color="#60a5fa" /> : <EmptyState />}
            </div>
          </div>
        </div>
      )}

      {/* ── REHAB TAB ── */}
      {tab === 'rehab' && (
        <div className="fade-up">
          <RehabStudio user={user} words={words} rehabData={data.rehab} onRefresh={refresh} />
        </div>
      )}
    </div>
  );
}

function SectionHeader({ icon, title, sub }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: sub ? 4 : 0 }}>
        <span style={{ color: '#a78bfa' }}>{icon}</span>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0' }}>{title}</h2>
      </div>
      {sub && <p style={{ fontSize: 13, color: '#64748b', marginLeft: 26 }}>{sub}</p>}
    </div>
  );
}

function GlowChart({ data, dataKey, color, yDomain, yFormatter, tooltipFn }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <defs>
          <filter id={`glow-${dataKey}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
        <YAxis domain={yDomain} tickFormatter={yFormatter} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={yFormatter ? 72 : 40} />
        <Tooltip contentStyle={{ background: 'rgba(15,12,41,0.9)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 10, color: '#e2e8f0', fontSize: 13 }} formatter={tooltipFn} />
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} dot={{ r: 5, fill: color, strokeWidth: 2, stroke: '#0f0c29' }} activeDot={{ r: 8, filter: `url(#glow-${dataKey})` }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function EmptyState() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 0', gap: 10 }}>
      <Activity size={32} color="#334155" />
      <p style={{ color: '#334155', fontSize: 14 }}>No data yet — record an utterance to begin</p>
    </div>
  );
}

// ══════════════════════════════════════════════════
// Audio Analyzer Component
// ══════════════════════════════════════════════════
function AudioAnalyzer({ patientId, onComplete, showPipeline }) {
  const [phase, setPhase] = useState('idle');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [recSeconds, setRecSeconds] = useState(0);

  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const fileInputRef = useRef(null);
  const timerRef = useRef(null);

  const startRecording = async () => {
    setError(''); setResult(null); setAudioUrl(null); setRecSeconds(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 16000 } });
      const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg'].find(t => MediaRecorder.isTypeSupported(t)) || '';
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = e => { if (e.data?.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        clearInterval(timerRef.current);
        if (chunksRef.current.length === 0) { setError('No audio captured. Try again.'); setPhase('idle'); return; }
        const blob = new Blob(chunksRef.current, { type: mimeType || 'audio/webm' });
        setAudioUrl(URL.createObjectURL(blob));
        submit(blob);
      };
      recorder.start(200);
      setPhase('recording');
      timerRef.current = setInterval(() => setRecSeconds(s => s + 1), 1000);
    } catch (e) {
      setError('Microphone blocked. Open browser settings → Site Settings → Allow Microphone.');
    }
  };

  const stopRecording = () => {
    if (recorderRef.current?.state !== 'inactive') { recorderRef.current.stop(); }
    setPhase('processing');
  };

  const handleFile = e => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAudioUrl(URL.createObjectURL(f));
    submit(f);
    e.target.value = '';
  };

  const submit = async blob => {
    setPhase('processing'); setError('');
    const fd = new FormData();
    fd.append('file', new File([blob], 'recording.webm', { type: blob.type || 'audio/webm' }));
    if (patientId) fd.append('patient_id', String(patientId));
    try {
      const res = await axios.post(`${API}/api/analyze-utterance`, fd, { timeout: 180000 });
      setResult(res.data);
      setPhase('done');
      if (onComplete) onComplete();
    } catch (err) {
      const msg = err.response?.data?.detail || err.message;
      setError(msg.includes('ffmpeg') ? `${msg}` : `Analysis error: ${msg}`);
      setPhase('idle');
    }
  };

  const SEV = {
    Severe:   { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.4)', text: '#fca5a5', glow: 'rgba(239,68,68,0.3)' },
    Moderate: { bg: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.4)', text: '#fdba74', glow: 'rgba(249,115,22,0.3)' },
    Mild:     { bg: 'rgba(14,165,233,0.15)', border: 'rgba(14,165,233,0.4)', text: '#7dd3fc', glow: 'rgba(14,165,233,0.3)' },
    Normal:   { bg: 'rgba(52,211,153,0.15)', border: 'rgba(52,211,153,0.4)', text: '#6ee7b7', glow: 'rgba(52,211,153,0.3)' },
  };

  return (
    <div>
      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        <input type="file" accept="audio/*" ref={fileInputRef} onChange={handleFile} style={{ display: 'none' }} />

        <button onClick={() => fileInputRef.current.click()} className="btn-outline-glow" disabled={phase === 'recording' || phase === 'processing'}>
          <Upload size={15} /> Upload Audio
        </button>

        {phase === 'idle' || phase === 'done' ? (
          <button onClick={startRecording} className="btn-glow">
            <Mic size={15} /> Start Recording
          </button>
        ) : phase === 'recording' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={stopRecording} className="btn-danger recording">
              <Square size={15} /> Stop & Analyse
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fca5a5', fontSize: 14, fontWeight: 600 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: 'record-pulse 1.2s infinite' }} />
              {recSeconds}s
            </div>
          </div>
        ) : (
          <button className="btn-glow" disabled>
            <Activity size={15} className="spinner" /> Analysing…
          </button>
        )}
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '12px 16px', borderRadius: 12, fontSize: 13, marginBottom: '1rem', lineHeight: 1.5 }}>
          {error}
          {error.includes('ffmpeg') && (
            <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: 8, fontFamily: 'monospace', fontSize: 12 }}>
              Install ffmpeg: <a href="https://ffmpeg.org/download.html" target="_blank" rel="noreferrer" style={{ color: '#60a5fa' }}>ffmpeg.org/download.html</a><br/>
              Then add to PATH: <code>C:\ffmpeg\bin</code>
            </div>
          )}
        </div>
      )}

      {result && phase === 'done' && (() => {
        const sc = SEV[result.severity] || SEV.Normal;
        return (
          <div className="fade-up" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {/* LEFT */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: '0 0 220px' }}>
              <div style={{ background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: 16, padding: '1.25rem', boxShadow: `0 0 30px ${sc.glow}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>HUBERT SEVERITY</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: sc.text, lineHeight: 1 }}>{result.severity}</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '1.25rem' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}><Activity size={13} /> ACOUSTIC METRICS</div>
                {[['Duration', `${result.duration?.toFixed(2)} s`], ['F0 Mean', `${result.metrics?.f0_mean?.toFixed(1)} Hz`], ['F0 Std', `${result.metrics?.f0_std?.toFixed(1)} Hz`], ['Centroid', `${result.metrics?.spectral_centroid?.toFixed(0)}`], ['ZCR', `${result.metrics?.zcr?.toFixed(4)}`]].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13 }}>
                    <span style={{ color: '#64748b' }}>{k}</span><span style={{ color: '#e2e8f0', fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>

              {audioUrl && (
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '1rem' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 8 }}>RECORDED AUDIO</div>
                  <audio src={audioUrl} controls />
                </div>
              )}
            </div>

            {/* RIGHT: Pipeline */}
            {showPipeline && (
              <div style={{ flex: 1, minWidth: 280, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '1.5rem' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#a78bfa', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Zap size={16} /> 4-STAGE RECONSTRUCTION PIPELINE
                </div>
                {[
                  { n: 1, label: 'Raw ASR — Whisper Large-v3', text: result.s1_raw, bg: 'rgba(255,255,255,0.04)', tc: '#94a3b8' },
                  { n: 2, label: 'Phonetic Normalization',     text: result.s2_phonetic, bg: 'rgba(255,255,255,0.04)', tc: '#94a3b8' },
                  { n: 3, label: 'Qwen Proposer (Groq)',       text: result.s3_qwen || result.s2_phonetic, bg: 'rgba(139,92,246,0.1)', tc: '#c4b5fd' },
                  { n: 4, label: 'Critic Debate — Final',      text: result.s4_final, bg: 'rgba(52,211,153,0.1)', tc: '#6ee7b7' },
                ].map((s, i) => (
                  <div key={s.n} style={{ display: 'flex', gap: 12, marginBottom: i < 3 ? '1rem' : 0 }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, background: s.n === 4 ? '#10b981' : s.n === 3 ? '#7c3aed' : 'rgba(255,255,255,0.1)', color: s.n >= 3 ? '#fff' : '#64748b' }}>{s.n}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</div>
                      <div style={{ background: s.bg, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '10px 14px' }}>
                        <p style={{ margin: 0, fontSize: 14, color: s.tc, fontWeight: s.n === 4 ? 700 : 400, lineHeight: 1.5 }}>{s.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}

// ══════════════════════════════════════════════════
// Rehab Studio
// ══════════════════════════════════════════════════
function RehabStudio({ user, words, rehabData, onRefresh }) {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState('idle');
  const [result, setResult] = useState(null);
  const [wordScore, setWordScore] = useState(null);
  const [error, setError] = useState('');
  const [animCls, setAnimCls] = useState('slide-in');
  const [recSec, setRecSec] = useState(0);

  const recRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const word = words[idx] || null;

  const speakWord = w => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(w);
    u.rate = 0.8; u.pitch = 1;
    window.speechSynthesis.speak(u);
  };

  const startRec = async () => {
    setError(''); setResult(null); setWordScore(null); setRecSec(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg'].find(t => MediaRecorder.isTypeSupported(t)) || '';
      const rec = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recRef.current = rec;
      chunksRef.current = [];
      rec.ondataavailable = e => { if (e.data?.size > 0) chunksRef.current.push(e.data); };
      rec.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        clearInterval(timerRef.current);
        if (!chunksRef.current.length) { setError('No audio captured.'); setPhase('idle'); return; }
        submitRec(new Blob(chunksRef.current, { type: mimeType || 'audio/webm' }));
      };
      rec.start(200);
      setPhase('recording');
      timerRef.current = setInterval(() => setRecSec(s => s + 1), 1000);
    } catch { setError('Microphone access denied.'); }
  };

  const stopRec = () => {
    if (recRef.current?.state !== 'inactive') recRef.current.stop();
    setPhase('processing');
  };

  const submitRec = async blob => {
    const fd = new FormData();
    fd.append('file', new File([blob], 'rec.webm', { type: blob.type || 'audio/webm' }));
    fd.append('patient_id', String(user.id));
    try {
      const res = await axios.post(`${API}/api/analyze-utterance`, fd, { timeout: 180000 });
      const d = res.data;
      setResult(d);
      const spoken = (d.s4_final || '').toLowerCase();
      const tgt = word ? word.word.toLowerCase() : '';
      const matched = spoken.includes(tgt);
      let score = 40;
      if (matched) { score = d.severity === 'Normal' ? 100 : d.severity === 'Mild' ? 85 : d.severity === 'Moderate' ? 65 : 50; }
      setWordScore({ score, matched, severity: d.severity });
      if (word) await axios.post(`${API}/api/rehab/score`, { patient_id: user.id, word_id: word.id, score });
      setPhase('result');
      onRefresh();
    } catch (err) {
      setError(`Analysis failed: ${err.response?.data?.detail || err.message}`);
      setPhase('idle');
    }
  };

  const goNext = () => {
    setAnimCls('slide-out');
    setTimeout(() => {
      setIdx(p => (p + 1) % Math.max(words.length, 1));
      setPhase('idle'); setResult(null); setWordScore(null); setError('');
      setAnimCls('slide-in');
    }, 300);
  };

  const summary = words.map(w => {
    const s = rehabData.find(r => r.word === w.word);
    return { ...w, score: s?.score || 0, attempts: s?.attempts || 0 };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Summary Grid */}
      <div className="glass" style={{ padding: '1.5rem' }}>
        <SectionHeader icon={<Star size={16} />} title="Word Progress" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
          {summary.map((w, i) => {
            const isActive = w.id === word?.id;
            const mastered = w.score >= 80;
            return (
              <div key={w.id} onClick={() => { setIdx(i); setPhase('idle'); setResult(null); setWordScore(null); setAnimCls('slide-in'); }}
                style={{ padding: '0.85rem', borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s',
                  background: isActive ? 'rgba(124,58,237,0.2)' : mastered ? 'rgba(52,211,153,0.08)' : 'rgba(255,255,255,0.04)',
                  border: `1.5px solid ${isActive ? '#7c3aed' : mastered ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  boxShadow: isActive ? '0 0 20px rgba(124,58,237,0.3)' : 'none',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: isActive ? '#c4b5fd' : '#e2e8f0' }}>{w.word}</span>
                  {mastered && <CheckCircle size={14} color="#34d399" />}
                </div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{w.attempts} attempts</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: w.score >= 80 ? '#34d399' : w.score >= 60 ? '#fbbf24' : '#94a3b8', marginTop: 2 }}>{w.score}%</div>
              </div>
            );
          })}
          {words.length === 0 && <p style={{ color: '#475569', fontSize: 14, gridColumn: '1/-1' }}>No words assigned yet.</p>}
        </div>
      </div>

      {/* Practice Zone */}
      {word && (
        <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
          <SectionHeader icon={<Mic size={16} />} title="Practice Zone" sub="Pronounce the target word clearly, then stop recording" />

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginBottom: '2rem' }}>
            {words.map((_, i) => (
              <div key={i} style={{ borderRadius: 999, transition: 'all 0.3s', height: 6,
                width: i === idx ? 24 : 6,
                background: i === idx ? '#7c3aed' : i < idx ? '#4f46e5' : 'rgba(255,255,255,0.15)' }} />
            ))}
          </div>

          {/* Word card */}
          <div className={animCls} style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'inline-block', padding: '2rem 4rem', borderRadius: 24,
              background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(79,70,229,0.1))',
              border: '2px solid rgba(167,139,250,0.3)', marginBottom: '1rem',
              boxShadow: '0 0 60px rgba(124,58,237,0.2)' }}>
              <div style={{ fontSize: 56, fontWeight: 900, letterSpacing: -2,
                background: 'linear-gradient(135deg, #c4b5fd, #93c5fd, #6ee7b7)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 20px rgba(167,139,250,0.5))',
              }}>
                {word.word}
              </div>
            </div>
            <br />
            <button onClick={() => speakWord(word.word)} className="btn-outline-glow" style={{ fontSize: 12, padding: '6px 16px' }}>
              <Volume2 size={14} /> Hear it
            </button>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '10px 16px', borderRadius: 10, marginBottom: '1rem', fontSize: 13 }}>
              {error}
            </div>
          )}

          {/* Action buttons */}
          {phase === 'idle' && (
            <button onClick={startRec} className="btn-glow" style={{ fontSize: 15, padding: '13px 36px' }}>
              <Mic size={18} /> Start Recording
            </button>
          )}
          {phase === 'recording' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fca5a5', fontWeight: 600 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', animation: 'record-pulse 1.2s infinite' }} />
                Recording… {recSec}s — speak clearly now
              </div>
              <button onClick={stopRec} className="btn-danger recording">
                <Square size={17} /> Stop & Analyse
              </button>
            </div>
          )}
          {phase === 'processing' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: '#a78bfa', fontWeight: 600, fontSize: 15 }}>
              <Activity size={20} className="spinner" /> AI pipeline running…
            </div>
          )}
          {phase === 'result' && result && wordScore && (
            <div className="pop" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                padding: '12px 30px', borderRadius: 999, fontSize: 20, fontWeight: 800,
                background: wordScore.score >= 80 ? 'rgba(52,211,153,0.15)' : wordScore.score >= 60 ? 'rgba(251,191,36,0.15)' : 'rgba(239,68,68,0.15)',
                border: `2px solid ${wordScore.score >= 80 ? 'rgba(52,211,153,0.5)' : wordScore.score >= 60 ? 'rgba(251,191,36,0.5)' : 'rgba(239,68,68,0.5)'}`,
                color: wordScore.score >= 80 ? '#6ee7b7' : wordScore.score >= 60 ? '#fde68a' : '#fca5a5',
                boxShadow: `0 0 40px ${wordScore.score >= 80 ? 'rgba(52,211,153,0.3)' : 'rgba(239,68,68,0.2)'}`,
              }}>
                {wordScore.score >= 80 ? '🎉' : wordScore.score >= 60 ? '👍' : '🔄'} {wordScore.score}% — {wordScore.severity}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px 20px', textAlign: 'left', maxWidth: 480, width: '100%' }}>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Reconstructed Speech</div>
                <p style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#e2e8f0' }}>"{result.s4_final}"</p>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => { setPhase('idle'); setResult(null); setWordScore(null); }} className="btn-outline-glow">
                  🔄 Retry
                </button>
                <button onClick={goNext} className="btn-glow">
                  Next Word <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════
// Clinician Dashboard
// ══════════════════════════════════════════════════
function ClinicianDashboard({ user }) {
  const [patients, setPatients] = useState([]);
  const [words, setWords] = useState([]);
  const [newWord, setNewWord] = useState('');
  const [tab, setTab] = useState('roster');

  const fetchAll = useCallback(() => {
    axios.get(`${API}/api/patients`).then(r => setPatients(r.data)).catch(console.error);
    axios.get(`${API}/api/words`).then(r => setWords(r.data)).catch(console.error);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const addWord = async e => {
    e.preventDefault();
    if (!newWord.trim()) return;
    try { await axios.post(`${API}/api/add-word`, { word: newWord.trim().toLowerCase(), clinician_id: user.id }); setNewWord(''); fetchAll(); } catch {}
  };

  const SEV = { Severe: '#ef4444', Moderate: '#f97316', Mild: '#0ea5e9', Normal: '#10b981' };

  const tabs = [
    { id: 'roster', icon: <Users size={15} />, label: 'Patient Roster' },
    { id: 'words',  icon: <Plus size={15} />,  label: 'Word Bank' },
    { id: 'tester', icon: <Mic size={15} />,   label: 'Verify Audio' },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {tabs.map(t => (
          <button key={t.id} className={`tab-btn ${tab === t.id ? 'tab-active' : 'tab-inactive'}`} onClick={() => setTab(t.id)}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'roster' && (
        <div className="glass fade-up" style={{ padding: '1.75rem' }}>
          <SectionHeader icon={<Users size={18} />} title="Multi-Patient Roster" sub="Baseline vs current severity tracking" />
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  {['Patient', 'Baseline', 'Current Severity', 'Sessions', 'Last Active'].map(h => <th key={h}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {patients.length === 0 && <tr><td colSpan={5} style={{ color: '#475569', textAlign: 'center', padding: 30 }}>No patients registered yet.</td></tr>}
                {patients.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600, color: '#e2e8f0' }}>{p.username}</td>
                    <td style={{ color: '#64748b', fontWeight: 500 }}>{p.baseline_severity}</td>
                    <td>
                      <span style={{ padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700, background: `${SEV[p.latest_severity] || '#64748b'}20`, color: SEV[p.latest_severity] || '#94a3b8', border: `1px solid ${SEV[p.latest_severity] || '#475569'}40` }}>
                        {p.latest_severity || 'N/A'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: '#a78bfa' }}>{p.session_count}</td>
                    <td style={{ color: '#64748b', fontSize: 13 }}>{p.last_active !== 'Never' ? new Date(p.last_active).toLocaleString() : 'Never'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'words' && (
        <div className="glass fade-up" style={{ padding: '1.75rem' }}>
          <SectionHeader icon={<Plus size={18} />} title="Word Bank Manager" sub="Add target words for patient rehabilitation sessions" />
          <form onSubmit={addWord} style={{ display: 'flex', gap: 10, marginBottom: '1.5rem' }}>
            <input className="input-glass" value={newWord} onChange={e => setNewWord(e.target.value)} placeholder="Type a word or phrase…" style={{ flex: 1 }} />
            <button type="submit" className="btn-glow" style={{ borderRadius: 12 }}><Plus size={16} /> Add Word</button>
          </form>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {words.map(w => (
              <span key={w.id} style={{ padding: '8px 18px', borderRadius: 999, background: 'rgba(167,139,250,0.15)', color: '#c4b5fd', border: '1px solid rgba(167,139,250,0.3)', fontSize: 14, fontWeight: 600 }}>
                {w.word}
              </span>
            ))}
          </div>
        </div>
      )}

      {tab === 'tester' && (
        <div className="glass fade-up" style={{ padding: '1.75rem' }}>
          <SectionHeader icon={<Mic size={18} />} title="Acoustic Verification Tester" sub="Test phrases yourself — confirm they register as Normal before assigning" />
          <AudioAnalyzer patientId={null} showPipeline={true} />
        </div>
      )}
    </div>
  );
}
