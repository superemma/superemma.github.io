import { useState, useMemo } from "react";

const T = {
  bg: "#FAFAF8", surface: "#FFFFFF", surfaceAlt: "#F5F4F0",
  border: "#E8E6DF", text: "#1A1A18", textMid: "#5C5B56", textDim: "#9C9A92",
  accent: "#1D6B4F", accentLight: "#E6F2EC", accentText: "#14513C",
  warm: "#C4512A", warmLight: "#FDF0EB", warmText: "#943D1F",
  blue: "#2D6A9F", blueLight: "#EBF3FA", blueText: "#1E4F78",
  purple: "#6B5CA5", purpleLight: "#F0EDF8", purpleText: "#4E4380",
  red: "#B83232", redLight: "#FDF0F0", redText: "#8A2020",
  amber: "#946B0B", amberLight: "#FEF7E6", amberText: "#6B4D08",
  gray: "#6B6B66", grayLight: "#F0EFEB", grayText: "#4A4A46",
  sans: "'DM Sans', 'Helvetica Neue', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
  serif: "'Newsreader', 'Georgia', serif",
};

const SOURCES = ["r/narcolepsy", "narcolepsyforum.org"];
const TOTAL_DOCS = 12847;
const DATE_RANGE = "Jan 2022 - Dec 2024";
const COMMUNITY = "Narcolepsy";

const CATEGORIES = ["research", "news", "support", "pharma", "government", "other"];

const CAT_STYLE = {
  research:   { bg: T.blueLight,   color: T.blueText,   label: "Research / journal" },
  news:       { bg: T.purpleLight, color: T.purpleText,  label: "News" },
  support:    { bg: T.accentLight, color: T.accentText,  label: "Support / advocacy" },
  pharma:     { bg: T.amberLight,  color: T.amberText,   label: "Pharma / commercial" },
  government: { bg: T.grayLight,   color: T.grayText,    label: "Government" },
  other:      { bg: T.surfaceAlt,  color: T.textDim,     label: "Other" },
};

const DOMAINS = [
  { domain: "pubmed.ncbi.nlm.nih.gov", category: "research", shares: 342, docs: 187, patients: 248, caregivers: 94, risky: false },
  { domain: "mayoclinic.org", category: "support", shares: 289, docs: 156, patients: 201, caregivers: 88, risky: false },
  { domain: "narcolepsynetwork.org", category: "support", shares: 264, docs: 142, patients: 194, caregivers: 70, risky: false },
  { domain: "webmd.com", category: "news", shares: 231, docs: 128, patients: 178, caregivers: 53, risky: false },
  { domain: "nih.gov", category: "government", shares: 198, docs: 112, patients: 152, caregivers: 46, risky: false },
  { domain: "sleepfoundation.org", category: "support", shares: 187, docs: 98, patients: 139, caregivers: 48, risky: false },
  { domain: "fda.gov", category: "government", shares: 156, docs: 87, patients: 112, caregivers: 44, risky: false },
  { domain: "nature.com", category: "research", shares: 143, docs: 76, patients: 108, caregivers: 35, risky: false },
  { domain: "jazzpharma.com", category: "pharma", shares: 134, docs: 71, patients: 98, caregivers: 36, risky: false },
  { domain: "healthline.com", category: "news", shares: 128, docs: 69, patients: 94, caregivers: 34, risky: false },
  { domain: "clinicaltrials.gov", category: "government", shares: 112, docs: 62, patients: 78, caregivers: 34, risky: false },
  { domain: "nejm.org", category: "research", shares: 98, docs: 54, patients: 74, caregivers: 24, risky: false },
  { domain: "morethantired.com", category: "pharma", shares: 87, docs: 46, patients: 62, caregivers: 25, risky: false },
  { domain: "wakeupnarcolepsy.org", category: "support", shares: 82, docs: 44, patients: 58, caregivers: 24, risky: false },
  { domain: "medscape.com", category: "news", shares: 76, docs: 41, patients: 56, caregivers: 20, risky: false },
  { domain: "rxlist.com", category: "other", shares: 64, docs: 35, patients: 48, caregivers: 16, risky: false },
  { domain: "naturalsleepcures.xyz", category: "other", shares: 47, docs: 28, patients: 38, caregivers: 9, risky: true },
  { domain: "miracle-wake-supplement.co", category: "other", shares: 34, docs: 22, patients: 28, caregivers: 6, risky: true },
  { domain: "cheapmeds-online.ru", category: "other", shares: 18, docs: 12, patients: 14, caregivers: 4, risky: true },
];

