import { useState } from "react";

const TEAL = { 50: "#E1F5EE", 200: "#5DCAA5", 400: "#1D9E75", 600: "#0F6E56", 800: "#085041" };
const PURPLE = { 50: "#EEEDFE", 200: "#AFA9EC", 400: "#7F77DD", 600: "#534AB7", 800: "#3C3489" };
const CORAL = { 50: "#FAECE7", 200: "#F0997B", 400: "#D85A30", 600: "#993C1D", 800: "#712B13" };
const BLUE = { 50: "#E6F1FB", 200: "#85B7EB", 400: "#378ADD", 600: "#185FA5", 800: "#0C447C" };
const AMBER = { 50: "#FAEEDA", 200: "#EF9F27", 400: "#BA7517", 600: "#854F0B", 800: "#633806" };
const PINK = { 50: "#FBEAF0", 200: "#ED93B1", 400: "#D4537E", 600: "#993556", 800: "#72243E" };
const GRAY = { 50: "#F1EFE8", 200: "#B4B2A9", 400: "#888780", 600: "#5F5E5A", 800: "#444441" };

const T = {
  bg: "#FAFAF8", surface: "#FFFFFF", surfaceAlt: "#F5F4F0",
  border: "#E8E6DF", text: "#1A1A18", textMid: "#5C5B56", textDim: "#9C9A92",
  accent: "#1D6B4F", accentLight: "#E6F2EC", accentText: "#14513C",
  blue: "#2D6A9F", blueLight: "#EBF3FA", blueText: "#1E4F78",
  serif: "'Newsreader', 'Georgia', serif",
  sans: "'DM Sans', 'Helvetica Neue', sans-serif",
};

const SOURCES = ["r/narcolepsy", "PWN4PWN"];
const TOTAL_DOCS = 12847;
const DATE_RANGE = "Jan 2022 - Dec 2024";
const COMMUNITY = "Narcolepsy";

const csrData = {
  symptoms: [
    { label: "Excessive daytime sleepiness", count: 2341, pct: 28.4, snomed: "Excessive daytime somnolence (finding)" },
    { label: "Cataplexy", count: 1687, pct: 20.5, snomed: "Cataplexy (finding)" },
    { label: "Brain fog", count: 1134, pct: 13.8, snomed: "Cognitive impairment (finding)" },
    { label: "Disrupted nighttime sleep", count: 876, pct: 10.6, snomed: "Sleep maintenance insomnia (finding)" },
    { label: "Sleep paralysis", count: 743, pct: 9.0, snomed: "Sleep paralysis (finding)" },
    { label: "Hypnagogic hallucinations", count: 598, pct: 7.3, snomed: "Hypnagogic hallucination (finding)" },
    { label: "Automatic behavior", count: 387, pct: 4.7, snomed: "Automatism (finding)" },
    { label: "Memory lapses", count: 312, pct: 3.8, snomed: "Memory impairment (finding)" },
    { label: "Microsleep episodes", count: 164, pct: 2.0, snomed: "Microsleep (finding)" },
  ],
  pharmacologic: [
    { label: "Sodium oxybate (Xyrem/Xywav)", count: 1876, pct: 32.4 },
    { label: "Modafinil (Provigil)", count: 1342, pct: 23.2 },
    { label: "Pitolisant (Wakix)", count: 743, pct: 12.8 },
    { label: "Armodafinil (Nuvigil)", count: 612, pct: 10.6 },
    { label: "Solriamfetol (Sunosi)", count: 489, pct: 8.4 },
    { label: "Methylphenidate", count: 734, pct: 12.7 },
  ],
  diseases: [
    { label: "Narcolepsy type 1", count: 4231, pct: 38.7 },
    { label: "Narcolepsy type 2", count: 2187, pct: 20.0 },
    { label: "Sleep apnea", count: 1043, pct: 9.5 },
    { label: "Anxiety / depression", count: 987, pct: 9.0 },
    { label: "Obesity", count: 743, pct: 6.8 },
    { label: "ADHD", count: 634, pct: 5.8 },
    { label: "Migraine", count: 412, pct: 3.8 },
    { label: "Idiopathic hypersomnia", count: 312, pct: 2.9 },
  ],
};

