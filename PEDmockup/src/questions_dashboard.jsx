import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell, LineChart, Line, Legend
} from "recharts";

const T = {
  bg: "#FAFAF8", surface: "#FFFFFF", surfaceAlt: "#F5F4F0",
  border: "#E8E6DF", borderStrong: "#D4D1C8",
  text: "#1A1A18", textMid: "#5C5B56", textDim: "#9C9A92",
  accent: "#1D6B4F", accentLight: "#E6F2EC", accentText: "#14513C",
  warm: "#C4512A", warmLight: "#FDF0EB", warmText: "#943D1F",
  blue: "#2D6A9F", blueLight: "#EBF3FA", blueText: "#1E4F78",
  purple: "#6B5CA5", purpleLight: "#F0EDF8", purpleText: "#4E4380",
  amber: "#946B0B", amberLight: "#FEF7E6", amberText: "#6B4D08",
  teal: "#1A7A6D", tealLight: "#E4F5F2", tealText: "#115A50",
  coral: "#B85450", coralLight: "#FCEEED", coralText: "#8A3633",
  sans: "'DM Sans', 'Helvetica Neue', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
  serif: "'Newsreader', 'Georgia', serif",
};

const LINE_COLORS = [T.blue, T.warm, T.accent, T.purple, T.amber, T.teal, T.coral];

const SOURCES = ["r/narcolepsy", "PWN4PWN"];
const COMMUNITY = "Narcolepsy";
const TOTAL_DOCS = 12847;
const DATE_RANGE = "Jan 2022 - Dec 2024";
const NEXT_REFRESH = "Apr 2025";

const CONDITIONS = [
  "Excessive daytime sleepiness",
  "Cataplexy",
  "Sleep disruption",
  "Brain fog",
  "Weight gain",
  "Anxiety",
  "Hallucinations",
  "Sleep paralysis",
];

