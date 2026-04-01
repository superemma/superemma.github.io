import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell, PieChart, Pie
} from "recharts";

const T = {
  bg: "#FAFAF8",
  surface: "#FFFFFF",
  surfaceAlt: "#F5F4F0",
  border: "#E8E6DF",
  borderStrong: "#D4D1C8",
  text: "#1A1A18",
  textMid: "#5C5B56",
  textDim: "#9C9A92",
  accent: "#1D6B4F",
  accentLight: "#E6F2EC",
  accentText: "#14513C",
  warm: "#C4512A",
  warmLight: "#FDF0EB",
  warmText: "#943D1F",
  blue: "#2D6A9F",
  blueLight: "#EBF3FA",
  blueText: "#1E4F78",
  purple: "#6B5CA5",
  purpleLight: "#F0EDF8",
  purpleText: "#4E4380",
  muted: "#B8B5AC",
  font: "'Newsreader', 'Georgia', serif",
  sans: "'DM Sans', 'Helvetica Neue', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
};

const SOURCES = ["r/narcolepsy", "PWN4PWN"];
const DATE_RANGE = "Jan 2021 - Dec 2024";
const TOTAL_DOCS = 12847;
const CONDITION = "Excessive daytime sleepiness";
const COMMUNITY = "Narcolepsy";

const ADL_DATA = [
  { category: "Work / employment", value: 1840, baseline: 1063, docs: 892, authors: 614 },
  { category: "Sleep", value: 1552, baseline: 1764, docs: 748, authors: 521 },
  { category: "Transportation", value: 1163, baseline: 765, docs: 562, authors: 387 },
  { category: "Social participation", value: 970, baseline: 703, docs: 468, authors: 324 },
  { category: "Exercise", value: 775, baseline: 635, docs: 374, authors: 258 },
  { category: "Managing medications", value: 582, baseline: 631, docs: 281, authors: 194 },
  { category: "Cooking / meal prep", value: 388, baseline: 408, docs: 187, authors: 129 },
  { category: "Dressing", value: 194, baseline: 270, docs: 94, authors: 65 },
  { category: "Toileting", value: 142, baseline: 206, docs: 69, authors: 47 },
];

const SPAN_PAIRS = [
  { span: "brain fog", type: "symptom", adl: "Work / employment", assertion: "patient", freq: 312 },
  { span: "Xyrem", type: "drug", adl: "Sleep", assertion: "patient", freq: 287 },
  { span: "microsleep", type: "symptom", adl: "Transportation", assertion: "patient", freq: 245 },
  { span: "fatigue", type: "symptom", adl: "Social participation", assertion: "caregiver", freq: 198 },
  { span: "Modafinil", type: "drug", adl: "Work / employment", assertion: "patient", freq: 176 },
  { span: "sleep attacks", type: "symptom", adl: "Exercise", assertion: "patient", freq: 154 },
  { span: "Sunosi", type: "drug", adl: "Transportation", assertion: "patient", freq: 143 },
  { span: "automatic behavior", type: "symptom", adl: "Cooking / meal prep", assertion: "caregiver", freq: 128 },
  { span: "excessive napping", type: "symptom", adl: "Social participation", assertion: "patient", freq: 117 },
  { span: "Wakix", type: "drug", adl: "Work / employment", assertion: "patient", freq: 108 },
  { span: "concentration issues", type: "symptom", adl: "Managing medications", assertion: "patient", freq: 96 },
  { span: "weight gain", type: "symptom", adl: "Exercise", assertion: "patient", freq: 89 },
  { span: "Armodafinil", type: "drug", adl: "Work / employment", assertion: "patient", freq: 82 },
  { span: "morning grogginess", type: "symptom", adl: "Dressing", assertion: "caregiver", freq: 74 },
  { span: "memory lapses", type: "symptom", adl: "Managing medications", assertion: "patient", freq: 68 },
];