const emotionsData = [
  { emotion: "Frustration", count: 1876, pct: 24.1, color: CORAL[400] },
  { emotion: "Exhaustion", count: 1432, pct: 18.4, color: PURPLE[400] },
  { emotion: "Fear / worry", count: 987, pct: 12.7, color: AMBER[400] },
  { emotion: "Hope", count: 876, pct: 11.3, color: TEAL[400] },
  { emotion: "Determination", count: 654, pct: 8.4, color: TEAL[200] },
  { emotion: "Isolation / loneliness", count: 598, pct: 7.7, color: GRAY[400] },
  { emotion: "Grief / loss", count: 432, pct: 5.6, color: CORAL[200] },
  { emotion: "Gratitude", count: 387, pct: 5.0, color: PINK[400] },
  { emotion: "Anger", count: 312, pct: 4.0, color: "#E24B4A" },
  { emotion: "Acceptance", count: 234, pct: 3.0, color: BLUE[400] },
];

const adlData = [
  { category: "Working / employment", pct: 26.4, color: TEAL[400] },
  { category: "Driving / transport", pct: 18.7, color: CORAL[400] },
  { category: "Socializing", pct: 12.3, color: PURPLE[400] },
  { category: "Physical exercise", pct: 9.8, color: BLUE[400] },
  { category: "School / learning", pct: 8.4, color: AMBER[400] },
  { category: "Cooking / meal prep", pct: 6.1, color: GRAY[400] },
  { category: "Managing medications", pct: 5.8, color: PINK[400] },
  { category: "Personal hygiene", pct: 4.9, color: TEAL[200] },
  { category: "Dressing", pct: 3.2, color: BLUE[200] },
  { category: "Household chores", pct: 2.8, color: AMBER[200] },
  { category: "Childcare", pct: 2.3, color: CORAL[200] },
];

function MetricCard({ label, value, sub }) {
  return (
    <div style={{ background: T.surfaceAlt, borderRadius: 10, padding: "14px 18px", minWidth: 0 }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: T.textDim, letterSpacing: ".6px", textTransform: "uppercase", marginBottom: 4, fontFamily: T.sans }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: T.text, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: T.textDim, marginTop: 3, fontFamily: T.sans }}>{sub}</div>}
    </div>
  );
}

function HBar({ items, colorFn, showSnomed }) {
  const max = Math.max(...items.map(d => d.count || d.pct));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {items.map((d, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: showSnomed ? "190px 1fr 44px 220px" : "190px 1fr 44px", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: T.textMid, textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: T.sans }}>{d.label || d.category}</span>
          <div style={{ height: 18, borderRadius: 3, overflow: "hidden", background: T.surfaceAlt }}>
            <div style={{ height: "100%", width: `${((d.count || d.pct) / max) * 100}%`, background: colorFn ? colorFn(i) : TEAL[400], borderRadius: 3, transition: "width 0.4s ease" }} />
          </div>
          <span style={{ fontSize: 11, color: T.textDim, textAlign: "right", fontFamily: T.sans }}>{d.pct ? `${d.pct}%` : d.count?.toLocaleString()}</span>
          {showSnomed && d.snomed && (
            <span style={{ fontSize: 10, color: BLUE[600], fontFamily: "'JetBrains Mono', monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.snomed}</span>
          )}
        </div>
      ))}
    </div>
  );
}

