import { useState } from "react";

const SOURCES = ["r/narcolepsy", "narcolepsyforum.org"];
const TOTAL_DOCS = 12847;
const DATE_RANGE = "Jan 2022 - Dec 2024";
const H = {
  bg: "#FAFAF8", surface: "#FFFFFF", border: "#E8E6DF",
  text: "#1A1A18", textDim: "#9C9A92",
  blueLight: "#EBF3FA", blueText: "#1E4F78",
  serif: "'Newsreader', 'Georgia', serif",
  sans: "'DM Sans', 'Helvetica Neue', sans-serif",
};

const TEAL ={ 50: "#E1F5EE", 200: "#5DCAA5", 400: "#1D9E75", 600: "#0F6E56", 800: "#085041" };
const PURPLE = { 50: "#EEEDFE", 200: "#AFA9EC", 400: "#7F77DD", 600: "#534AB7", 800: "#3C3489" };
const CORAL = { 50: "#FAECE7", 200: "#F0997B", 400: "#D85A30", 600: "#993C1D", 800: "#712B13" };
const BLUE = { 50: "#E6F1FB", 200: "#85B7EB", 400: "#378ADD", 600: "#185FA5", 800: "#0C447C" };
const AMBER = { 50: "#FAEEDA", 200: "#EF9F27", 400: "#BA7517", 600: "#854F0B", 800: "#633806" };
const GRAY = { 50: "#F1EFE8", 200: "#B4B2A9", 400: "#888780", 600: "#5F5E5A", 800: "#444441" };
const GREEN = { 50: "#EAF3DE", 400: "#639922", 800: "#27500A" };
const RED = { 50: "#FCEBEB", 400: "#E24B4A", 800: "#791F1F" };

const SENT_COLORS = { positive: GREEN[400], negative: RED[400], neutral: GRAY[400] };
const SENT_BG = { positive: GREEN[50], negative: RED[50], neutral: GRAY[50] };
const SENT_TEXT = { positive: GREEN[800], negative: RED[800], neutral: GRAY[800] };

const months = ["Jan 24","Feb 24","Mar 24","Apr 24","May 24","Jun 24","Jul 24","Aug 24","Sep 24","Oct 24","Nov 24","Dec 24","Jan 25","Feb 25","Mar 25","Apr 25","May 25","Jun 25","Jul 25","Aug 25","Sep 25","Oct 25","Nov 25","Dec 25","Jan 26","Feb 26","Mar 26"];

function seed(s) { return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; }; }

function genSentiment(posBase, negBase, rng, n) {
  const pos = [], neg = [], neu = [];
  let p = posBase, ne = negBase;
  for (let i = 0; i < n; i++) {
    p = Math.max(5, Math.min(70, p + (rng() - 0.48) * 8));
    ne = Math.max(5, Math.min(50, ne + (rng() - 0.5) * 6));
    const n_ = Math.max(5, 100 - p - ne);
    const total = p + ne + n_;
    pos.push(Math.round((p / total) * 100));
    neg.push(Math.round((ne / total) * 100));
    neu.push(100 - Math.round((p / total) * 100) - Math.round((ne / total) * 100));
  }
  return { positive: pos, negative: neg, neutral: neu };
}

const drugs = {
  "Drug A (yours)": {
    sentiment: genSentiment(48, 22, seed(42), 27),
    total: 2847,
    switchTo: 234,
    switchAway: 187,
    color: TEAL[400],
  },
  "Drug B": {
    sentiment: genSentiment(38, 30, seed(99), 27),
    total: 1923,
    switchTo: 156,
    switchAway: 298,
    color: BLUE[400],
  },
  "Drug C": {
    sentiment: genSentiment(52, 18, seed(77), 27),
    total: 1204,
    switchTo: 312,
    switchAway: 89,
    color: PURPLE[400],
  },
  "Drug D": {
    sentiment: genSentiment(30, 35, seed(55), 27),
    total: 876,
    switchTo: 67,
    switchAway: 345,
    color: CORAL[400],
  },
};

