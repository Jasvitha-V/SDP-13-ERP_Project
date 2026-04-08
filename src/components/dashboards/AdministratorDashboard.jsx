import StatCard from "../StatCard";
import "./Dashboard.css";

const deptStats = [
  { name: "Science", students: 320, budget: 85000, utilization: 78 },
  { name: "Arts", students: 280, budget: 62000, utilization: 65 },
  { name: "Commerce", students: 350, budget: 70000, utilization: 82 },
  { name: "Engineering", students: 298, budget: 95000, utilization: 91 },
];

const recentReports = [
  { title: "Monthly Enrollment Report", date: "Apr 1", status: "Ready", color: "var(--success)" },
  { title: "Faculty Performance Review", date: "Mar 28", status: "Pending", color: "var(--gold)" },
  { title: "Budget Utilization Q1", date: "Mar 31", status: "Ready", color: "var(--success)" },
  { title: "Infrastructure Audit", date: "Apr 5", status: "Scheduled", color: "var(--info)" },
];

export default function AdministratorDashboard() {
  return (
    <div className="dash-content">
      <div className="dash-welcome">
        <h2>Institutional Overview</h2>
        <p>Managing operations across 4 departments • Spring 2025</p>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Enrollment" value="1,248" icon="🎓" color="var(--gold)" trend={7} />
        <StatCard title="Annual Budget" value="$312K" icon="💰" color="var(--success)" sub="78% utilized" />
        <StatCard title="Staff Count" value="124" icon="👥" color="var(--info)" trend={3} />
        <StatCard title="Facilities" value="18" icon="🏛️" color="#b06aff" sub="All operational" />
      </div>

      <div className="dash-row">
        <div className="dash-panel">
          <h3 className="panel-title">Department Overview</h3>
          <div className="courses-list">
            {deptStats.map((d, i) => (
              <div key={i} className="course-item">
                <div className="course-info">
                  <span className="course-name">{d.name} Dept.</span>
                  <span className="course-students">{d.students} students</span>
                </div>
                <div className="course-bar-wrap">
                  <div className="course-bar">
                    <div className="course-fill" style={{ width: `${d.utilization}%`, background: d.utilization > 80 ? "var(--success)" : "var(--gold)" }} />
                  </div>
                  <span className="course-avg">{d.utilization}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-panel">
          <h3 className="panel-title">Recent Reports</h3>
          <div className="activity-list">
            {recentReports.map((r, i) => (
              <div key={i} className="activity-item">
                <span className="activity-dot" style={{ background: r.color }} />
                <div className="activity-text">{r.title}</div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px" }}>
                  <span className="activity-time">{r.date}</span>
                  <span style={{ fontSize: "10px", color: r.color, fontWeight: 600 }}>{r.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