const URLS = [
  { url: "https://pubmed.ncbi.nlm.nih.gov/35284721/", title: "Sodium oxybate for narcolepsy: systematic review", domain: "pubmed.ncbi.nlm.nih.gov", category: "research", shares: 89, patients: 64, caregivers: 25, risky: false },
  { url: "https://www.mayoclinic.org/diseases-conditions/narcolepsy/symptoms-causes/syc-20375497", title: "Narcolepsy - Symptoms and causes", domain: "mayoclinic.org", category: "support", shares: 78, patients: 54, caregivers: 24, risky: false },
  { url: "https://narcolepsynetwork.org/about-narcolepsy/living-with-narcolepsy/", title: "Living with narcolepsy: practical tips", domain: "narcolepsynetwork.org", category: "support", shares: 72, patients: 56, caregivers: 16, risky: false },
  { url: "https://www.fda.gov/drugs/drug-approvals-and-databases/drug-approvals-2023", title: "FDA drug approvals 2023", domain: "fda.gov", category: "government", shares: 65, patients: 48, caregivers: 17, risky: false },
  { url: "https://www.webmd.com/sleep-disorders/narcolepsy/narcolepsy-treatments", title: "Narcolepsy treatments: what works", domain: "webmd.com", category: "news", shares: 61, patients: 47, caregivers: 14, risky: false },
  { url: "https://www.sleepfoundation.org/narcolepsy/treatment", title: "Narcolepsy treatment options", domain: "sleepfoundation.org", category: "support", shares: 58, patients: 42, caregivers: 16, risky: false },
  { url: "https://www.nature.com/articles/s41591-023-02680-2", title: "Orexin receptor agonist trial results", domain: "nature.com", category: "research", shares: 54, patients: 41, caregivers: 13, risky: false },
  { url: "https://pubmed.ncbi.nlm.nih.gov/36891204/", title: "Patient-reported outcomes in narcolepsy type 1", domain: "pubmed.ncbi.nlm.nih.gov", category: "research", shares: 51, patients: 38, caregivers: 13, risky: false },
  { url: "https://www.jazzpharma.com/medicines/xywav/", title: "Xywav prescribing information", domain: "jazzpharma.com", category: "pharma", shares: 48, patients: 36, caregivers: 12, risky: false },
  { url: "https://www.nih.gov/narcolepsy-fact-sheet", title: "Narcolepsy fact sheet", domain: "nih.gov", category: "government", shares: 46, patients: 34, caregivers: 12, risky: false },
  { url: "https://clinicaltrials.gov/ct2/show/NCT05163041", title: "Phase 3 trial: TAK-861 for narcolepsy", domain: "clinicaltrials.gov", category: "government", shares: 44, patients: 32, caregivers: 12, risky: false },
  { url: "https://www.healthline.com/health/narcolepsy/coping-strategies", title: "Coping strategies for narcolepsy", domain: "healthline.com", category: "news", shares: 42, patients: 31, caregivers: 11, risky: false },
  { url: "https://morethantired.com/understanding-eds/", title: "Understanding excessive daytime sleepiness", domain: "morethantired.com", category: "pharma", shares: 38, patients: 28, caregivers: 10, risky: false },
  { url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2301949", title: "Orexin agonist phase 2 results", domain: "nejm.org", category: "research", shares: 36, patients: 28, caregivers: 8, risky: false },
  { url: "https://wakeupnarcolepsy.org/resources/disability-benefits/", title: "Disability benefits guide for narcolepsy", domain: "wakeupnarcolepsy.org", category: "support", shares: 34, patients: 26, caregivers: 8, risky: false },
  { url: "https://naturalsleepcures.xyz/narcolepsy-herbal-fix", title: "Natural narcolepsy cure - herbal supplement", domain: "naturalsleepcures.xyz", category: "other", shares: 28, patients: 22, caregivers: 6, risky: true },
  { url: "https://miracle-wake-supplement.co/buy-now", title: "Miracle wakefulness pill - order today", domain: "miracle-wake-supplement.co", category: "other", shares: 19, patients: 16, caregivers: 3, risky: true },
  { url: "https://cheapmeds-online.ru/modafinil-no-rx", title: "Buy modafinil without prescription", domain: "cheapmeds-online.ru", category: "other", shares: 14, patients: 12, caregivers: 2, risky: true },
];

const EXCLUDED_STATS = {
  redditSelf: 1247,
  shorteners: 318,
  unrecognized: 89,
};

const fmt = (n) => n.toLocaleString();

function CatBadge({ category }) {
  const s = CAT_STYLE[category] || CAT_STYLE.other;
  return (
    <span style={{
      display: "inline-block", padding: "2px 8px", borderRadius: 4,
      fontSize: 10, fontWeight: 600, fontFamily: T.sans,
      background: s.bg, color: s.color, whiteSpace: "nowrap",
    }}>{s.label}</span>
  );
}

function RiskyBadge() {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600,
      fontFamily: T.sans, background: T.redLight, color: T.redText,
    }}>
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
        <path d="M6 1L11 10H1L6 1Z" fill={T.red} opacity="0.7"/>
        <text x="6" y="9" textAnchor="middle" fontSize="7" fill="white" fontWeight="700">!</text>
      </svg>
      risky
    </span>
  );
}