const samplePosts = {
  positive: [
    { date: "Mar 2026", text: "6 months on [Drug A] and the difference is real. I can get through a full day of work without needing to rest. My neuro is pleased with the progress and we are staying the course." },
    { date: "Feb 2026", text: "Update for anyone considering this: the first month was rough but by month 3 I noticed genuine improvement in my swallowing. Eating dinner with family feels normal again." },
    { date: "Feb 2026", text: "Got my latest blood work back and everything is stable. The drug is doing what it is supposed to do without wrecking anything else. That peace of mind matters more than people realize." },
    { date: "Jan 2026", text: "I was skeptical after failing two other treatments but this one is actually working. My grip strength is measurably better and I can open jars again. Small victory but it means everything." },
    { date: "Jan 2026", text: "Wanted to post something positive for a change. After the loading doses I have more energy than I have had in two years. Not cured but noticeably better quality of life." },
  ],
  negative: [
    { date: "Mar 2026", text: "Three months in and honestly no improvement. Doctor keeps saying give it time but I am running out of patience and money. The copay is killing us and for what." },
    { date: "Mar 2026", text: "Getting worse not better. Had to call out of work twice this week. Starting to think this drug is not the right fit for me. Seeing my neuro next week to discuss options." },
    { date: "Feb 2026", text: "The infusion itself is fine but the 48 hours after are brutal. I basically lose two days every two weeks. That is not sustainable long term, especially with a full time job." },
    { date: "Feb 2026", text: "Insurance denied the next round of treatment. Now I have to appeal while my symptoms are getting worse without it. The system is broken." },
    { date: "Jan 2026", text: "I really wanted this to work because I have heard such good things from others. But my experience has been disappointing. Minimal improvement and constant fatigue that was not there before." },
  ],
  neutral: [
    { date: "Mar 2026", text: "Had my 6 month check in. Numbers are stable, not worse not better. Doctor wants to continue for another quarter before making any changes. I am okay with that for now." },
    { date: "Feb 2026", text: "Starting [Drug A] next week. Have been reading through this group and the experiences seem really mixed. Trying to keep expectations realistic." },
    { date: "Feb 2026", text: "Does anyone know if you can travel internationally while on the infusion schedule? Trying to plan a trip but not sure how to handle the timing." },
    { date: "Jan 2026", text: "Switched insurance plans and my new plan covers it but with a different specialty pharmacy. Has anyone dealt with the transition? Any tips for making it smooth." },
  ],
};

function Donut({ data, size = 120 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = size / 2 - 8;
  const cx = size / 2;
  const cy = size / 2;
  let cumAngle = -Math.PI / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {data.map((d, i) => {
        const pct = d.value / total;
        const angle = pct * Math.PI * 2;
        const x1 = cx + r * Math.cos(cumAngle);
        const y1 = cy + r * Math.sin(cumAngle);
        const x2 = cx + r * Math.cos(cumAngle + angle);
        const y2 = cy + r * Math.sin(cumAngle + angle);
        const large = angle > Math.PI ? 1 : 0;
        const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
        cumAngle += angle;
        return <path key={i} d={path} fill={d.color} />;
      })}
      <circle cx={cx} cy={cy} r={r * 0.55} fill="var(--color-background-primary)" />
    </svg>
  );
}

function SentDonut({ sentData, size }) {
  const posAvg = Math.round(sentData.positive.reduce((a, b) => a + b, 0) / sentData.positive.length);
  const negAvg = Math.round(sentData.negative.reduce((a, b) => a + b, 0) / sentData.negative.length);
  const neuAvg = 100 - posAvg - negAvg;
  return (
    <Donut size={size} data={[
      { value: posAvg, color: SENT_COLORS.positive },
      { value: neuAvg, color: SENT_COLORS.neutral },
      { value: negAvg, color: SENT_COLORS.negative },
    ]} />
  );
}

