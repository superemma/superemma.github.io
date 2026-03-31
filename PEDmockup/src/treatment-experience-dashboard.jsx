import { useState } from "react";

const TEAL = { 50: "#E1F5EE", 100: "#9FE1CB", 200: "#5DCAA5", 400: "#1D9E75", 600: "#0F6E56", 800: "#085041" };
const PURPLE = { 50: "#EEEDFE", 200: "#AFA9EC", 400: "#7F77DD", 600: "#534AB7", 800: "#3C3489" };
const CORAL = { 50: "#FAECE7", 200: "#F0997B", 400: "#D85A30", 600: "#993C1D", 800: "#712B13" };
const BLUE = { 50: "#E6F1FB", 200: "#85B7EB", 400: "#378ADD", 600: "#185FA5", 800: "#0C447C" };
const AMBER = { 50: "#FAEEDA", 200: "#EF9F27", 400: "#BA7517", 600: "#854F0B", 800: "#633806" };
const GRAY = { 50: "#F1EFE8", 200: "#B4B2A9", 400: "#888780", 600: "#5F5E5A", 800: "#444441" };
const RED = { 50: "#FCEBEB", 400: "#E24B4A", 800: "#791F1F" };
const GREEN = { 50: "#EAF3DE", 400: "#639922", 800: "#27500A" };

const months = ["Jan 24","Feb 24","Mar 24","Apr 24","May 24","Jun 24","Jul 24","Aug 24","Sep 24","Oct 24","Nov 24","Dec 24","Jan 25","Feb 25","Mar 25","Apr 25","May 25","Jun 25","Jul 25","Aug 25","Sep 25","Oct 25","Nov 25","Dec 25","Jan 26","Feb 26","Mar 26"];

function genTrend(base, variance, n) {
  const arr = [];
  let v = base;
  for (let i = 0; i < n; i++) {
    v = Math.max(2, v + (Math.random() - 0.48) * variance);
    arr.push(Math.round(v));
  }
  return arr;
}

const efficacy = genTrend(42, 8, 27);
const sideEffects = genTrend(31, 6, 27);
const burden = genTrend(18, 5, 27);
const switching = genTrend(9, 3, 27);

const dimConfig = {
  efficacy: { label: "Treatment efficacy", color: TEAL[400], data: efficacy, desc: "Posts discussing whether the treatment is working, symptom improvement, or lack of response" },
  sideEffects: { label: "Side effects / adverse reactions", color: CORAL[400], data: sideEffects, desc: "Posts mentioning adverse reactions, unwanted effects, or tolerability concerns" },
  burden: { label: "Treatment burden", color: AMBER[400], data: burden, desc: "Posts about dosing difficulty, administration burden, cost, or logistical challenges" },
  switching: { label: "Switching / discontinuation", color: PURPLE[400], data: switching, desc: "Posts about stopping therapy, switching to alternatives, or reasons for discontinuation" },
};

