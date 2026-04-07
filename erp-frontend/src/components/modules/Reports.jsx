import { useState } from "react";
import "./Module.css";

const REPORTS = [
  { id: 1, icon: "📊", name: "Enrollment Report", desc: "Monthly breakdown of student enrollments, departures, and net growth across all departments.", lastGenerated: "Apr 1, 2025", category: "Academic" },
  { id: 2, icon: "📈", name: "Academic Performance", desc: "Grade distributions, GPA trends, and subject-wise performance analysis for all classes.", lastGenerated: "Mar 31, 2025", category: "Academic" },
  { id: 3, icon: "✓", name: "Attendance Summary", desc: "Daily, weekly and monthly attendance rates per class with absenteeism trend analysis.", lastGenerated: "Apr 3, 2025", category: "Attendance" },
  { id: 4, icon: "👥", name: "Faculty Report", desc: "Teacher performance, class load distribution, and subject coverage summary.", lastGenerated: "Mar 28, 2025", category: "HR" },
  { id: 5, icon: "💰", name: "Budget Utilization", desc: "Departmental budget allocation vs actual spending with variance analysis for Q1 2025.", lastGenerated: "Mar 31, 2025", category: "Finance" },
  { id: 6, icon: "🏛️", name: "Infrastructure Audit", desc: "Facilities usage, maintenance status, and room utilization rates across all buildings.", lastGenerated: "—", category: "Operations" },
  { id: 7, icon: "🎓", name: "Graduation Forecast", desc: "Projected graduation rates based on current GPA and credit completion for seniors.", lastGenerated: "Mar 15, 2025", category: "Academic" },
  { id: 8, icon: "⚠️", name: "At-Risk Students", desc: "Students flagged for low attendance or poor academic performance requiring intervention.", lastGenerated: "Apr 2, 2025", category: "Academic" },
];

const CATEGORY_COLORS = {
  Academic: { bg: "rgba(74,158,255,0.12)", color: "#4a9eff" },
  Attendance: { bg: "rgba(46,204,138,0.12)", color: "#2ecc8a" },
  HR: { bg: "rgba(201,168,76,0.12)", color: "#c9a84c" },
  Finance: { bg: "rgba(176,106,255,0.12)", color: "#b06aff" },
  Operations: { bg: "rgba(231,76,94,0.12)", color: "#e74c5e" },
};

// Simple bar chart data
const ENROLLMENT_DATA = [
  { month: "Oct", val: 1180 },
  { month: "Nov", val: 1195 },
  { month: "Dec", val: 1190 },
  { month: "Jan", val: 1210 },
  { month: "Feb", val: 1225 },
  { month: "Mar", val: 1238 },
  { month: "Apr", val: 1248 },
];

export default function Reports() {
  const [filterCat, setFilterCat] = useState("All");
  const [generating, setGenerating] = useState(null);
  const [generated, setGenerated] = useState(new Set());

  const categories = ["All", ...new Set(REPORTS.map(r => r.category))];
  const filtered = REPORTS.filter(r => filterCat === "All" || r.category === filterCat);
  const maxVal = Math.max(...ENROLLMENT_DATA.map(d => d.val));

  const handleGenerate = (id) => {
    setGenerating(id);
    setTimeout(() => {
      setGenerating(null);
      setGenerated(prev => new Set([...prev, id]));
    }, 1500);
  };

  return (
    <div className="module-wrap">
      <div className="module-header">
        <div>
          <h2 className="module-title">Reports</h2>
          <p className="module-sub">Generate and download institutional reports</p>
        </div>
        <div className="module-actions">
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilterCat(cat)} style={{
                background: filterCat === cat ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${filterCat === cat ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.08)"}`,
                color: filterCat === cat ? "var(--gold)" : "var(--text-muted)",
                borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 500,
                transition: "all 0.2s"
              }}>{cat}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Enrollment trend chart */}
      <div style={{ background: "var(--navy-light)", border: "1px solid rgba(201,168,76,0.1)", borderRadius: 16, padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, color: "var(--cream)" }}>Enrollment Trend</h3>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Last 7 months</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 100 }}>
          {ENROLLMENT_DATA.map((d, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{d.val}</span>
              <div style={{
                width: "100%", height: `${(d.val / maxVal) * 80}px`,
                background: i === ENROLLMENT_DATA.length - 1
                  ? "linear-gradient(180deg, var(--gold), var(--gold-light))"
                  : "rgba(201,168,76,0.25)",
                borderRadius: "4px 4px 0 0",
                transition: "height 0.5s",
                minHeight: 8,
              }} />
              <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Report cards */}
      <div className="report-cards">
        {filtered.map(r => {
          const cc = CATEGORY_COLORS[r.category];
          const isGenerating = generating === r.id;
          const isDone = generated.has(r.id);
          return (
            <div key={r.id} className="report-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div className="report-icon">{r.icon}</div>
                <span style={{ background: cc.bg, color: cc.color, fontSize: 10, padding: "3px 8px", borderRadius: 20, fontWeight: 600 }}>
                  {r.category}
                </span>
              </div>
              <div className="report-name">{r.name}</div>
              <div className="report-desc">{r.desc}</div>
              <div className="report-footer">
                <span className="report-date">
                  {isDone ? "✓ Generated just now" : r.lastGenerated !== "—" ? `Last: ${r.lastGenerated}` : "Not yet generated"}
                </span>
                <button
                  className="report-btn"
                  onClick={() => handleGenerate(r.id)}
                  disabled={isGenerating}
                  style={{ opacity: isGenerating ? 0.7 : 1 }}
                >
                  {isGenerating ? "Generating…" : isDone ? "Download" : "Generate"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
