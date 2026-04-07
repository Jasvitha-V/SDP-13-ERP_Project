import StatCard from "../StatCard";
import "./Dashboard.css";

const myGrades = [
  { subject: "Computer Science", score: 88, grade: "A" },
  { subject: "Mathematics", score: 75, grade: "B" },
  { subject: "Physics", score: 92, grade: "A+" },
  { subject: "English", score: 81, grade: "B+" },
  { subject: "Chemistry", score: 68, grade: "C+" },
];

const upcoming = [
  { day: "15", mon: "Apr", title: "CS101 Midterm", sub: "Room A-201, 9:00 AM", type: "Exam", color: "var(--danger)" },
  { day: "18", mon: "Apr", title: "Math Assignment 4", sub: "Online submission", type: "Assignment", color: "var(--gold)" },
  { day: "22", mon: "Apr", title: "Physics Lab Report", sub: "Lab B-102", type: "Lab", color: "var(--info)" },
];

export default function StudentDashboard({ user }) {
  const gpa = (myGrades.reduce((s, g) => s + g.score, 0) / myGrades.length / 10).toFixed(1);

  return (
    <div className="dash-content">
      <div className="dash-welcome">
        <h2>Hello, {user.name.split(" ")[0]}! 🌟</h2>
        <p>Spring Semester 2025 • Week 14 of 18</p>
      </div>

      <div className="stats-grid">
        <StatCard title="Current GPA" value={gpa} icon="🎓" color="var(--gold)" trend={5} sub="This semester" />
        <StatCard title="Attendance" value="94%" icon="✓" color="var(--success)" trend={2} sub="Last 30 days" />
        <StatCard title="Enrolled Courses" value="5" icon="📚" color="var(--info)" sub="Spring 2025" />
        <StatCard title="Pending Tasks" value="3" icon="📋" color="var(--danger)" sub="Due this week" />
      </div>

      <div className="dash-row">
        <div className="dash-panel">
          <h3 className="panel-title">My Grades</h3>
          <div className="grades-overview">
            {myGrades.map((g, i) => (
              <div key={i} className="grade-row">
                <span className="grade-subject">{g.subject}</span>
                <span className="grade-score" style={{ color: g.score >= 85 ? "var(--success)" : g.score >= 70 ? "var(--gold)" : "var(--danger)" }}>
                  {g.grade}
                </span>
                <div className="grade-bar">
                  <div className="grade-fill" style={{
                    width: `${g.score}%`,
                    background: g.score >= 85 ? "var(--success)" : g.score >= 70 ? "var(--gold)" : "var(--danger)"
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-panel">
          <h3 className="panel-title">Upcoming Events</h3>
          <div className="upcoming-list">
            {upcoming.map((u, i) => (
              <div key={i} className="upcoming-item">
                <div className="upcoming-date">
                  <span className="up-day">{u.day}</span>
                  <span className="up-mon">{u.mon}</span>
                </div>
                <div className="upcoming-info">
                  <div className="up-title">{u.title}</div>
                  <div className="up-sub">{u.sub}</div>
                </div>
                <span className="up-badge" style={{ background: `color-mix(in srgb, ${u.color} 15%, transparent)`, color: u.color }}>{u.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