const samplePosts = {
  efficacy: [
    { date: "Mar 2026", sentiment: "positive", text: "Been on [Drug A] for 6 months now and honestly my muscle weakness has improved so much. I can actually hold a coffee cup again without shaking. Not perfect but night and day difference." },
    { date: "Mar 2026", sentiment: "negative", text: "Three months in and I see zero improvement. Doctor says give it time but I am exhausted from waiting. The fatigue is exactly the same as before I started treatment." },
    { date: "Feb 2026", sentiment: "positive", text: "Update: swallowing is so much easier now. I was afraid to eat solid food for months. Finally had a normal dinner with my family last week." },
    { date: "Feb 2026", sentiment: "neutral", text: "Had my follow up appointment. Numbers are stable but not really improving either. Doc wants to continue for another 3 months before reassessing." },
    { date: "Feb 2026", sentiment: "negative", text: "Went from barely noticing symptoms to needing the wheelchair again. Not sure if the medication stopped working or if this is just a flare. Feeling defeated." },
    { date: "Jan 2026", sentiment: "positive", text: "Just wanted to share some hope. After the loading doses I am seeing real improvement in my double vision. First time in a year I can read without closing one eye." },
  ],
  sideEffects: [
    { date: "Mar 2026", sentiment: "negative", text: "The headaches from this infusion are brutal. Every single time, 2 days of migraine after. My neuro says its normal but I dread infusion day now." },
    { date: "Mar 2026", sentiment: "negative", text: "Anyone else getting terrible GI issues? I have been on this for 4 weeks and the nausea is constant. Lost 8 pounds because I cant keep food down." },
    { date: "Feb 2026", sentiment: "neutral", text: "Side effects are manageable but definitely present. Some fatigue and mild headache. Taking it at night helps with the drowsiness at least." },
    { date: "Feb 2026", sentiment: "negative", text: "Had to go to the ER last week. Severe allergic reaction during infusion. Face swelled up, hives everywhere. They stopped it immediately. Terrifying experience." },
    { date: "Jan 2026", sentiment: "positive", text: "Good news: the initial nausea went away after week 3. Hang in there if you are in the first few weeks. It does get better for most people." },
  ],
  burden: [
    { date: "Mar 2026", sentiment: "negative", text: "The copay even with insurance is $800/month. I am seriously considering stopping because I cannot afford this long term. Why is there no generic alternative." },
    { date: "Feb 2026", sentiment: "negative", text: "Infusion takes 4 hours every 2 weeks plus 1 hour drive each way. I have basically lost a full work day every other week. My boss is not happy." },
    { date: "Feb 2026", sentiment: "neutral", text: "Just got approved for the patient assistance program. Huge relief. The drug is working but I was about to stop because of cost. If anyone needs help applying DM me." },
    { date: "Jan 2026", sentiment: "negative", text: "The self injection is supposed to be easy but I bruise every single time and the needle anxiety never goes away. My husband has to do it for me now." },
  ],
  switching: [
    { date: "Mar 2026", sentiment: "neutral", text: "Switching from [Drug A] to [Drug B] next month. Not because A wasnt working but insurance stopped covering it. Nervous about starting over." },
    { date: "Feb 2026", sentiment: "negative", text: "Stopped taking it. The side effects were worse than the disease at this point. Going to try the older medication my previous doctor recommended." },
    { date: "Feb 2026", sentiment: "positive", text: "Best decision I made was switching. Was on [Drug A] for a year with minimal improvement. Two months on [Drug B] and I already feel stronger. Wish I had switched sooner." },
  ],
};