const EMOTION_DATA = [
  { emotion: "Frustration", count: 892, docs: 431, authors: 297, group: "neg" },
  { emotion: "Anxiety", count: 694, docs: 335, authors: 231, group: "neg" },
  { emotion: "Sadness", count: 595, docs: 287, authors: 198, group: "neg" },
  { emotion: "Hope", count: 496, docs: 239, authors: 165, group: "pos" },
  { emotion: "Determination", count: 447, docs: 216, authors: 149, group: "pos" },
  { emotion: "Loneliness", count: 397, docs: 192, authors: 132, group: "neg" },
  { emotion: "Guilt", count: 298, docs: 144, authors: 99, group: "neg" },
  { emotion: "Acceptance", count: 248, docs: 120, authors: 83, group: "pos" },
  { emotion: "Relief", count: 198, docs: 96, authors: 66, group: "pos" },
  { emotion: "Overwhelm", count: 174, docs: 84, authors: 58, group: "neg" },
];

const WORD_PHRASES = {
  Frustration: ["so tired of this", "can't stay awake", "nothing works", "lost my job", "no relief", "falling asleep driving", "fed up with meds", "can't function", "people don't understand", "struggling every day"],
  Anxiety: ["worried about driving", "what if I fall asleep", "scared at work", "panic about meetings", "afraid to be alone", "racing thoughts at night", "dread the morning"],
  Sadness: ["miss my old life", "feel broken", "crying from exhaustion", "grieving who I was", "invisible illness", "nobody sees it"],
  Hope: ["new medication helping", "finally some energy", "good day today", "doctor really listened", "support group helped", "feeling optimistic"],
  Determination: ["won't let this define me", "one day at a time", "fighting for disability", "advocating for myself", "found my routine"],
  Loneliness: ["nobody understands", "friends stopped calling", "isolated at home", "can't explain it", "suffer in silence"],
  Guilt: ["burden on my family", "can't keep up", "letting everyone down", "sleeping through life", "feel useless"],
  Acceptance: ["learning to pace myself", "new normal", "adapted my schedule", "found balance", "it's part of me now"],
  Relief: ["Xyrem changed everything", "finally diagnosed", "weight off shoulders", "manageable now"],
  Overwhelm: ["too much to handle", "drowning", "everything at once", "barely surviving", "at my limit"],
};

const MULT = { all: 1, patients: 0.62, caregivers: 0.18 };
const fmt = (n) => Math.round(n).toLocaleString();

function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8,
      padding: "8px 12px", fontSize: 12, fontFamily: T.sans,
      boxShadow: "0 4px 16px rgba(0,0,0,.06)",
    }}>
      <div style={{ fontWeight: 600, color: T.text, marginBottom: 2 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: T.textMid }}>
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

function Stat({ label, value, sub, children }) {
  return (
    <div style={{
      background: T.surfaceAlt, borderRadius: 10, padding: "14px 18px", flex: 1, minWidth: 110,
    }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: T.textDim, letterSpacing: ".6px", textTransform: "uppercase", marginBottom: 4, fontFamily: T.sans }}>{label}</div>
      {value && <div style={{ fontSize: 22, fontWeight: 700, color: T.text, fontFamily: T.mono, lineHeight: 1.1 }}>{value}</div>}
      {sub && <div style={{ fontSize: 10, color: T.textDim, marginTop: 3, fontFamily: T.sans }}>{sub}</div>}
      {children}
    </div>
  );
}

function Collapsible({ title, count, children, defaultOpen = false }) {
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
        {count != null && <span style={{ fontWeight: 400, color: T.textDim, fontSize: 12 }}>({count})</span>}
      </button>
      {open && <div style={{ padding: "0 20px 20px", borderTop: `1px solid ${T.border}` }}>{children}</div>}
    </div>
  );
}

function Badge({ type }) {
  const map = {
    patient: { bg: T.blueLight, color: T.blueText },
    caregiver: { bg: T.purpleLight, color: T.purpleText },
    general: { bg: T.surfaceAlt, color: T.textMid },
    symptom: { bg: T.warmLight, color: T.warmText },
    drug: { bg: T.accentLight, color: T.accentText },
  };
  const s = map[type] || map.general;
  return (
    <span style={{
      display: "inline-block", padding: "2px 8px", borderRadius: 4,
      fontSize: 10, fontWeight: 600, fontFamily: T.sans,
      background: s.bg, color: s.color,
    }}>{type}</span>
  );
}

