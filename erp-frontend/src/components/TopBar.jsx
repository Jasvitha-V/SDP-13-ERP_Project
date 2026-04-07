import { useTheme } from "../context/ThemeContext";
import { getRoleDisplayName } from "../utils/roleUtils";
import "./TopBar.css";

const PAGE_TITLES = {
  dashboard: "Dashboard",
  students: "Students",
  attendance: "Attendance",
  grades: "Grades",
  schedule: "Schedule",
  users: "User Management",
  reports: "Reports",
};

export default function TopBar({ user, active }) {
  const { isDark, toggleTheme } = useTheme();
  const normalizedRole = getRoleDisplayName(user.role);
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="topbar">
      <div className="topbar-left">
        <h2 className="page-title">{PAGE_TITLES[active] || active}</h2>
        <span className="topbar-date">{dateStr}</span>
      </div>
      <div className="topbar-right">
        <div className="topbar-badge">
          <span className="badge-dot" />
          <span>{normalizedRole} Portal</span>
        </div>
        <button 
          className="topbar-theme-toggle" 
          onClick={toggleTheme}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
        <div className="topbar-notif">
          <span>🔔</span>
          <span className="notif-count">3</span>
        </div>
      </div>
    </div>
  );
}