function EmotionsBars({ data }) {
  const max = Math.max(...data.map(d => d.count));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 1fr 44px", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: T.textMid, textAlign: "right", fontFamily: T.sans }}>{d.emotion}</span>
          <div style={{ height: 18, borderRadius: 3, overflow: "hidden", background: T.surfaceAlt }}>
            <div style={{ height: "100%", width: `${(d.count / max) * 100}%`, background: d.color, borderRadius: 3 }} />
          </div>
          <span style={{ fontSize: 11, color: T.textDim, textAlign: "right", fontFamily: T.sans }}>{d.pct}%</span>
        </div>
      ))}
    </div>
  );
}

function SectionHeader({ title, badge, sub }) {
  return (
    <div style={{ marginTop: 28, marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: T.text, fontFamily: T.sans }}>{title}</span>
        {badge && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: badge.bg, color: badge.color, fontFamily: T.sans, fontWeight: 600 }}>{badge.text}</span>}
      </div>
      {sub && <div style={{ fontSize: 12, color: T.textDim, marginTop: 3, fontFamily: T.sans }}>{sub}</div>}
    </div>
  );
}

export default function ExploreDashboard() {
  const [showCsl, setShowCsl] = useState(false);
  const [csrView, setCsrView] = useState("symptoms");

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.sans, color: T.text }}>
      {/* HEADER */}
      <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "24px 32px 20px" }}>
        {/* Row 1: sources + doc count */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {SOURCES.map(s => (
            <span key={s} style={{
              padding: "3px 10px", borderRadius: 5, fontSize: 11, fontWeight: 500,
              background: T.blueLight, color: T.blueText, fontFamily: T.sans,
            }}>{s}</span>
          ))}
          <span style={{ marginLeft: "auto", fontSize: 12, color: T.textDim, alignSelf: "center" }}>
            {TOTAL_DOCS.toLocaleString()} documents &middot; {DATE_RANGE}
          </span>
        </div>
        {/* Row 2: title */}
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 500, fontFamily: T.serif, lineHeight: 1.3 }}>
          Community landscape: <span style={{ color: T.accent, fontWeight: 700 }}>{COMMUNITY.toLowerCase()}</span>
        </h1>
      </div>

      <div style={{ padding: "20px 32px 48px", maxWidth: 920, margin: "0 auto" }}>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 10, marginBottom: 28 }}>
          <MetricCard label="Documents" value="12,847" sub="Posts & comments" />
          <MetricCard label="Unique authors" value="2,341" sub="De-identified" />
          <MetricCard label="Clinical spans" value="89,432" sub="CSR extracted" />
          <MetricCard label="Emotions" value="3,341" sub="Extracted" />
          <MetricCard label="ADL mentions" value="21,847" sub="11 categories" />
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <SectionHeader
            title="Clinical entity frequency"
            badge={{ text: "CSR model", bg: TEAL[50], color: TEAL[800] }}
            sub="Most frequently mentioned clinical entities extracted by clinical span recognition"
          />
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 4 }}>
              {[
                { id: "symptoms", label: "Symptoms" },
                { id: "pharmacologic", label: "Medications" },
                { id: "diseases", label: "Comorbidities" },
              ].map(v => (
                <button key={v.id} onClick={() => setCsrView(v.id)} style={{
                  padding: "5px 14px", borderRadius: 6, fontSize: 12, fontFamily: T.sans,
                  fontWeight: csrView === v.id ? 600 : 400, cursor: "pointer", transition: "all .15s",
                  border: `1px solid ${csrView === v.id ? TEAL[400] : T.border}`,
                  background: csrView === v.id ? TEAL[50] : "transparent",
                  color: csrView === v.id ? TEAL[800] : T.textDim,
                }}>{v.label}</button>
              ))}
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: T.textMid, cursor: "pointer", whiteSpace: "nowrap" }}>
              <input type="checkbox" checked={showCsl} onChange={e => setShowCsl(e.target.checked)} style={{ width: 14, height: 14 }} />
              Show SNOMED mapping
            </label>
          </div>
        </div>

        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "16px 20px" }}>
          <HBar
            items={csrData[csrView]}
            colorFn={() => csrView === "symptoms" ? TEAL[400] : csrView === "pharmacologic" ? PURPLE[400] : BLUE[400]}
            showSnomed={showCsl && csrView === "symptoms"}
          />
          {showCsl && csrView !== "symptoms" && (
            <div style={{ marginTop: 12, padding: "8px 12px", background: AMBER[50], borderRadius: 6, fontSize: 11, color: AMBER[800], fontFamily: T.sans }}>
              SNOMED/RxNorm mapping available for this entity type via CSL model. Contact your account team to enable concept normalization.
            </div>
          )}
        </div>

        {showCsl && (
          <div style={{ marginTop: 10, padding: "10px 14px", background: BLUE[50], borderRadius: 8, fontSize: 12, color: BLUE[800], fontFamily: T.sans }}>
            <span style={{ fontWeight: 600 }}>CSL concept normalization</span> links patient language to SNOMED CT and RxNorm vocabularies. "Excessive daytime sleepiness" maps to Excessive daytime somnolence (finding), "sodium oxybate" maps to Sodium oxybate (substance). This enables cross-study comparability and regulatory-aligned terminology.
          </div>
        )}

        <SectionHeader
          title="Emotion landscape"
          badge={{ text: "Emotion model", bg: CORAL[50], color: CORAL[800] }}
          sub="Distribution of emotions expressed across the corpus, ranked by frequency"
        />

        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "16px 20px" }}>
          <EmotionsBars data={emotionsData} />
          <div style={{ marginTop: 12, fontSize: 11, color: T.textDim, fontFamily: T.sans }}>
            Baseline corpus emotion distribution for comparison available in full report
          </div>
        </div>

        <SectionHeader
          title="Impact on daily living"
          badge={{ text: "ADL model", bg: PURPLE[50], color: PURPLE[800] }}
          sub="Proportion of documents mentioning each ADL category, reflecting condition impact on daily life"
        />

        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "16px 20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {adlData.map((d, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 1fr 44px", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: T.textMid, textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: T.sans }}>{d.category}</span>
                <div style={{ height: 18, borderRadius: 3, overflow: "hidden", background: T.surfaceAlt }}>
                  <div style={{ height: "100%", width: `${(d.pct / 30) * 100}%`, background: d.color, borderRadius: 3 }} />
                </div>
                <span style={{ fontSize: 11, color: T.textDim, textAlign: "right", fontFamily: T.sans }}>{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 28, padding: "14px 18px", border: `1px solid ${T.border}`, borderRadius: 10, background: T.surfaceAlt }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, fontFamily: T.sans, color: T.text }}>What this report provides</div>
          <div style={{ fontSize: 12, color: T.textMid, lineHeight: 1.7, fontFamily: T.sans }}>
            This exploratory report delivers a quantified landscape of how the narcolepsy patient and caregiver community discusses their condition. Clinical entities (symptoms, medications, comorbidities) are extracted by the CSR span recognition model. Daily living impact is classified by the ADL multi-label model across 11 categories. Emotion distribution is measured against a corpus baseline.
          </div>
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 5, background: TEAL[50], color: TEAL[800], fontFamily: T.sans, fontWeight: 600 }}>CSR: 27-label span recognition</span>
            <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 5, background: PURPLE[50], color: PURPLE[800], fontFamily: T.sans, fontWeight: 600 }}>ADL: multi-label classification</span>
            <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 5, background: CORAL[50], color: CORAL[800], fontFamily: T.sans, fontWeight: 600 }}>Emotion: sentiment + emotion</span>
            <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 5, background: BLUE[50], color: BLUE[800], fontFamily: T.sans, fontWeight: 600 }}>CSL: SNOMED/RxNorm linking (add-on)</span>
          </div>
        </div>

      </div>
    </div>
  );
}
