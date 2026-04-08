import StatCard from "../StatCard";
import "./Dashboard.css";

const recentActivity = [
  { type: "enrollment", text: "New student enrolled: Maria Garcia", time: "2m ago", color: "var(--success)" },
  { type: "grade", text: "Grades submitted for CS101", time: "15m ago", color: "var(--gold)" },
  { type: "attendance", text: "Attendance marked for Grade 10-A", time: "1h ago", color: "var(--info)" },
  { type: "user", text: "New teacher account created: Dr. Lee", time: "3h ago", color: "#b06aff" },
  { type: "report", text: "Monthly report generated", time: "5h ago", color: "var(--text-muted)" },
];

const topCourses = [
  { name: "Computer Science 101", students: 42, avg: 85 },
  { name: "Mathematics Advanced", students: 38, avg: 78 },
  { name: "Physics II", students: 35, avg: 72 },
  { name: "English Literature", students: 44, avg: 88 },
  { name: "Biology Fundamentals", students: 29, avg: 81 },
];

export default function AdminDashboard() {
  return (
    <div className="dash-content">
      <div className="dash-welcome">
        <h2>System Overview</h2>
        <p>All systems operational • Last sync: just now</p>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Students" value="1,248" icon="🎓" color="var(--gold)" trend={5} sub="Across all departments" />
        <StatCard title="Faculty Members" value="86" icon="👨‍🏫" color="var(--info)" trend={2} sub="Active this semester" />
        <StatCard title="Active Courses" value="124" icon="📚" color="var(--success)" trend={8} sub="Spring 2025" />
        <StatCard title="Avg Attendance" value="91%" icon="✓" color="#b06aff" trend={-1} sub="This month" />
      </div>

      <div className="dash-row">
        <div className="dash-panel">
          <h3 className="panel-title">Recent Activity</h3>
          <div className="activity-list">
            {recentActivity.map((a, i) => (
              <div key={i} className="activity-item">
                <span className="activity-dot" style={{ background: a.color }} />
                <div className="activity-text">{a.text}</div>
                <span className="activity-time">{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-panel">
          <h3 className="panel-title">Top Courses</h3>
          <div className="courses-list">
            {topCourses.map((c, i) => (
              <div key={i} className="course-item">
                <div className="course-info">
                  <span className="course-name">{c.name}</span>
                  <span className="course-students">{c.students} students</span>
                </div>
                <div className="course-bar-wrap">
                  <div className="course-bar">
                    <div className="course-fill" style={{ width: `${c.avg}%`, background: `hsl(${c.avg * 1.2}, 70%, 55%)` }} />
                  </div>
                  <span className="course-avg">{c.avg}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