const QUESTION_THEMES = [
  {
    id: 1, theme: "How to manage EDS at work or school",
    total: 487, patients: 398, caregivers: 89, condition: "Excessive daytime sleepiness",
    verbatim: [
      { text: "How do you guys deal with the sleepiness at work? I literally cannot stay awake during meetings no matter what I try", source: "r/narcolepsy", date: "Mar 2024" },
      { text: "Has anyone successfully gotten workplace accommodations for narcolepsy? My HR department doesn't understand why I need scheduled nap breaks", source: "r/narcolepsy", date: "Jan 2024" },
      { text: "I'm a college student just diagnosed. How do I handle lectures when I fall asleep every single class?", source: "narcolepsyforum.org", date: "Sep 2023" },
      { text: "Does anyone else feel like they're about to lose their job because of EDS? What did you do?", source: "r/narcolepsy", date: "Nov 2024" },
    ],
    trend: [28, 32, 35, 30, 38, 42, 36, 44, 48, 40, 52, 47, 31, 36, 39, 34, 41, 45, 38, 48, 51, 44, 55, 50, 34, 40, 43, 37, 45, 49, 42, 52, 56, 48, 58, 54],
  },
  {
    id: 2, theme: "Which medication works best for EDS",
    total: 412, patients: 356, caregivers: 56, condition: "Excessive daytime sleepiness",
    verbatim: [
      { text: "Just switched from modafinil to Xywav. Anyone else make this switch? How long until it starts working?", source: "r/narcolepsy", date: "Feb 2024" },
      { text: "My doctor wants to add Sunosi on top of Xyrem. Has anyone tried this combo? Side effects?", source: "narcolepsyforum.org", date: "Jul 2023" },
      { text: "Is Wakix actually worth it? My insurance is fighting me on it and I need to know if I should push harder", source: "r/narcolepsy", date: "Oct 2024" },
      { text: "What's the difference between all these stimulants? Modafinil vs armodafinil vs methylphenidate for narcolepsy specifically?", source: "talkaboutsleep.com", date: "May 2023" },
    ],
    trend: [22, 26, 30, 28, 32, 35, 30, 38, 41, 36, 44, 40, 25, 29, 33, 31, 35, 38, 33, 41, 44, 39, 47, 43, 28, 32, 36, 34, 38, 41, 36, 44, 47, 42, 50, 46],
  },
  {
    id: 3, theme: "How to explain narcolepsy to family and friends",
    total: 341, patients: 289, caregivers: 52, condition: null,
    verbatim: [
      { text: "My family thinks I'm just lazy. How do you explain to people that narcolepsy isn't just being tired?", source: "r/narcolepsy", date: "Apr 2024" },
      { text: "Does anyone have a good elevator pitch for narcolepsy? I'm so tired of the 'oh I fall asleep all the time too' responses", source: "r/narcolepsy", date: "Jun 2023" },
      { text: "How did you tell your partner about your diagnosis? I'm scared they won't take it seriously", source: "narcolepsyforum.org", date: "Dec 2023" },
    ],
    trend: [20, 22, 25, 24, 28, 30, 26, 32, 34, 30, 36, 33, 22, 24, 27, 26, 30, 32, 28, 34, 36, 32, 38, 35, 24, 26, 29, 28, 32, 34, 30, 36, 38, 34, 40, 37],
  },
  {
    id: 4, theme: "Is this symptom normal or should I see a doctor",
    total: 298, patients: 262, caregivers: 36, condition: null,
    verbatim: [
      { text: "I've been having these really vivid hallucinations when falling asleep. Is this part of narcolepsy or something else?", source: "r/narcolepsy", date: "Aug 2024" },
      { text: "My cataplexy seems to be getting worse even on medication. At what point do I go back to my sleep specialist?", source: "narcolepsyforum.org", date: "Mar 2023" },
      { text: "Does anyone else get this weird brain fog where you can't remember what you did for the last hour? Is that narcolepsy or should I be worried?", source: "r/narcolepsy", date: "Nov 2023" },
    ],
    trend: [18, 20, 22, 21, 24, 26, 23, 28, 30, 27, 32, 29, 19, 21, 23, 22, 25, 27, 24, 29, 31, 28, 33, 30, 20, 22, 24, 23, 26, 28, 25, 30, 32, 29, 34, 31],
  },
  {
    id: 5, theme: "How to get diagnosed or find a specialist",
    total: 276, patients: 241, caregivers: 35, condition: null,
    verbatim: [
      { text: "How long did it take you to get diagnosed? I've been telling doctors I'm excessively sleepy for years and nobody takes me seriously", source: "r/narcolepsy", date: "May 2024" },
      { text: "What kind of doctor do I need to see? My GP has no idea what to do with me", source: "talkaboutsleep.com", date: "Feb 2023" },
      { text: "Is the MSLT the only way to get diagnosed? I'm terrified of the sleep study", source: "r/narcolepsy", date: "Sep 2024" },
    ],
    trend: [16, 18, 20, 19, 22, 24, 21, 26, 28, 25, 30, 27, 17, 19, 21, 20, 23, 25, 22, 27, 29, 26, 31, 28, 18, 20, 22, 21, 24, 26, 23, 28, 30, 27, 32, 29],
  },
  {
    id: 6, theme: "Driving safety with narcolepsy",
    total: 234, patients: 178, caregivers: 56, condition: "Excessive daytime sleepiness",
    verbatim: [
      { text: "Has anyone had their license revoked? I'm terrified of telling my doctor about the microsleeps while driving", source: "r/narcolepsy", date: "Jul 2024" },
      { text: "What state laws exist around narcolepsy and driving? Can my doctor report me?", source: "narcolepsyforum.org", date: "Oct 2023" },
      { text: "My teenage son has narcolepsy. How do we handle him wanting to get a driver's license?", source: "talkaboutsleep.com", date: "Apr 2024" },
    ],
    trend: [10, 12, 15, 14, 18, 20, 17, 22, 25, 22, 28, 24, 12, 14, 17, 16, 20, 22, 19, 24, 27, 24, 30, 26, 14, 16, 19, 18, 22, 24, 21, 26, 29, 26, 32, 28],
  },
  {
    id: 7, theme: "Insurance coverage and medication costs",
    total: 213, patients: 187, caregivers: 26, condition: null,
    verbatim: [
      { text: "My insurance just denied Xywav for the third time. Has anyone gone through the appeals process successfully?", source: "r/narcolepsy", date: "Jun 2024" },
      { text: "Xyrem costs HOW MUCH without insurance?! What assistance programs exist?", source: "r/narcolepsy", date: "Jan 2023" },
      { text: "Has anyone switched insurance specifically to get better narcolepsy coverage? Which plans are best?", source: "narcolepsyforum.org", date: "Nov 2024" },
    ],
    trend: [12, 14, 16, 15, 18, 20, 17, 22, 24, 21, 26, 23, 13, 15, 17, 16, 19, 21, 18, 23, 25, 22, 27, 24, 14, 16, 18, 17, 20, 22, 19, 24, 26, 23, 28, 25],
  },
  {
    id: 8, theme: "Managing cataplexy triggers",
    total: 189, patients: 158, caregivers: 31, condition: "Cataplexy",
    verbatim: [
      { text: "Laughter is my biggest trigger. How do you deal with cataplexy at social events without avoiding all fun?", source: "r/narcolepsy", date: "Mar 2024" },
      { text: "Has anyone found ways to reduce cataplexy episodes without just increasing medication?", source: "narcolepsyforum.org", date: "Aug 2023" },
      { text: "My daughter's cataplexy is triggered by excitement. How do we let her be a normal kid?", source: "talkaboutsleep.com", date: "May 2024" },
    ],
    trend: [8, 10, 12, 11, 14, 16, 13, 18, 20, 17, 22, 19, 9, 11, 13, 12, 15, 17, 14, 19, 21, 18, 23, 20, 10, 12, 14, 13, 16, 18, 15, 20, 22, 19, 24, 21],
  },
  {
    id: 9, theme: "Narcolepsy and mental health",
    total: 178, patients: 154, caregivers: 24, condition: null,
    verbatim: [
      { text: "Is depression a symptom of narcolepsy or am I depressed because of narcolepsy? Does anyone else struggle with this?", source: "r/narcolepsy", date: "Sep 2024" },
      { text: "My anxiety has gotten so much worse since diagnosis. Is narcolepsy medication making it worse?", source: "r/narcolepsy", date: "Feb 2024" },
      { text: "How do you cope with the grief of losing your old life to this disease?", source: "narcolepsyforum.org", date: "Jul 2023" },
    ],
    trend: [6, 8, 10, 10, 13, 15, 12, 17, 19, 16, 21, 18, 7, 9, 11, 11, 14, 16, 13, 18, 20, 17, 22, 19, 8, 10, 12, 12, 15, 17, 14, 19, 21, 18, 23, 20],
  },
  {
    id: 10, theme: "New treatments and clinical trials",
    total: 156, patients: 132, caregivers: 24, condition: null,
    verbatim: [
      { text: "Has anyone heard about the orexin agonist trials? Is this actually going to be a game changer?", source: "r/narcolepsy", date: "Oct 2024" },
      { text: "How do I find clinical trials for narcolepsy near me? Is it worth participating?", source: "narcolepsyforum.org", date: "Jun 2024" },
      { text: "What's the timeline on TAK-861? When could it actually be available?", source: "r/narcolepsy", date: "Dec 2024" },
    ],
    trend: [4, 5, 7, 6, 8, 10, 8, 12, 14, 12, 16, 14, 5, 6, 8, 7, 9, 11, 9, 13, 15, 13, 17, 15, 6, 8, 12, 14, 18, 22, 20, 26, 28, 24, 30, 27],
  },
];

