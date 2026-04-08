import StatCard from "../StatCard";
import "./Dashboard.css";

const todayClasses = [
  { time: "08:00 AM", name: "Computer Science 101", room: "Lab A-201", students: 32, status: "Ongoing", color: "var(--success)" },
  { time: "10:30 AM", name: "Advanced Algorithms", room: "Room B-104", students: 24, status: "Upcoming", color: "var(--info)" },
  { time: "01:00 PM", name: "Web Development", room: "Lab A-203", students: 28, status: "Upcoming", color: "var(--info)" },
  { time: "03:30 PM", name: "Database Systems", room: "Room C-302", students: 30, status: "Upcoming", color: "var(--info)" },
];

const recentAssignments = [
  { name: "CS101 - Midterm Exam", due: "Apr 15", submitted: 28, total: 32 },
  { name: "Algo - Assignment 3", due: "Apr 18", submitted: 20, total: 24 },
  { name: "Web Dev - Project 2", due: "Apr 22", submitted: 15, total: 28 },
];

export default function TeacherDashboard({ user }) {
  return (
    <div className="dash-content">
      <div className="dash-welcome">
        <h2>Good morning, {user.name.split(" ")[0]} 👋</h2>
        <p>You have 4 classes today. Keep up the great work!</p>
      </div>

      <div className="stats-grid">
        <StatCard title="My Students" value="114" icon="🎓" color="var(--info)" trend={3} />
        <StatCard title="Classes Today" value="4" icon="📖" color="var(--gold)" sub="Next at 10:30 AM" />
        <StatCard title="Pending Grades" value="23" icon="📝" color="var(--danger)" sub="Need attention" />
        <StatCard title="Avg Class Score" value="82%" icon="⭐" color="var(--success)" trend={4} />
      </div>

      <div className="dash-row">
        <div className="dash-panel">
          <h3 className="panel-title">Today's Classes</h3>
          <div className="today-classes">
            {todayClasses.map((c, i) => (
              <div key={i} className="class-row">
                <span className="class-time">{c.time}</span>
                <div className="class-info">
                  <div className="class-name">{c.name}</div>
                  <div className="class-room">{c.room} • {c.students} students</div>
                </div>
                <span className="class-badge" style={{ background: `color-mix(in srgb, ${c.color} 15%, transparent)`, color: c.color }}>{c.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-panel">
          <h3 className="panel-title">Assignment Submissions</h3>
          <div className="courses-list">
            {recentAssignments.map((a, i) => (
              <div key={i} className="course-item">
                <div className="course-info">
                  <span className="course-name">{a.name}</span>
                  <span className="course-students">Due {a.due}</span>
                </div>
                <div className="course-bar-wrap">
                  <div className="course-bar">
                    <div className="course-fill" style={{ width: `${(a.submitted / a.total) * 100}%`, background: "var(--info)" }} />
                  </div>
                  <span className="course-avg">{a.submitted}/{a.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