function MetricCard({ label, value, sub, color }) {
  return (
    <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "10px 14px", minWidth: 0 }}>
      <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 500, color: color || "var(--color-text-primary)" }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function MiniSparkline({ data, color, w = 80, h = 24 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`).join(" ");
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function TrendChart({ dims, activeKeys, granularity }) {
  const allVals = activeKeys.flatMap(k => dims[k].data);
  const maxVal = Math.max(...allVals);
  const step = granularity === "quarterly" ? 3 : 1;
  const labels = granularity === "quarterly"
    ? ["Q1 24","Q2 24","Q3 24","Q4 24","Q1 25","Q2 25","Q3 25","Q4 25","Q1 26"]
    : months;
  const chartData = {};
  activeKeys.forEach(k => {
    if (granularity === "quarterly") {
      const d = dims[k].data;
      const q = [];
      for (let i = 0; i < d.length; i += 3) {
        const slice = d.slice(i, i + 3);
        q.push(Math.round(slice.reduce((a, b) => a + b, 0) / slice.length));
      }
      chartData[k] = q;
    } else {
      chartData[k] = dims[k].data;
    }
  });
  const numPts = labels.length;
  const chartW = 620;
  const chartH = 180;
  const padL = 36;
  const padR = 10;
  const padT = 10;
  const padB = 28;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;

  const yTicks = [0, Math.round(maxVal / 2), maxVal];

  return (
    <svg width="100%" viewBox={`0 0 ${chartW} ${chartH}`} style={{ display: "block" }}>
      {yTicks.map(v => {
        const y = padT + plotH - (v / maxVal) * plotH;
        return (
          <g key={v}>
            <line x1={padL} y1={y} x2={chartW - padR} y2={y} stroke="var(--color-border-tertiary)" strokeWidth="0.5" />
            <text x={padL - 6} y={y + 3} textAnchor="end" fontSize="9" fill="var(--color-text-tertiary)" fontFamily="var(--font-sans)">{v}</text>
          </g>
        );
      })}
      {labels.map((l, i) => {
        const x = padL + (i / (numPts - 1)) * plotW;
        const show = numPts <= 12 || i % 3 === 0;
        return show ? <text key={i} x={x} y={chartH - 4} textAnchor="middle" fontSize="8" fill="var(--color-text-tertiary)" fontFamily="var(--font-sans)">{l}</text> : null;
      })}
      {activeKeys.map(k => {
        const d = chartData[k];
        const pts = d.map((v, i) => {
          const x = padL + (i / (numPts - 1)) * plotW;
          const y = padT + plotH - (v / maxVal) * plotH;
          return `${x},${y}`;
        }).join(" ");
        return <polyline key={k} points={pts} fill="none" stroke={dims[k].color} strokeWidth="1.5" strokeLinejoin="round" />;
      })}
    </svg>
  );
}

function StackedBar({ dims, activeKeys }) {
  const numPts = months.length;
  const chartW = 620;
  const chartH = 140;
  const padL = 36;
  const padR = 10;
  const padT = 10;
  const padB = 28;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;
  const barW = plotW / numPts * 0.7;

  const totals = months.map((_, i) => activeKeys.reduce((s, k) => s + dims[k].data[i], 0));
  const maxTotal = Math.max(...totals);

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
        const x = padL + (i / numPts) * plotW + (plotW / numPts - barW) / 2;
        const total = totals[i];
        let cumY = 0;
        return (
          <g key={i}>
            {activeKeys.map(k => {
              const pct = total > 0 ? (dims[k].data[i] / total) * 100 : 0;
              const h = (pct / 100) * plotH;
              const y = padT + plotH - cumY - h;
              cumY += h;
              return <rect key={k} x={x} y={y} width={barW} height={h} fill={dims[k].color} rx="1" />;
            })}
            {i % 3 === 0 && <text x={x + barW / 2} y={chartH - 4} textAnchor="middle" fontSize="8" fill="var(--color-text-tertiary)" fontFamily="var(--font-sans)">{m}</text>}
          </g>
        );
      })}
    </svg>
  );
}

function PostCard({ post }) {
  const sentColor = post.sentiment === "positive" ? GREEN : post.sentiment === "negative" ? RED : GRAY;
  return (
    <div style={{ padding: "10px 14px", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", borderLeft: `3px solid ${sentColor[400]}`, marginBottom: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: "var(--border-radius-md)", background: sentColor[50], color: sentColor[800] }}>{post.sentiment}</span>
        <span style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{post.date}</span>
      </div>
      <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{post.text}</div>
    </div>
  );
}

export default function TreatmentDashboard() {
  const [activeKeys, setActiveKeys] = useState(["efficacy", "sideEffects", "burden", "switching"]);
  const [granularity, setGranularity] = useState("monthly");
  const [chartType, setChartType] = useState("trend");
  const [postDim, setPostDim] = useState("efficacy");
  const [postSent, setPostSent] = useState("all");
  const [postPage, setPostPage] = useState(0);

  const toggleKey = (k) => {
    setActiveKeys(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]);
  };

  const totalMentions = Object.values(dimConfig).reduce((s, d) => s + d.data.reduce((a, b) => a + b, 0), 0);
  const recentEfficacy = efficacy.slice(-3).reduce((a, b) => a + b, 0);
  const prevEfficacy = efficacy.slice(-6, -3).reduce((a, b) => a + b, 0);
  const efficacyDelta = Math.round(((recentEfficacy - prevEfficacy) / prevEfficacy) * 100);

  const filteredPosts = (samplePosts[postDim] || []).filter(p => postSent === "all" || p.sentiment === postSent);
  const postsPerPage = 3;
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const visiblePosts = filteredPosts.slice(postPage * postsPerPage, (postPage + 1) * postsPerPage);

  return (
    <div style={{ padding: "16px 0", maxWidth: 680 }}>
      <div style={{ marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Treatment experience tracker</span>
      </div>
      <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 4 }}>How patients experience [Drug A]</div>
      <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 4 }}>r/MyastheniaGravis, HealthUnlocked MG, Bluesky | Jan 2024 - Mar 2026</div>
      <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 16 }}>
        Filtered via CSR (pharmacologic) + assertion model: posts where author reports personal experience with [Drug A]
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 8, marginBottom: 20 }}>
        <MetricCard label="Treatment posts" value={totalMentions.toLocaleString()} sub="Author-asserted" />
        <MetricCard label="Efficacy trend" value={`${efficacyDelta > 0 ? "+" : ""}${efficacyDelta}%`} sub="vs. prior 3 months" color={efficacyDelta > 0 ? GREEN[400] : RED[400]} />
        <MetricCard label="Top side effect" value="Headache" sub="34% of AE mentions" />
        <MetricCard label="Switch mentions" value={switching.slice(-3).reduce((a, b) => a + b, 0)} sub="Last 3 months" />
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {Object.entries(dimConfig).map(([k, v]) => (
          <button key={k} onClick={() => toggleKey(k)} style={{
            fontSize: 11, padding: "4px 10px", borderRadius: "var(--border-radius-md)", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 5,
            background: activeKeys.includes(k) ? "var(--color-background-primary)" : "transparent",
            border: activeKeys.includes(k) ? `0.5px solid ${v.color}` : "0.5px solid var(--color-border-tertiary)",
            color: activeKeys.includes(k) ? "var(--color-text-primary)" : "var(--color-text-tertiary)",
            opacity: activeKeys.includes(k) ? 1 : 0.6,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: v.color, opacity: activeKeys.includes(k) ? 1 : 0.3 }} />
            {v.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ display: "flex", gap: 4 }}>
          {["trend", "stacked"].map(t => (
            <button key={t} onClick={() => setChartType(t)} style={{
              fontSize: 11, padding: "3px 10px", borderRadius: "var(--border-radius-md)", cursor: "pointer",
              background: chartType === t ? "var(--color-background-secondary)" : "transparent",
              border: "0.5px solid var(--color-border-tertiary)",
              color: chartType === t ? "var(--color-text-primary)" : "var(--color-text-tertiary)",
            }}>
              {t === "trend" ? "Trend lines" : "Proportional"}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["monthly", "quarterly"].map(g => (
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

      <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "14px 16px", marginBottom: 20 }}>
        {chartType === "trend"
          ? <TrendChart dims={dimConfig} activeKeys={activeKeys} granularity={granularity} />
          : <StackedBar dims={dimConfig} activeKeys={activeKeys} />
        }
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 6, marginBottom: 24 }}>
        {Object.entries(dimConfig).map(([k, v]) => {
          const total = v.data.reduce((a, b) => a + b, 0);
          return (
            <div key={k} style={{ padding: "8px 10px", borderRadius: "var(--border-radius-md)", border: `0.5px solid var(--color-border-tertiary)` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: "var(--color-text-secondary)", lineHeight: 1.3 }}>{v.label}</span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>{total}</div>
              <MiniSparkline data={v.data} color={v.color} />
            </div>
          );
        })}
      </div>

      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>Patient posts</div>
        <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 10 }}>De-identified text from community members discussing their treatment experience</div>
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
        <div style={{ display: "flex", gap: 4, flex: 1 }}>
          {Object.entries(dimConfig).map(([k, v]) => (
            <button key={k} onClick={() => { setPostDim(k); setPostPage(0); }} style={{
              fontSize: 10, padding: "3px 8px", borderRadius: "var(--border-radius-md)", cursor: "pointer",
              background: postDim === k ? v.color : "transparent",
              border: postDim === k ? `0.5px solid ${v.color}` : "0.5px solid var(--color-border-tertiary)",
              color: postDim === k ? "#fff" : "var(--color-text-tertiary)",
            }}>
              {v.label.split(" / ")[0].split(" (")[0]}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["all", "positive", "negative", "neutral"].map(s => (
            <button key={s} onClick={() => { setPostSent(s); setPostPage(0); }} style={{
              fontSize: 10, padding: "3px 8px", borderRadius: "var(--border-radius-md)", cursor: "pointer",
              background: postSent === s ? "var(--color-background-secondary)" : "transparent",
              border: "0.5px solid var(--color-border-tertiary)",
              color: postSent === s ? "var(--color-text-primary)" : "var(--color-text-tertiary)",
            }}>
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 8 }}>
        {visiblePosts.map((p, i) => <PostCard key={i} post={p} />)}
        {filteredPosts.length === 0 && (
          <div style={{ padding: 20, textAlign: "center", fontSize: 12, color: "var(--color-text-tertiary)" }}>No posts match this filter combination</div>
        )}
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
        <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>How this works</div>
        <div style={{ fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
          Posts are filtered to author-asserted treatment experience using the CSR model (pharmacologic entity extraction) combined with the assertion model (confirming the author is personally taking the medication, not discussing someone else's experience or a hypothetical). Treatment dimensions are classified by the sentiment model and domain-specific keyword taxonomy. Side effect mentions are cross-referenced with CSR symptom spans for clinical specificity.
        </div>
        <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: "var(--border-radius-md)", background: TEAL[50], color: TEAL[800] }}>CSR: pharmacologic spans</span>
          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: "var(--border-radius-md)", background: CORAL[50], color: CORAL[800] }}>Assertion: author-experienced</span>
          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: "var(--border-radius-md)", background: PURPLE[50], color: PURPLE[800] }}>Sentiment: pos/neg/neutral</span>
          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: "var(--border-radius-md)", background: BLUE[50], color: BLUE[800] }}>CSR: symptom spans (AE detection)</span>
        </div>
      </div>
    </div>
  );
}