const MONTHS = [
  "Jan 22","Feb 22","Mar 22","Apr 22","May 22","Jun 22","Jul 22","Aug 22","Sep 22","Oct 22","Nov 22","Dec 22",
  "Jan 23","Feb 23","Mar 23","Apr 23","May 23","Jun 23","Jul 23","Aug 23","Sep 23","Oct 23","Nov 23","Dec 23",
  "Jan 24","Feb 24","Mar 24","Apr 24","May 24","Jun 24","Jul 24","Aug 24","Sep 24","Oct 24","Nov 24","Dec 24",
];

const QUARTERS = ["Q1 22","Q2 22","Q3 22","Q4 22","Q1 23","Q2 23","Q3 23","Q4 23","Q1 24","Q2 24","Q3 24","Q4 24"];

const fmt = (n) => Math.round(n).toLocaleString();
const MULT = { all: 1, patients: 0.82, caregivers: 0.18 };

function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8,
      padding: "8px 12px", fontSize: 12, fontFamily: T.sans,
      boxShadow: "0 4px 16px rgba(0,0,0,.06)",
    }}>
      <div style={{ fontWeight: 600, color: T.text, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || T.textMid, fontSize: 11, marginBottom: 1 }}>
          {p.name}: <span style={{ fontWeight: 600, fontFamily: T.mono }}>{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

function Chip({ label, active, onClick, activeColor, activeBg }) {
  return (
    <button onClick={onClick} style={{
      padding: "5px 14px", borderRadius: 6, fontSize: 12, fontFamily: T.sans,
      fontWeight: active ? 600 : 400, cursor: "pointer", transition: "all .15s",
      border: `1px solid ${active ? (activeColor || T.accent) : T.border}`,
      background: active ? (activeBg || T.accentLight) : "transparent",
      color: active ? (activeColor || T.accentText) : T.textMid,
    }}>{label}</button>
  );
}

function Collapsible({ title, badge, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden", background: T.surface }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", display: "flex", alignItems: "center", gap: 10,
        padding: "14px 20px", background: "none", border: "none", cursor: "pointer",
        fontFamily: T.sans, fontSize: 13, fontWeight: 600, color: T.text, textAlign: "left",
      }}>
        <svg width="12" height="12" viewBox="0 0 12 12" style={{ transition: "transform .2s", transform: open ? "rotate(90deg)" : "rotate(0deg)", flexShrink: 0 }}>
          <path d="M4 2L8 6L4 10" fill="none" stroke={T.textMid} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {title}
        {badge && <span style={{ fontWeight: 400, color: T.amber, fontSize: 11, padding: "1px 8px", borderRadius: 4, background: T.amberLight }}>{badge}</span>}
      </button>
      {open && <div style={{ padding: "0 20px 20px", borderTop: `1px solid ${T.border}` }}>{children}</div>}
    </div>
  );
}