function ShareBar({ patients, caregivers }) {
  const total = patients + caregivers;
  if (!total) return null;
  const pPct = Math.round((patients / total) * 100);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <div style={{ display: "flex", height: 8, borderRadius: 3, overflow: "hidden", width: 80 }}>
        <div style={{ flex: patients, background: T.blue, opacity: 0.55 }} />
        <div style={{ flex: caregivers, background: T.purple, opacity: 0.55 }} />
      </div>
      <div style={{ fontSize: 9, color: T.textDim, fontFamily: T.sans }}>
        {pPct}% pat / {100 - pPct}% cg
      </div>
    </div>
  );
}

function Chip({ label, active, onClick, color, bg }) {
  return (
    <button onClick={onClick} style={{
      padding: "4px 12px", borderRadius: 5, fontSize: 11, fontFamily: T.sans,
      fontWeight: active ? 600 : 400, cursor: "pointer", transition: "all .15s",
      border: `1px solid ${active ? (color || T.accent) : T.border}`,
      background: active ? (bg || T.accentLight) : "transparent",
      color: active ? (color || T.accentText) : T.textDim,
    }}>{label}</button>
  );
}

export default function ResourcesReport() {
  const [domainCatFilter, setDomainCatFilter] = useState("all");
  const [urlCatFilter, setUrlCatFilter] = useState("all");
  const [urlSearch, setUrlSearch] = useState("");
  const [urlDomainFilter, setUrlDomainFilter] = useState("all");

  const filteredDomains = useMemo(() =>
    DOMAINS.filter(d => domainCatFilter === "all" || d.category === domainCatFilter)
      .sort((a, b) => b.shares - a.shares),
    [domainCatFilter]
  );

  const filteredUrls = useMemo(() =>
    URLS.filter(u => {
      if (urlCatFilter !== "all" && u.category !== urlCatFilter) return false;
      if (urlDomainFilter !== "all" && u.domain !== urlDomainFilter) return false;
      if (urlSearch) {
        const q = urlSearch.toLowerCase();
        if (!u.url.toLowerCase().includes(q) && !u.title.toLowerCase().includes(q) && !u.domain.toLowerCase().includes(q)) return false;
      }
      return true;
    }).sort((a, b) => b.shares - a.shares),
    [urlCatFilter, urlDomainFilter, urlSearch]
  );

  const totalExcluded = EXCLUDED_STATS.redditSelf + EXCLUDED_STATS.shorteners + EXCLUDED_STATS.unrecognized;
  const riskyCount = URLS.filter(u => u.risky).length;

  const thStyle = {
    textAlign: "left", padding: "10px 12px", color: T.textDim,
    fontWeight: 600, fontSize: 10, textTransform: "uppercase",
    letterSpacing: ".5px", borderBottom: `1px solid ${T.border}`,
    fontFamily: T.sans, position: "sticky", top: 0, background: T.surface,
  };

  const tdStyle = { padding: "10px 12px", fontSize: 12, fontFamily: T.sans, verticalAlign: "middle" };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.sans, color: T.text }}>
      {/* HEADER */}
      <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "24px 32px 20px" }}>
        {/* Row 1: sources + doc count */}
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
        {/* Row 2: title */}
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 500, fontFamily: T.serif, lineHeight: 1.3 }}>
          What informational resources are being shared in the <span style={{ color: "#1D6B4F", fontWeight: 700 }}>{COMMUNITY.toLowerCase()}</span> community?
        </h1>
        {/* Row 3: category filter */}
        <div style={{ display: "flex", gap: 20, marginTop: 18, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: T.textDim, letterSpacing: ".5px", textTransform: "uppercase" }}>Category</span>
            <select value={domainCatFilter} onChange={e => setDomainCatFilter(e.target.value)} style={{
              padding: "5px 10px", borderRadius: 6, border: `1px solid ${T.border}`,
              fontSize: 12, fontFamily: T.sans, color: T.text, background: T.surfaceAlt,
              cursor: "pointer", outline: "none",
            }}>
              <option value="all">All categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{CAT_STYLE[c]?.label || c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div style={{ padding: "24px 32px 48px", maxWidth: 960, margin: "0 auto" }}>

        {/* ── TABLE 1: DOMAINS ──────────────────── */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 600 }}>Top domains</h2>
          <p style={{ margin: "0 0 14px", fontSize: 12, color: T.textDim }}>
            Domains aggregated across all shared URLs, sorted by total share count
          </p>

          <div style={{ display: "flex", gap: 4, marginBottom: 14, flexWrap: "wrap" }}>
            <Chip label="All categories" active={domainCatFilter === "all"} onClick={() => setDomainCatFilter("all")} />
            {CATEGORIES.map(c => {
              const s = CAT_STYLE[c];
              return <Chip key={c} label={s.label} active={domainCatFilter === c} onClick={() => setDomainCatFilter(c)} color={s.color} bg={s.bg} />;
            })}
          </div>

          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Domain</th>
                  <th style={thStyle}>Category</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Total shares</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Unique docs</th>
                  <th style={thStyle}>Patient / caregiver</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredDomains.map((d, i) => (
                  <tr key={d.domain} style={{ borderBottom: i < filteredDomains.length - 1 ? `1px solid ${T.border}22` : "none" }}>
                    <td style={{ ...tdStyle, fontWeight: 500 }}>
                      {d.risky ? (
                        <span style={{ color: T.textDim, textDecoration: "line-through", opacity: 0.6 }}>{d.domain}</span>
                      ) : (
                        <span>{d.domain}</span>
                      )}
                    </td>
                    <td style={tdStyle}><CatBadge category={d.category} /></td>
                    <td style={{ ...tdStyle, textAlign: "right", fontFamily: T.mono, fontWeight: 600 }}>{fmt(d.shares)}</td>
                    <td style={{ ...tdStyle, textAlign: "right", fontFamily: T.mono, color: T.textMid }}>{fmt(d.docs)}</td>
                    <td style={tdStyle}><ShareBar patients={d.patients} caregivers={d.caregivers} /></td>
                    <td style={tdStyle}>{d.risky && <RiskyBadge />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredDomains.length === 0 && (
              <div style={{ padding: 24, textAlign: "center", color: T.textDim, fontSize: 13 }}>No domains match the selected filter</div>
            )}
          </div>
        </div>

        {/* ── TABLE 2: URLS ────────────────────── */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 600 }}>Top URLs</h2>
          <p style={{ margin: "0 0 14px", fontSize: 12, color: T.textDim }}>
            Individual URLs sorted by share count. Risky URLs are flagged and not clickable.
          </p>

          <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Search URLs, titles, or domains..."
              value={urlSearch}
              onChange={e => setUrlSearch(e.target.value)}
              style={{
                padding: "6px 12px", borderRadius: 6, border: `1px solid ${T.border}`,
                fontSize: 12, fontFamily: T.sans, color: T.text, background: T.surfaceAlt,
                outline: "none", minWidth: 220,
              }}
            />
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              <Chip label="All categories" active={urlCatFilter === "all"} onClick={() => setUrlCatFilter("all")} />
              {CATEGORIES.map(c => {
                const s = CAT_STYLE[c];
                return <Chip key={c} label={s.label} active={urlCatFilter === c} onClick={() => setUrlCatFilter(c)} color={s.color} bg={s.bg} />;
              })}
            </div>
            <select
              value={urlDomainFilter}
              onChange={e => setUrlDomainFilter(e.target.value)}
              style={{
                padding: "5px 10px", borderRadius: 6, border: `1px solid ${T.border}`,
                fontSize: 12, fontFamily: T.sans, color: T.text, background: T.surfaceAlt,
                cursor: "pointer", outline: "none",
              }}
            >
              <option value="all">All domains</option>
              {[...new Set(URLS.map(u => u.domain))].sort().map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, width: "38%" }}>URL / Title</th>
                  <th style={{ ...thStyle, width: "14%" }}>Domain</th>
                  <th style={{ ...thStyle, width: "12%" }}>Category</th>
                  <th style={{ ...thStyle, width: "9%", textAlign: "right" }}>Shares</th>
                  <th style={{ ...thStyle, width: "15%" }}>Pat / Cg</th>
                  <th style={{ ...thStyle, width: "8%" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredUrls.map((u, i) => (
                  <tr key={i} style={{ borderBottom: i < filteredUrls.length - 1 ? `1px solid ${T.border}22` : "none" }}>
                    <td style={{ ...tdStyle, overflow: "hidden" }}>
                      <div style={{ fontWeight: 500, marginBottom: 2, fontSize: 12 }}>{u.title}</div>
                      {u.risky ? (
                        <div style={{
                          fontSize: 10, color: T.textDim, opacity: 0.5,
                          textDecoration: "line-through",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          fontFamily: T.mono,
                        }} title={u.url}>
                          {u.url}
                        </div>
                      ) : (
                        <a href={u.url} target="_blank" rel="noopener noreferrer" style={{
                          fontSize: 10, color: T.blue, textDecoration: "none",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          display: "block", fontFamily: T.mono,
                        }} title={u.url}>
                          {u.url}
                        </a>
                      )}
                    </td>
                    <td style={{ ...tdStyle, fontSize: 11, color: T.textMid }}>{u.domain}</td>
                    <td style={tdStyle}><CatBadge category={u.category} /></td>
                    <td style={{ ...tdStyle, textAlign: "right", fontFamily: T.mono, fontWeight: 600 }}>{fmt(u.shares)}</td>
                    <td style={tdStyle}><ShareBar patients={u.patients} caregivers={u.caregivers} /></td>
                    <td style={tdStyle}>{u.risky && <RiskyBadge />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUrls.length === 0 && (
              <div style={{ padding: 24, textAlign: "center", color: T.textDim, fontSize: 13 }}>No URLs match the current filters</div>
            )}
          </div>
        </div>

        {/* LEGEND */}
        <div style={{
          display: "flex", gap: 16, flexWrap: "wrap", padding: "14px 20px",
          background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10,
          fontSize: 11, color: T.textDim, alignItems: "center",
        }}>
          <span style={{ fontWeight: 600, color: T.textMid }}>Categories:</span>
          {CATEGORIES.map(c => {
            const s = CAT_STYLE[c];
            return (
              <span key={c} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color, opacity: 0.5, display: "inline-block" }} />
                {s.label}
              </span>
            );
          })}
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: T.red, opacity: 0.5, display: "inline-block" }} />
            Risky (unclickable)
          </span>
        </div>
      </div>
    </div>
  );
}
