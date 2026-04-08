import { getRoleDisplayName } from "../utils/roleUtils";
import "./Sidebar.css";

const ROLE_MENUS = {
  Admin: [
    { id: "dashboard", icon: "⊞", label: "Dashboard" },
    { id: "students", icon: "👤", label: "Students" },
    { id: "attendance", icon: "✓", label: "Attendance" },
    { id: "grades", icon: "◈", label: "Grades" },
    { id: "schedule", icon: "◷", label: "Schedule" },
    { id: "users", icon: "⚙", label: "User Management" },
    { id: "reports", icon: "▤", label: "Reports" },
  ],
  Teacher: [
    { id: "dashboard", icon: "⊞", label: "Dashboard" },
    { id: "students", icon: "👤", label: "My Students" },
    { id: "attendance", icon: "✓", label: "Attendance" },
    { id: "grades", icon: "◈", label: "Grades" },
    { id: "schedule", icon: "◷", label: "Schedule" },
  ],
  Student: [
    { id: "dashboard", icon: "⊞", label: "Dashboard" },
    { id: "grades", icon: "◈", label: "My Grades" },
    { id: "attendance", icon: "✓", label: "My Attendance" },
    { id: "schedule", icon: "◷", label: "Timetable" },
  ],
  Administrator: [
    { id: "dashboard", icon: "⊞", label: "Dashboard" },
    { id: "students", icon: "👤", label: "Students" },
    { id: "users", icon: "⚙", label: "User Management" },
    { id: "reports", icon: "▤", label: "Reports" },
    { id: "schedule", icon: "◷", label: "Schedule" },
  ],
};

const ROLE_COLORS = {
  Admin: "#c9a84c",
  Teacher: "#4a9eff",
  Student: "#2ecc8a",
  Administrator: "#b06aff",
};

export default function Sidebar({ user, active, setActive, onLogout }) {
  // Normalize role name for lookup
  const normalizedRole = getRoleDisplayName(user.role);
  const menu = ROLE_MENUS[normalizedRole] || [];
  const roleColor = ROLE_COLORS[normalizedRole] || "#c9a84c";
  const initials = user.name.split(" ").map(n => n[0]).join("").slice(0, 2);

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="s-brand-icon">
          <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
            <rect width="12" height="12" rx="2" fill="var(--gold)" />
            <rect x="16" width="12" height="12" rx="2" fill="var(--gold)" opacity="0.6" />
            <rect y="16" width="12" height="12" rx="2" fill="var(--gold)" opacity="0.6" />
            <rect x="16" y="16" width="12" height="12" rx="2" fill="var(--gold)" opacity="0.3" />
          </svg>
        </div>
        <span className="s-brand-name">EduERP</span>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar" style={{ background: `${roleColor}22`, borderColor: `${roleColor}44` }}>
          <span style={{ color: roleColor }}>{initials}</span>
        </div>
        <div className="user-info">
          <span className="user-name">{user.name}</span>
          <span className="user-role" style={{ color: roleColor }}>{normalizedRole}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-section-label">Navigation</p>
        {menu.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${active === item.id ? "active" : ""}`}
            onClick={() => setActive(item.id)}
            style={active === item.id ? { "--role-color": roleColor } : {}}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {active === item.id && <span className="nav-active-dot" style={{ background: roleColor }} />}
          </button>
        ))}
      </nav>

      <button className="sidebar-logout" onClick={onLogout}>
        <span>⎋</span> Sign Out
      </button>
    </aside>
  );
}