function ShareBar({ patients, caregivers, width = 60 }) {
  const total = patients + caregivers;
  if (!total) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ display: "flex", height: 8, borderRadius: 3, overflow: "hidden", width }}>
        <div style={{ flex: patients, background: T.blue, opacity: 0.55 }} />
        <div style={{ flex: caregivers, background: T.purple, opacity: 0.55 }} />
      </div>
      <span style={{ fontSize: 9, color: T.textDim, fontFamily: T.sans, whiteSpace: "nowrap" }}>
        {Math.round(patients / total * 100)}% / {Math.round(caregivers / total * 100)}%
      </span>
    </div>
  );
}

function QuestionRow({ q, mult, expanded, onToggle }) {
  const count = Math.round(q.total * mult);
  const maxCount = Math.round(QUESTION_THEMES[0].total * mult);
  const barWidth = (count / maxCount) * 100;

  return (
    <div style={{ borderBottom: `1px solid ${T.border}22` }}>
      <button onClick={onToggle} style={{
        width: "100%", display: "grid",
        gridTemplateColumns: "1fr 80px 120px 100px",
        alignItems: "center", gap: 12,
        padding: "12px 16px", background: expanded ? T.surfaceAlt : "transparent",
        border: "none", cursor: "pointer", fontFamily: T.sans, textAlign: "left",
        transition: "background .1s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="10" height="10" viewBox="0 0 10 10" style={{ transition: "transform .2s", transform: expanded ? "rotate(90deg)" : "rotate(0deg)", flexShrink: 0 }}>
            <path d="M3 1.5L7 5L3 8.5" fill="none" stroke={T.textDim} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{q.theme}</span>
          {q.condition && (
            <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 3, background: T.accentLight, color: T.accentText, fontWeight: 500, whiteSpace: "nowrap" }}>
              {q.condition}
            </span>
          )}
        </div>
        <div style={{ fontFamily: T.mono, fontSize: 13, fontWeight: 600, color: T.text, textAlign: "right" }}>{fmt(count)}</div>
        <div style={{ paddingRight: 8 }}>
          <div style={{ height: 6, borderRadius: 3, background: T.border, overflow: "hidden" }}>
            <div style={{ width: `${barWidth}%`, height: "100%", borderRadius: 3, background: T.accent, opacity: 0.6, transition: "width .3s" }} />
          </div>
        </div>
        <ShareBar patients={Math.round(q.patients * mult)} caregivers={Math.round(q.caregivers * mult)} />
      </button>

      {expanded && (
        <div style={{ padding: "0 16px 16px 38px" }}>
          <p style={{ fontSize: 10, color: T.textDim, margin: "0 0 10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".5px" }}>
            Verbatim examples ({q.verbatim.length})
          </p>
          {q.verbatim.map((v, i) => (
            <div key={i} style={{
              padding: "10px 14px", marginBottom: 8, borderRadius: 8,
              background: T.surface, border: `1px solid ${T.border}`,
              fontSize: 12, color: T.textMid, lineHeight: 1.6, fontStyle: "italic",
            }}>
              "{v.text}"
              <div style={{ marginTop: 6, fontSize: 10, color: T.textDim, fontStyle: "normal" }}>
                {v.source} &middot; {v.date}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function () {
  const [condition, setCondition] = useState("all");
  const [subgroup, setSubgroup] = useState("all");
  const [showPct, setShowPct] = useState(false);
  const [timeGranularity, setTimeGranularity] = useState("monthly");
  const [expandedRow, setExpandedRow] = useState(null);
  const [visibleLines, setVisibleLines] = useState(() => new Set([1, 2, 3, 4, 5]));

  const mult = MULT[subgroup === "patients" ? "patients" : subgroup === "caregivers" ? "caregivers" : "all"];

  const filtered = useMemo(() => {
    let data = QUESTION_THEMES;
    if (condition !== "all") {
      data = data.filter(q => q.condition === condition || q.condition === null);
    }
    return data;
  }, [condition]);

  // Bar chart data
  const barData = useMemo(() =>
    filtered.slice(0, 10).map(q => ({
      theme: q.theme.length > 35 ? q.theme.slice(0, 35) + "..." : q.theme,
      fullTheme: q.theme,
      value: Math.round(q.total * mult),
    })),
    [filtered, mult]
  );

  // Subgroup comparison data
  const subgroupData = useMemo(() =>
    filtered.slice(0, 8).map(q => ({
      theme: q.theme.length > 30 ? q.theme.slice(0, 30) + "..." : q.theme,
      patients: q.patients,
      caregivers: q.caregivers,
    })),
    [filtered]
  );

  // Time series data
  const timeData = useMemo(() => {
    if (timeGranularity === "monthly") {
      return MONTHS.map((m, i) => {
        const row = { month: m };
        filtered.slice(0, 7).forEach(q => {
          if (visibleLines.has(q.id)) {
            row[q.theme] = Math.round((q.trend[i] || 0) * mult);
          }
        });
        return row;
      });
    } else {
      return QUARTERS.map((q, qi) => {
        const row = { month: q };
        filtered.slice(0, 7).forEach(theme => {
          if (visibleLines.has(theme.id)) {
            const start = qi * 3;
            const sum = (theme.trend[start] || 0) + (theme.trend[start + 1] || 0) + (theme.trend[start + 2] || 0);
            row[theme.theme] = Math.round(sum * mult);
          }
        });
        return row;
      });
    }
  }, [filtered, timeGranularity, mult, visibleLines]);

  const toggleLine = (id) => {
    setVisibleLines(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalQuestions = filtered.reduce((s, q) => s + Math.round(q.total * mult), 0);

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.sans, color: T.text }}>
      {/* HEADER */}
      <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "24px 32px 20px" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {SOURCES.map(s => (
            <span key={s} style={{
              padding: "3px 10px", borderRadius: 5, fontSize: 11, fontWeight: 500,
              background: T.blueLight, color: T.blueText,
            }}>{s}</span>
          ))}
          <span style={{ marginLeft: "auto", fontSize: 12, color: T.textDim, alignSelf: "center" }}>
            {fmt(TOTAL_DOCS)} documents &middot; {DATE_RANGE}
          </span>
        </div>

        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 500, fontFamily: T.serif, lineHeight: 1.3 }}>
          What are people asking
          {condition !== "all" ? <> about <span style={{ color: T.accent, fontWeight: 700 }}>{condition.toLowerCase()}</span></> : <> in the <span style={{ color: T.accent, fontWeight: 700 }}>{COMMUNITY.toLowerCase()}</span> community</>}?
        </h1>

        {/* Controls */}
        <div style={{ display: "flex", gap: 20, marginTop: 18, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: T.textDim, letterSpacing: ".5px", textTransform: "uppercase" }}>Condition</span>
            <select value={condition} onChange={e => setCondition(e.target.value)} style={{
              padding: "5px 10px", borderRadius: 6, border: `1px solid ${T.border}`,
              fontSize: 12, fontFamily: T.sans, color: T.text, background: T.surfaceAlt,
              cursor: "pointer", outline: "none",
            }}>
              <option value="all">All topics</option>
              {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ width: 1, height: 24, background: T.border }} />

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: T.textDim, letterSpacing: ".5px", textTransform: "uppercase" }}>Subgroup</span>
            <div style={{ display: "flex", gap: 4 }}>
              {[{ id: "all", label: "All" }, { id: "patients", label: "Patients" }, { id: "caregivers", label: "Caregivers" }].map(s => (
                <Chip key={s.id} label={s.label} active={subgroup === s.id} onClick={() => setSubgroup(s.id)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 32px 48px", maxWidth: 960, margin: "0 auto" }}>

        {/* SUMMARY */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
          <div style={{ background: T.surfaceAlt, borderRadius: 10, padding: "14px 18px", flex: 1, minWidth: 120 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: T.textDim, letterSpacing: ".6px", textTransform: "uppercase", marginBottom: 4 }}>Total questions</div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: T.mono, color: T.text }}>{fmt(totalQuestions)}</div>
          </div>
          <div style={{ background: T.surfaceAlt, borderRadius: 10, padding: "14px 18px", flex: 1, minWidth: 120 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: T.textDim, letterSpacing: ".6px", textTransform: "uppercase", marginBottom: 4 }}>Question themes</div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: T.mono, color: T.text }}>{filtered.length}</div>
          </div>
          <div style={{ background: T.surfaceAlt, borderRadius: 10, padding: "14px 18px", flex: 1, minWidth: 120 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: T.textDim, letterSpacing: ".6px", textTransform: "uppercase", marginBottom: 4 }}>Top theme</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text, lineHeight: 1.3 }}>{filtered[0]?.theme}</div>
          </div>
          <div style={{ background: T.surfaceAlt, borderRadius: 10, padding: "14px 18px", flex: 1, minWidth: 120 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: T.textDim, letterSpacing: ".6px", textTransform: "uppercase", marginBottom: 4 }}>Next refresh</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.accent }}>{NEXT_REFRESH}</div>
            <div style={{ fontSize: 10, color: T.textDim, marginTop: 2 }}>Extracted {DATE_RANGE}</div>
          </div>
        </div>

        {/* PANEL 1: Question Themes Table */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 600 }}>Question themes</h2>
          <p style={{ margin: "0 0 14px", fontSize: 12, color: T.textDim }}>
            Clustered questions sorted by frequency. Expand a row to see verbatim examples from posts.
          </p>
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden" }}>
            {/* Table header */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 80px 120px 100px",
              gap: 12, padding: "10px 16px", borderBottom: `1px solid ${T.border}`,
              fontSize: 10, fontWeight: 600, color: T.textDim, textTransform: "uppercase", letterSpacing: ".5px",
            }}>
              <span>Theme</span>
              <span style={{ textAlign: "right" }}>Count</span>
              <span>Frequency</span>
              <span>Pat / Cg</span>
            </div>
            {filtered.map(q => (
              <QuestionRow
                key={q.id} q={q} mult={mult}
                expanded={expandedRow === q.id}
                onToggle={() => setExpandedRow(expandedRow === q.id ? null : q.id)}
              />
            ))}
          </div>
        </div>

        {/* PANEL 2: Frequency Bar Chart */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 4 }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Question frequency</h2>
            <div style={{ display: "flex", gap: 4 }}>
              <Chip label="Count" active={!showPct} onClick={() => setShowPct(false)} activeColor={T.blue} activeBg={T.blueLight} />
              <Chip label="%" active={showPct} onClick={() => setShowPct(true)} activeColor={T.blue} activeBg={T.blueLight} />
            </div>
          </div>
          <p style={{ margin: "0 0 14px", fontSize: 12, color: T.textDim }}>Top 10 question themes by volume</p>
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "20px 16px 12px" }}>
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={(() => { const tot = barData.reduce((s, d) => s + d.value, 0); return showPct ? barData.map(d => ({ ...d, value: tot ? +((d.value / tot) * 100).toFixed(1) : 0 })) : barData; })()} layout="vertical" margin={{ left: 10, right: 30, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: T.textDim }} tickFormatter={showPct ? v => `${v}%` : undefined} />
                <YAxis dataKey="theme" type="category" width={220} tick={{ fontSize: 11, fill: T.textMid, fontFamily: T.sans }} />
                <Tooltip content={<Tip />} formatter={showPct ? v => [`${v}%`, "Questions"] : undefined} />
                <Bar dataKey="value" name="Questions" radius={[0, 4, 4, 0]} maxBarSize={18}>
                  {barData.map((d, i) => (
                    <Cell key={i} fill={T.accent} opacity={0.3 + (1 - i / barData.length) * 0.5} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PANEL 3: Subgroup Comparison */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 4 }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Questions by subgroup</h2>
            <div style={{ display: "flex", gap: 4 }}>
              <Chip label="Count" active={!showPct} onClick={() => setShowPct(false)} activeColor={T.blue} activeBg={T.blueLight} />
              <Chip label="%" active={showPct} onClick={() => setShowPct(true)} activeColor={T.blue} activeBg={T.blueLight} />
            </div>
          </div>
          <p style={{ margin: "0 0 14px", fontSize: 12, color: T.textDim }}>
            Patient vs caregiver question profiles. {showPct ? "% share within each theme." : "Shows where each group's concerns diverge."}
          </p>
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "20px 16px 12px" }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={showPct ? subgroupData.map(d => { const t = d.patients + d.caregivers; return { ...d, patients: t ? +((d.patients / t) * 100).toFixed(1) : 0, caregivers: t ? +((d.caregivers / t) * 100).toFixed(1) : 0 }; }) : subgroupData} layout="vertical" margin={{ left: 10, right: 30, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: T.textDim }} tickFormatter={showPct ? v => `${v}%` : undefined} />
                <YAxis dataKey="theme" type="category" width={200} tick={{ fontSize: 11, fill: T.textMid }} />
                <Tooltip content={<Tip />} formatter={showPct ? v => [`${v}%`] : undefined} />
                <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 11, fontFamily: T.sans }} />
                <Bar dataKey="patients" name="Patients" radius={[0, 3, 3, 0]} maxBarSize={12} fill={T.blue} opacity={0.6} />
                <Bar dataKey="caregivers" name="Caregivers" radius={[0, 3, 3, 0]} maxBarSize={12} fill={T.purple} opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PANEL 4: Questions Over Time */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4, flexWrap: "wrap", gap: 8 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Questions over time</h2>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: T.textDim }}>
                Track how question themes trend. Click theme names below to toggle visibility.
              </p>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <Chip label="Monthly" active={timeGranularity === "monthly"} onClick={() => setTimeGranularity("monthly")}
                activeColor={T.blue} activeBg={T.blueLight} />
              <Chip label="Quarterly" active={timeGranularity === "quarterly"} onClick={() => setTimeGranularity("quarterly")}
                activeColor={T.blue} activeBg={T.blueLight} />
            </div>
          </div>

          {/* Line toggles */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
            {filtered.slice(0, 7).map((q, i) => (
              <button key={q.id} onClick={() => toggleLine(q.id)} style={{
                padding: "3px 10px", borderRadius: 5, fontSize: 10, fontFamily: T.sans,
                fontWeight: visibleLines.has(q.id) ? 600 : 400, cursor: "pointer",
                border: `1px solid ${visibleLines.has(q.id) ? LINE_COLORS[i % LINE_COLORS.length] : T.border}`,
                background: visibleLines.has(q.id) ? LINE_COLORS[i % LINE_COLORS.length] + "18" : "transparent",
                color: visibleLines.has(q.id) ? LINE_COLORS[i % LINE_COLORS.length] : T.textDim,
                transition: "all .15s",
              }}>
                {q.theme.length > 28 ? q.theme.slice(0, 28) + "..." : q.theme}
              </button>
            ))}
          </div>

          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "20px 16px 12px" }}>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={timeData} margin={{ left: 0, right: 20, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: T.textDim }} interval={timeGranularity === "monthly" ? 5 : 1} />
                <YAxis tick={{ fontSize: 10, fill: T.textDim }} />
                <Tooltip content={<Tip />} />
                {filtered.slice(0, 7).map((q, i) => (
                  visibleLines.has(q.id) && (
                    <Line key={q.id} type="monotone" dataKey={q.theme} name={q.theme.length > 30 ? q.theme.slice(0, 30) + "..." : q.theme}
                      stroke={LINE_COLORS[i % LINE_COLORS.length]} strokeWidth={2} dot={false} opacity={0.8} />
                  )
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PANEL 5: Community Answers (collapsed upsell) */}
        <div style={{ marginBottom: 28 }}>
          <Collapsible title="Community answers to top questions" badge="Upsell preview">
            <p style={{ fontSize: 12, color: T.textMid, margin: "14px 0 16px", lineHeight: 1.6 }}>
              Below is a preview of what community members are answering to the most common questions.
              Full answer analysis, sentiment scoring, and expert vs peer distinction available as an add-on.
            </p>

            {filtered.slice(0, 3).map(q => (
              <div key={q.id} style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: T.text, margin: "0 0 8px" }}>{q.theme}</p>
                <div style={{
                  padding: "12px 16px", borderRadius: 8, background: T.surfaceAlt,
                  border: `1px solid ${T.border}`, fontSize: 12, color: T.textMid, lineHeight: 1.6,
                }}>
                  {q.id === 1 && (
                    <>
                      <p style={{ margin: "0 0 8px", fontStyle: "italic" }}>"I talked to HR and got ADA accommodations. Two 20-minute nap breaks and a flexible start time. Game changer. Document everything from your sleep specialist."</p>
                      <p style={{ margin: 0, fontStyle: "italic" }}>"Honestly the only thing that helped me at work was switching to Xywav. The accommodations helped but I still couldn't function until the meds were right."</p>
                    </>
                  )}
                  {q.id === 2 && (
                    <>
                      <p style={{ margin: "0 0 8px", fontStyle: "italic" }}>"Xyrem worked but the side effects were brutal. Switched to Xywav, much easier on the stomach. Give it at least 3 months."</p>
                      <p style={{ margin: 0, fontStyle: "italic" }}>"Modafinil alone wasn't enough for me. Adding Sunosi on top made a real difference. Ask your doctor about combination therapy."</p>
                    </>
                  )}
                  {q.id === 3 && (
                    <>
                      <p style={{ margin: "0 0 8px", fontStyle: "italic" }}>"I show them the spoon theory. It's not perfect but it clicks for most people. Narcolepsy means I start the day with fewer spoons than everyone else."</p>
                      <p style={{ margin: 0, fontStyle: "italic" }}>"I stopped trying to explain and started sending the Narcolepsy Network one-pager. People read it and finally get it."</p>
                    </>
                  )}
                </div>
                <p style={{ fontSize: 10, color: T.textDim, margin: "4px 0 0" }}>2 of {Math.round(q.total * 0.3)} community responses shown</p>
              </div>
            ))}

            <div style={{
              padding: "14px 18px", borderRadius: 8, background: T.amberLight,
              border: `1px solid ${T.amber}33`, fontSize: 12, color: T.amberText, lineHeight: 1.5,
            }}>
              Want full answer analysis with sentiment scoring, expert vs peer distinction, and answer completeness assessment? Contact your account team to enable this module.
            </div>
          </Collapsible>
        </div>

        {/* REFRESH NOTE */}
        <div style={{
          padding: "12px 20px", background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 10, fontSize: 12, color: T.textMid, lineHeight: 1.5,
        }}>
          <span style={{ fontWeight: 600 }}>Data freshness:</span> Questions extracted from posts dated {DATE_RANGE}. Question clustering and theme generation last updated Dec 2024. Next scheduled refresh: {NEXT_REFRESH}. For on-demand refresh, contact your account team.
        </div>
      </div>
    </div>
  );
}