function Lollipop({ data }) {
  const devData = data.map(d => ({
    ...d,
    deviation: ((d.value - d.baseline) / d.baseline * 100),
  })).sort((a, b) => b.deviation - a.deviation);

  const maxAbs = Math.max(...devData.map(d => Math.abs(d.deviation)), 1);
  const rowH = 30;
  const leftPad = 170;
  const chartW = 340;
  const svgH = devData.length * rowH + 50;

  return (
    <svg width="100%" viewBox={`0 0 ${leftPad + chartW + 100} ${svgH}`} style={{ fontFamily: T.sans, display: "block" }}>
      <text x={leftPad + chartW / 2 - 90} y={16} fontSize={10} fill={T.textDim} textAnchor="middle">under-indexed</text>
      <text x={leftPad + chartW / 2} y={16} fontSize={10} fill={T.textMid} textAnchor="middle" fontWeight={600}>0%</text>
      <text x={leftPad + chartW / 2 + 90} y={16} fontSize={10} fill={T.textDim} textAnchor="middle">over-indexed</text>
      <line x1={leftPad + chartW / 2} y1={26} x2={leftPad + chartW / 2} y2={svgH - 10} stroke={T.border} strokeWidth={1} />
      {devData.map((d, i) => {
        const cx = leftPad + chartW / 2;
        const len = (d.deviation / maxAbs) * (chartW / 2 - 30);
        const y = 46 + i * rowH;
        const over = d.deviation >= 0;
        const color = over ? T.warm : T.accent;
        return (
          <g key={d.category}>
            <text x={leftPad - 10} y={y + 4} textAnchor="end" fontSize={12} fill={T.textMid}>{d.category}</text>
            <line x1={cx} y1={y} x2={cx + len} y2={y} stroke={color} strokeWidth={2} />
            <circle cx={cx + len} cy={y} r={4.5} fill={color} />
            <text x={cx + len + (over ? 10 : -10)} y={y + 4} textAnchor={over ? "start" : "end"}
              fontSize={11} fill={color} fontWeight={600} fontFamily={T.mono}>
              {over ? "+" : ""}{Math.round(d.deviation)}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function WordCloud({ emotion }) {
  const phrases = WORD_PHRASES[emotion] || [];
  if (!phrases.length) return <div style={{ color: T.textDim, fontSize: 12, fontFamily: T.sans, padding: 8 }}>Select an emotion to see associated phrases</div>;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "8px 0" }}>
      {phrases.map((p, i) => {
        const weight = 1 - (i / phrases.length) * 0.6;
        const size = 12 + weight * 8;
        return (
          <span key={i} style={{
            fontSize: size, fontWeight: weight > 0.6 ? 600 : 400,
            color: T.blue, opacity: 0.4 + weight * 0.6,
            fontFamily: T.sans, padding: "3px 8px", borderRadius: 5,
            background: T.blueLight, whiteSpace: "nowrap",
          }}>{p}</span>
        );
      })}
    </div>
  );
}

function AssertionBar() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <div style={{ display: "flex", height: 10, borderRadius: 3, overflow: "hidden", width: "100%" }}>
        <div style={{ flex: 62, background: T.blue, opacity: 0.55 }} />
        <div style={{ flex: 18, background: T.purple, opacity: 0.55 }} />
        <div style={{ flex: 20, background: T.muted, opacity: 0.45 }} />
      </div>
      <div style={{ display: "flex", gap: 10, fontSize: 9, fontFamily: T.sans, color: T.textDim }}>
        <span>patient 62%</span><span>caregiver 18%</span><span>general 20%</span>
      </div>
    </div>
  );
}

export default function DiseaseBurdenDashboard() {
  const [subgroup, setSubgroup] = useState("all");
  const [unit, setUnit] = useState("value");
  const [showPct, setShowPct] = useState(false);
  const [spanFilter, setSpanFilter] = useState("");
  const [spanType, setSpanType] = useState("all");
  const [selectedEmotion, setSelectedEmotion] = useState(null);

  const mult = MULT[subgroup];
  const unitLabel = unit === "value" ? "Paragraphs" : unit === "docs" ? "Documents" : "Authors";

  const adlFiltered = useMemo(() =>
    ADL_DATA.map(d => ({
      ...d,
      display: Math.round((unit === "docs" ? d.docs : unit === "authors" ? d.authors : d.value) * mult),
    })), [unit, mult]
  );

  const deviationData = useMemo(() =>
    ADL_DATA.map(d => ({ ...d, value: Math.round(d.value * mult), baseline: d.baseline })), [mult]
  );

  const adlTotal = adlFiltered.reduce((s, d) => s + d.display, 0);
  const adlDisplay = showPct
    ? adlFiltered.map(d => ({ ...d, display: adlTotal ? +((d.display / adlTotal) * 100).toFixed(1) : 0 }))
    : adlFiltered;

  const totalMentions = Math.round(4312 * mult);
  const totalDocs = Math.round(1847 * mult);

  const filteredPairs = SPAN_PAIRS.filter(p => {
    if (spanFilter && !p.span.toLowerCase().includes(spanFilter.toLowerCase()) && !p.adl.toLowerCase().includes(spanFilter.toLowerCase())) return false;
    if (spanType !== "all" && p.type !== spanType) return false;
    return true;
  });

  const emotionFiltered = EMOTION_DATA.map(e => ({
    ...e,
    display: Math.round((unit === "docs" ? e.docs : unit === "authors" ? e.authors : e.count) * mult),
  }));

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
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 500, fontFamily: T.font, lineHeight: 1.3 }}>
          How does <span style={{ color: T.accent, fontWeight: 700 }}>{CONDITION.toLowerCase()}</span> affect quality of life?
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: T.textDim }}>{COMMUNITY} community</p>

        <div style={{ display: "flex", gap: 24, marginTop: 18, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: T.textDim, letterSpacing: ".5px", textTransform: "uppercase" }}>Subgroup</span>
            <div style={{ display: "flex", gap: 4 }}>
              {[{ id: "all", label: "All mentions" }, { id: "patients", label: "From patients" }, { id: "caregivers", label: "From caregivers" }].map(s => (
                <Chip key={s.id} label={s.label} active={subgroup === s.id} onClick={() => setSubgroup(s.id)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 32px 48px", maxWidth: 920, margin: "0 auto" }}>
        {/* SUMMARY CARDS */}
        <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
          <Stat label="Mentions" value={fmt(totalMentions)} sub={subgroup !== "all" ? `filtered: ${subgroup}` : null} />
          <Stat label="Share of volume" value="33.6%" />
          <Stat label="Unique authors" value="623" />
          <Stat label="Post and Comments" value={fmt(totalDocs)} />
          <Stat label="Assertion split"><AssertionBar /></Stat>
        </div>

        {/* ADL BAR CHART */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 4 }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Activities of daily living affected by EDS</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: T.textDim, letterSpacing: ".5px", textTransform: "uppercase" }}>Unit</span>
                <div style={{ display: "flex", gap: 4 }}>
                  {[{ id: "value", label: "Paragraphs" }, { id: "docs", label: "Documents" }, { id: "authors", label: "Authors" }].map(u => (
                    <Chip key={u.id} label={u.label} active={unit === u.id} onClick={() => setUnit(u.id)} activeColor={T.blue} activeBg={T.blueLight} />
                  ))}
                </div>
              </div>
              <div style={{ width: 1, height: 20, background: T.border }} />
              <div style={{ display: "flex", gap: 4 }}>
                <Chip label="Count" active={!showPct} onClick={() => setShowPct(false)} activeColor={T.blue} activeBg={T.blueLight} />
                <Chip label="%" active={showPct} onClick={() => setShowPct(true)} activeColor={T.blue} activeBg={T.blueLight} />
              </div>
            </div>
          </div>
          <p style={{ margin: "0 0 16px", fontSize: 12, color: T.textDim }}>
            ADL categories most discussed in paragraphs mentioning excessive daytime sleepiness, measured in {unitLabel.toLowerCase()}
          </p>
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "20px 16px 12px" }}>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={adlDisplay} layout="vertical" margin={{ left: 10, right: 40, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: T.textDim, fontFamily: T.sans }}
                  tickFormatter={showPct ? v => `${v}%` : undefined} />
                <YAxis dataKey="category" type="category" width={155} tick={{ fontSize: 12, fill: T.textMid, fontFamily: T.sans }} />
                <Tooltip content={<Tip />} formatter={showPct ? v => [`${v}%`, unitLabel] : undefined} />
                <Bar dataKey="display" name={showPct ? `% of ${unitLabel.toLowerCase()}` : unitLabel} radius={[0, 4, 4, 0]} maxBarSize={18}>
                  {adlDisplay.map((d, i) => (
                    <Cell key={i} fill={T.accent} opacity={0.3 + (1 - i / adlDisplay.length) * 0.5} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DEVIATION LOLLIPOP */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 600 }}>Deviation from community baseline</h2>
          <p style={{ margin: "0 0 16px", fontSize: 12, color: T.textDim }}>
            How the EDS-specific ADL profile differs from the narcolepsy community overall.
            Over-indexed = disproportionately discussed with EDS.
          </p>
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "16px 16px 8px" }}>
            <Lollipop data={deviationData} />
          </div>
          <p style={{ margin: "8px 0 0", fontSize: 11, color: T.textDim, fontStyle: "italic" }}>
            Baseline = ADL frequency across all narcolepsy community discussions, not limited to EDS.
          </p>
        </div>

        {/* COLLAPSED: Span/ADL Pairs */}
        <div style={{ marginBottom: 12 }}>
          <Collapsible title="Explore clinical span / ADL pairs" count={SPAN_PAIRS.length}>
            <div style={{ display: "flex", gap: 8, margin: "14px 0", flexWrap: "wrap", alignItems: "center" }}>
              <input type="text" placeholder="Filter by span or ADL..." value={spanFilter}
                onChange={e => setSpanFilter(e.target.value)}
                style={{
                  padding: "6px 12px", borderRadius: 6, border: `1px solid ${T.border}`,
                  fontSize: 12, fontFamily: T.sans, color: T.text, background: T.surfaceAlt, outline: "none", minWidth: 180,
                }} />
              {["all", "symptom", "drug"].map(t => (
                <Chip key={t} label={t === "all" ? "All types" : t} active={spanType === t}
                  onClick={() => setSpanType(t)} activeColor={T.warm} activeBg={T.warmLight} />
              ))}
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: T.sans }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                    {["Clinical span", "Type", "ADL category", "Assertion", "Freq."].map(h => (
                      <th key={h} style={{
                        textAlign: "left", padding: "8px 10px", color: T.textDim,
                        fontWeight: 600, fontSize: 10, textTransform: "uppercase", letterSpacing: ".5px",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredPairs.map((p, i) => (
                    <tr key={i} style={{ borderBottom: i < filteredPairs.length - 1 ? `1px solid ${T.border}22` : "none" }}>
                      <td style={{ padding: "8px 10px", fontWeight: 500 }}>{p.span}</td>
                      <td style={{ padding: "8px 10px" }}><Badge type={p.type} /></td>
                      <td style={{ padding: "8px 10px", color: T.textMid }}>{p.adl}</td>
                      <td style={{ padding: "8px 10px" }}><Badge type={p.assertion} /></td>
                      <td style={{ padding: "8px 10px", fontFamily: T.mono, fontWeight: 600, color: T.textMid }}>{Math.round(p.freq * mult)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Collapsible>
        </div>

        {/* COLLAPSED: Emotion Profile */}
        <div style={{ marginBottom: 28 }}>
          <Collapsible title="Emotion profile">
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 20, marginTop: 14 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: T.textMid, margin: 0 }}>Emotion frequency</p>
                  <div style={{ display: "flex", gap: 4 }}>
                    <Chip label="Count" active={!showPct} onClick={() => setShowPct(false)} activeColor={T.blue} activeBg={T.blueLight} />
                    <Chip label="%" active={showPct} onClick={() => setShowPct(true)} activeColor={T.blue} activeBg={T.blueLight} />
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={(() => { const tot = emotionFiltered.reduce((s, e) => s + e.display, 0); return showPct ? emotionFiltered.map(e => ({ ...e, display: tot ? +((e.display / tot) * 100).toFixed(1) : 0 })) : emotionFiltered; })()} layout="vertical" margin={{ left: 0, right: 30, top: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={T.border} horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: T.textDim }} tickFormatter={showPct ? v => `${v}%` : undefined} />
                    <YAxis dataKey="emotion" type="category" width={90} tick={{ fontSize: 11, fill: T.textMid }} />
                    <Tooltip content={<Tip />} formatter={showPct ? v => [`${v}%`, unitLabel] : undefined} />
                    <Bar dataKey="display" name={showPct ? `% of ${unitLabel.toLowerCase()}` : unitLabel} radius={[0, 3, 3, 0]} maxBarSize={16}
                      cursor="pointer" onClick={(d) => setSelectedEmotion(d.emotion === selectedEmotion ? null : d.emotion)}>
                      {emotionFiltered.map((d, i) => (
                        <Cell key={i} fill={d.group === "neg" ? T.warm : T.accent}
                          opacity={selectedEmotion ? (d.emotion === selectedEmotion ? 0.85 : 0.2) : 0.6} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 6, fontSize: 11, color: T.textDim }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: T.warm, opacity: 0.6, display: "inline-block" }} /> Negative
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: T.accent, opacity: 0.6, display: "inline-block" }} /> Positive
                  </span>
                </div>
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: T.textMid, margin: "0 0 10px" }}>Distribution</p>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie data={[
                      { name: "Negative", value: emotionFiltered.filter(e => e.group === "neg").reduce((s, e) => s + e.display, 0) },
                      { name: "Positive", value: emotionFiltered.filter(e => e.group === "pos").reduce((s, e) => s + e.display, 0) },
                    ]} dataKey="value" cx="50%" cy="50%" outerRadius={55} innerRadius={28} paddingAngle={4} strokeWidth={0}>
                      <Cell fill={T.warm} opacity={0.5} />
                      <Cell fill={T.accent} opacity={0.5} />
                    </Pie>
                    <Pie data={emotionFiltered.map(e => ({ name: e.emotion, value: e.display, group: e.group }))}
                      dataKey="value" cx="50%" cy="50%" innerRadius={65} outerRadius={110} paddingAngle={1} strokeWidth={0}
                      label={({ name, percent }) => percent > 0.05 ? name : ""} labelLine={false}
                      style={{ fontSize: 10, fill: T.textMid }}>
                      {emotionFiltered.map((d, i) => (
                        <Cell key={i} fill={d.group === "neg" ? T.warm : T.accent}
                          opacity={0.25 + (d.display / (emotionFiltered[0]?.display || 1)) * 0.6} />
                      ))}
                    </Pie>
                    <Tooltip content={<Tip />} />
                  </PieChart>
                </ResponsiveContainer>
                <p style={{ textAlign: "center", fontSize: 10, color: T.textDim, margin: "4px 0 0" }}>
                  Inner: positive vs negative. Outer: individual emotions.
                </p>
              </div>
            </div>
            <div style={{ marginTop: 16, padding: "14px 16px", background: T.surfaceAlt, borderRadius: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: T.textMid }}>Associated phrases</span>
                {selectedEmotion && (
                  <>
                    <span style={{
                      padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600,
                      background: EMOTION_DATA.find(e => e.emotion === selectedEmotion)?.group === "neg" ? T.warmLight : T.accentLight,
                      color: EMOTION_DATA.find(e => e.emotion === selectedEmotion)?.group === "neg" ? T.warmText : T.accentText,
                    }}>{selectedEmotion}</span>
                    <button onClick={() => setSelectedEmotion(null)} style={{
                      marginLeft: "auto", background: "none", border: `1px solid ${T.border}`,
                      borderRadius: 5, padding: "3px 8px", fontSize: 10, color: T.textDim, cursor: "pointer", fontFamily: T.sans,
                    }}>Clear</button>
                  </>
                )}
              </div>
              <WordCloud emotion={selectedEmotion || "Frustration"} />
              {!selectedEmotion && <p style={{ fontSize: 10, color: T.textDim, margin: "6px 0 0" }}>Click an emotion bar to filter phrases</p>}
            </div>
          </Collapsible>
        </div>

        {/* EXPORT */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "14px 20px", background: T.surface,
          border: `1px solid ${T.border}`, borderRadius: 10,
        }}>
          <button style={{
            padding: "8px 18px", borderRadius: 6, fontSize: 12, fontWeight: 600,
            fontFamily: T.sans, cursor: "pointer", border: `1px solid ${T.accent}`,
            background: T.accentLight, color: T.accentText, whiteSpace: "nowrap",
          }}>Export to slides</button>
          <input type="text" placeholder="Add a note (e.g., Pulled for Dr. Lee, Q3 review)"
            style={{
              flex: 1, padding: "8px 12px", borderRadius: 6, border: `1px solid ${T.border}`,
              fontSize: 12, fontFamily: T.sans, color: T.text, background: T.surfaceAlt, outline: "none",
            }} />
          <span style={{ fontSize: 11, color: T.textDim, whiteSpace: "nowrap" }}>PNG + data table</span>
        </div>
      </div>
    </div>
  );
}