function TrendChart({ sentData, granularity }) {
  const chartW = 620, chartH = 160, padL = 34, padR = 10, padT = 10, padB = 24;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;

  let labels, datasets;
  if (granularity === "quarterly") {
    labels = ["Q1 24","Q2 24","Q3 24","Q4 24","Q1 25","Q2 25","Q3 25","Q4 25","Q1 26"];
    datasets = {};
    ["positive","negative","neutral"].forEach(s => {
      const q = [];
      for (let i = 0; i < sentData[s].length; i += 3) {
        const sl = sentData[s].slice(i, i + 3);
        q.push(Math.round(sl.reduce((a, b) => a + b, 0) / sl.length));
      }
      datasets[s] = q;
    });
  } else {
    labels = months;
    datasets = sentData;
  }

  const n = labels.length;

  function line(data, color) {
    return data.map((v, i) => {
      const x = padL + (i / (n - 1)) * plotW;
      const y = padT + plotH - (v / 100) * plotH;
      return `${x},${y}`;
    }).join(" ");
  }

  return (
    <svg width="100%" viewBox={`0 0 ${chartW} ${chartH}`} style={{ display: "block" }}>
      {[0, 50, 100].map(v => {
        const y = padT + plotH - (v / 100) * plotH;
        return (
          <g key={v}>
            <line x1={padL} y1={y} x2={chartW - padR} y2={y} stroke="var(--color-border-tertiary)" strokeWidth="0.5" />
            <text x={padL - 6} y={y + 3} textAnchor="end" fontSize="9" fill="var(--color-text-tertiary)" fontFamily="var(--font-sans)">{v}%</text>
          </g>
        );
      })}
      {labels.map((l, i) => {
        const x = padL + (i / (n - 1)) * plotW;
        const show = n <= 12 || i % 3 === 0;
        return show ? <text key={i} x={x} y={chartH - 2} textAnchor="middle" fontSize="8" fill="var(--color-text-tertiary)" fontFamily="var(--font-sans)">{l}</text> : null;
      })}
      <polyline points={line(datasets.positive, null)} fill="none" stroke={SENT_COLORS.positive} strokeWidth="1.5" strokeLinejoin="round" />
      <polyline points={line(datasets.negative, null)} fill="none" stroke={SENT_COLORS.negative} strokeWidth="1.5" strokeLinejoin="round" />
      <polyline points={line(datasets.neutral, null)} fill="none" stroke={SENT_COLORS.neutral} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function StackedTrend({ sentData }) {
  const chartW = 620, chartH = 150, padL = 34, padR = 10, padT = 8, padB = 24;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;
  const n = months.length;
  const barW = (plotW / n) * 0.7;

  return (
    <svg width="100%" viewBox={`0 0 ${chartW} ${chartH}`} style={{ display: "block" }}>
      {[0, 50, 100].map(v => {
        const y = padT + plotH - (v / 100) * plotH;
        return (
          <g key={v}>
            <line x1={padL} y1={y} x2={chartW - padR} y2={y} stroke="var(--color-border-tertiary)" strokeWidth="0.5" />
            <text x={padL - 6} y={y + 3} textAnchor="end" fontSize="9" fill="var(--color-text-tertiary)" fontFamily="var(--font-sans)">{v}%</text>
          </g>
        );
      })}
      {months.map((m, i) => {
        const xBase = padL + (i / n) * plotW + (plotW / n - barW) / 2;
        const p = sentData.positive[i];
        const ne = sentData.negative[i];
        const nu = sentData.neutral[i];
        const pH = (p / 100) * plotH;
        const neH = (ne / 100) * plotH;
        const nuH = (nu / 100) * plotH;
        return (
          <g key={i}>
            <rect x={xBase} y={padT + plotH - pH - neH - nuH} width={barW} height={pH} fill={SENT_COLORS.positive} rx="1" />
            <rect x={xBase} y={padT + plotH - neH - nuH} width={barW} height={nuH} fill={SENT_COLORS.neutral} rx="1" />
            <rect x={xBase} y={padT + plotH - neH} width={barW} height={neH} fill={SENT_COLORS.negative} rx="1" />
            {i % 3 === 0 && <text x={xBase + barW / 2} y={chartH - 2} textAnchor="middle" fontSize="8" fill="var(--color-text-tertiary)" fontFamily="var(--font-sans)">{m}</text>}
          </g>
        );
      })}
    </svg>
  );
}

function CompBar({ drugList, selectedDrugs }) {
  const active = drugList.filter(d => selectedDrugs.includes(d));
  const barH = 28;
  const gap = 10;
  const totalH = active.length * (barH + gap + 16);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {active.map(name => {
        const d = drugs[name];
        const posAvg = Math.round(d.sentiment.positive.reduce((a, b) => a + b, 0) / d.sentiment.positive.length);
        const negAvg = Math.round(d.sentiment.negative.reduce((a, b) => a + b, 0) / d.sentiment.negative.length);
        const neuAvg = 100 - posAvg - negAvg;
        return (
          <div key={name}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 500 }}>{name}</span>
              <span style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{d.total.toLocaleString()} posts</span>
            </div>
            <div style={{ display: "flex", height: barH, borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${posAvg}%`, background: SENT_COLORS.positive, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {posAvg > 10 && <span style={{ fontSize: 10, color: "#fff", fontWeight: 500 }}>{posAvg}%</span>}
              </div>
              <div style={{ width: `${neuAvg}%`, background: SENT_COLORS.neutral, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {neuAvg > 10 && <span style={{ fontSize: 10, color: "#fff", fontWeight: 500 }}>{neuAvg}%</span>}
              </div>
              <div style={{ width: `${negAvg}%`, background: SENT_COLORS.negative, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {negAvg > 10 && <span style={{ fontSize: 10, color: "#fff", fontWeight: 500 }}>{negAvg}%</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PostCard({ post, sentiment }) {
  return (
    <div style={{ padding: "10px 14px", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", borderLeft: `3px solid ${SENT_COLORS[sentiment]}`, marginBottom: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: "var(--border-radius-md)", background: SENT_BG[sentiment], color: SENT_TEXT[sentiment] }}>{sentiment}</span>
        <span style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{post.date}</span>
      </div>
      <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{post.text}</div>
    </div>
  );
}

export default function TreatmentDashboard() {
  const [activeDrug, setActiveDrug] = useState("Drug A");
  const [granularity, setGranularity] = useState("monthly");
  const [chartType, setChartType] = useState("trend");
  const [compDrugs, setCompDrugs] = useState(["Drug A", "Drug B", "Drug C"]);
  const [postSent, setPostSent] = useState("all");
  const [postPage, setPostPage] = useState(0);

  const drugNames = Object.keys(drugs);
  const d = drugs[activeDrug];
  const posAvg = Math.round(d.sentiment.positive.reduce((a, b) => a + b, 0) / d.sentiment.positive.length);
  const negAvg = Math.round(d.sentiment.negative.reduce((a, b) => a + b, 0) / d.sentiment.negative.length);
  const neuAvg = 100 - posAvg - negAvg;

  const recentPos = d.sentiment.positive.slice(-3);
  const prevPos = d.sentiment.positive.slice(-6, -3);
  const recentAvg = Math.round(recentPos.reduce((a, b) => a + b, 0) / 3);
  const prevAvg = Math.round(prevPos.reduce((a, b) => a + b, 0) / 3);
  const delta = recentAvg - prevAvg;

  const toggleComp = (name) => {
    setCompDrugs(prev => prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]);
  };

  const allPosts = postSent === "all"
    ? [...samplePosts.positive, ...samplePosts.negative, ...samplePosts.neutral].sort((a, b) => b.date.localeCompare(a.date))
    : (samplePosts[postSent] || []);
  const postsPerPage = 3;
  const totalPages = Math.ceil(allPosts.length / postsPerPage);
  const visiblePosts = allPosts.slice(postPage * postsPerPage, (postPage + 1) * postsPerPage);

  return (
    <div style={{ minHeight: "100vh", background: H.bg, fontFamily: H.sans, color: H.text }}>
      {/* HEADER */}
      <div style={{ background: H.surface, borderBottom: `1px solid ${H.border}`, padding: "24px 32px 20px" }}>
        {/* Row 1: sources + doc count */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {SOURCES.map(s => (
            <span key={s} style={{
              padding: "3px 10px", borderRadius: 5, fontSize: 11, fontWeight: 500,
              background: H.blueLight, color: H.blueText,
            }}>{s}</span>
          ))}
          <span style={{ marginLeft: "auto", fontSize: 12, color: H.textDim, alignSelf: "center" }}>
            {TOTAL_DOCS.toLocaleString()} documents &middot; {DATE_RANGE}
          </span>
        </div>
        {/* Row 2: title */}
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 500, fontFamily: H.serif, lineHeight: 1.3 }}>
          How do patients feel about their treatment?
        </h1>
        {/* Row 3: drug filter */}
        <div style={{ display: "flex", gap: 20, marginTop: 18, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: H.textDim, letterSpacing: ".5px", textTransform: "uppercase" }}>Drug</span>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {drugNames.map(name => (
                <button key={name} onClick={() => setActiveDrug(name)} style={{
                  fontSize: 11, padding: "5px 14px", borderRadius: 6, cursor: "pointer",
                  fontFamily: H.sans, fontWeight: activeDrug === name ? 600 : 400,
                  background: activeDrug === name ? drugs[name].color : "transparent",
                  color: activeDrug === name ? "#fff" : H.textDim,
                  border: `1px solid ${activeDrug === name ? drugs[name].color : H.border}`,
                  transition: "all .15s",
                }}>
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 32px 48px", maxWidth: 720, margin: "0 auto" }}>

      <div style={{ display: "grid", gridTemplateColumns: "120px minmax(0,1fr)", gap: 16, marginBottom: 20, background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "16px 20px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <SentDonut sentData={d.sentiment} size={100} />
          <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 6 }}>{d.total.toLocaleString()} posts</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
          {[
            { label: "Positive", pct: posAvg, color: "positive" },
            { label: "Neutral", pct: neuAvg, color: "neutral" },
            { label: "Negative", pct: negAvg, color: "negative" },
          ].map(s => (
            <div key={s.label} style={{ display: "grid", gridTemplateColumns: "70px 1fr 40px", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{s.label}</span>
              <div style={{ height: 14, borderRadius: 3, background: "var(--color-background-secondary)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${s.pct}%`, background: SENT_COLORS[s.color], borderRadius: 3 }} />
              </div>
              <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", textAlign: "right" }}>{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8, marginBottom: 20 }}>
        <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "10px 14px" }}>
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 3 }}>Positive sentiment trend</div>
          <div style={{ fontSize: 18, fontWeight: 500, color: delta >= 0 ? GREEN[400] : RED[400] }}>{delta >= 0 ? "+" : ""}{delta}pp</div>
          <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>vs. prior 3 months</div>
        </div>
        <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "10px 14px" }}>
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 3 }}>Switching to {activeDrug.split(" (")[0]}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={{ fontSize: 18, fontWeight: 500, color: TEAL[400] }}>{d.switchTo}</span>
            <span style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>mentions</span>
          </div>
        </div>
        <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "10px 14px" }}>
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 3 }}>Switching away</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={{ fontSize: 18, fontWeight: 500, color: CORAL[400] }}>{d.switchAway}</span>
            <span style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>mentions</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>Sentiment over time</div>
        <div style={{ display: "flex", gap: 4 }}>
          {["trend", "stacked"].map(t => (
            <button key={t} onClick={() => setChartType(t)} style={{
              fontSize: 11, padding: "3px 10px", borderRadius: "var(--border-radius-md)", cursor: "pointer",
              background: chartType === t ? "var(--color-background-secondary)" : "transparent",
              border: "0.5px solid var(--color-border-tertiary)",
              color: chartType === t ? "var(--color-text-primary)" : "var(--color-text-tertiary)",
            }}>
              {t === "trend" ? "Lines" : "Stacked"}
            </button>
          ))}
          {chartType === "trend" && ["monthly", "quarterly"].map(g => (
            <button key={g} onClick={() => setGranularity(g)} style={{
              fontSize: 11, padding: "3px 10px", borderRadius: "var(--border-radius-md)", cursor: "pointer",
              background: granularity === g ? "var(--color-background-secondary)" : "transparent",
              border: "0.5px solid var(--color-border-tertiary)",
              color: granularity === g ? "var(--color-text-primary)" : "var(--color-text-tertiary)",
            }}>
              {g === "monthly" ? "Monthly" : "Quarterly"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 6, fontSize: 11, color: "var(--color-text-secondary)" }}>
        {[["positive", "Positive"], ["neutral", "Neutral"], ["negative", "Negative"]].map(([k, l]) => (
          <span key={k} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 10, height: 3, borderRadius: 1, background: SENT_COLORS[k] }} />{l}
          </span>
        ))}
      </div>

      <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "14px 16px", marginBottom: 24 }}>
        {chartType === "trend"
          ? <TrendChart sentData={d.sentiment} granularity={granularity} />
          : <StackedTrend sentData={d.sentiment} />
        }
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>Drug comparison</div>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 10, flexWrap: "wrap" }}>
        {drugNames.map(name => (
          <button key={name} onClick={() => toggleComp(name)} style={{
            fontSize: 10, padding: "3px 10px", borderRadius: "var(--border-radius-md)", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 4,
            background: compDrugs.includes(name) ? "var(--color-background-primary)" : "transparent",
            border: compDrugs.includes(name) ? `0.5px solid ${drugs[name].color}` : "0.5px solid var(--color-border-tertiary)",
            color: compDrugs.includes(name) ? "var(--color-text-primary)" : "var(--color-text-tertiary)",
            opacity: compDrugs.includes(name) ? 1 : 0.5,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 2, background: drugs[name].color, opacity: compDrugs.includes(name) ? 1 : 0.3 }} />
            {name}
          </button>
        ))}
      </div>
      <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "16px 20px", marginBottom: 24 }}>
        <CompBar drugList={drugNames} selectedDrugs={compDrugs} />
        <div style={{ display: "flex", gap: 12, marginTop: 10, fontSize: 10, color: "var(--color-text-tertiary)" }}>
          {[["positive", "Positive"], ["neutral", "Neutral"], ["negative", "Negative"]].map(([k, l]) => (
            <span key={k} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: SENT_COLORS[k] }} />{l}
            </span>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Patient posts</div>
      <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 10 }}>De-identified posts about {activeDrug.split(" (")[0]}</div>

      <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
        {["all", "positive", "negative", "neutral"].map(s => (
          <button key={s} onClick={() => { setPostSent(s); setPostPage(0); }} style={{
            fontSize: 10, padding: "3px 10px", borderRadius: "var(--border-radius-md)", cursor: "pointer",
            background: postSent === s ? (s === "all" ? "var(--color-background-secondary)" : SENT_BG[s]) : "transparent",
            border: `0.5px solid ${postSent === s && s !== "all" ? SENT_COLORS[s] : "var(--color-border-tertiary)"}`,
            color: postSent === s ? (s === "all" ? "var(--color-text-primary)" : SENT_TEXT[s]) : "var(--color-text-tertiary)",
          }}>
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 8 }}>
        {visiblePosts.map((p, i) => {
          const sent = postSent === "all"
            ? (samplePosts.positive.includes(p) ? "positive" : samplePosts.negative.includes(p) ? "negative" : "neutral")
            : postSent;
          return <PostCard key={i} post={p} sentiment={sent} />;
        })}
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 20 }}>
          <button onClick={() => setPostPage(Math.max(0, postPage - 1))} disabled={postPage === 0}
            style={{ fontSize: 11, padding: "3px 10px", borderRadius: "var(--border-radius-md)", cursor: postPage === 0 ? "default" : "pointer", border: "0.5px solid var(--color-border-tertiary)", background: "transparent", color: "var(--color-text-secondary)", opacity: postPage === 0 ? 0.4 : 1 }}>
            Prev
          </button>
          <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", lineHeight: "26px" }}>{postPage + 1} / {totalPages}</span>
          <button onClick={() => setPostPage(Math.min(totalPages - 1, postPage + 1))} disabled={postPage >= totalPages - 1}
            style={{ fontSize: 11, padding: "3px 10px", borderRadius: "var(--border-radius-md)", cursor: postPage >= totalPages - 1 ? "default" : "pointer", border: "0.5px solid var(--color-border-tertiary)", background: "transparent", color: "var(--color-text-secondary)", opacity: postPage >= totalPages - 1 ? 0.4 : 1 }}>
            Next
          </button>
        </div>
      )}

      <div style={{ padding: "12px 16px", border: `0.5px solid ${GRAY[200]}`, borderRadius: "var(--border-radius-lg)", background: "var(--color-background-secondary)" }}>
        <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Pipeline</div>
        <div style={{ fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
          Posts filtered to author-asserted drug experience via CSR (pharmacologic entity extraction) + assertion model. Targeted sentiment classification applied per drug mention context. Switching detection identifies directional treatment changes. All drugs compared from the same community corpus.
        </div>
        <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: "var(--border-radius-md)", background: TEAL[50], color: TEAL[800] }}>CSR: pharmacologic</span>
          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: "var(--border-radius-md)", background: CORAL[50], color: CORAL[800] }}>Assertion: author-experienced</span>
          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: "var(--border-radius-md)", background: PURPLE[50], color: PURPLE[800] }}>Targeted sentiment</span>
          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: "var(--border-radius-md)", background: AMBER[50], color: AMBER[800] }}>Switch detection</span>
        </div>
      </div>
      </div>
    </div>
  );
}
