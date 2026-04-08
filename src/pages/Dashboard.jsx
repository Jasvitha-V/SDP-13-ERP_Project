import { useState } from "react";
import { getRoleDisplayName } from "../utils/roleUtils";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import AdminDashboard from "../components/dashboards/AdminDashboard";
import TeacherDashboard from "../components/dashboards/TeacherDashboard";
import StudentDashboard from "../components/dashboards/StudentDashboard";
import AdministratorDashboard from "../components/dashboards/AdministratorDashboard";
import Students from "../components/modules/Students";
import Attendance from "../components/modules/Attendance";
import Grades from "../components/modules/Grades";
import Schedule from "../components/modules/Schedule";
import Users from "../components/modules/Users";
import Reports from "../components/modules/Reports";
import "./Dashboard.css";

const ROLE_HOME = {
  Admin: "dashboard",
  Teacher: "dashboard",
  Student: "dashboard",
  Administrator: "dashboard",
};

export default function Dashboard({ user, onLogout }) {
  // Normalize role name for consistency
  const normalizedRole = getRoleDisplayName(user.role);
  const [active, setActive] = useState(ROLE_HOME[normalizedRole] || "dashboard");

  const renderContent = () => {
    if (active === "dashboard") {
      if (normalizedRole === "Admin") return <AdminDashboard />;
      if (normalizedRole === "Teacher") return <TeacherDashboard user={user} />;
      if (normalizedRole === "Student") return <StudentDashboard user={user} />;
      if (normalizedRole === "Administrator") return <AdministratorDashboard />;
    }
    if (active === "students") return <Students role={normalizedRole} />;
    if (active === "attendance") return <Attendance role={normalizedRole} />;
    if (active === "grades") return <Grades role={normalizedRole} />;
    if (active === "schedule") return <Schedule role={normalizedRole} />;
    if (active === "users") return <Users />;
    if (active === "reports") return <Reports />;
    return <div style={{ padding: 32, color: "var(--text-muted)" }}>Coming soon...</div>;
  };

  return (
    <div className="dashboard-wrap">
      <Sidebar user={user} active={active} setActive={setActive} onLogout={onLogout} />
      <div className="main-area">
        <TopBar user={user} active={active} />
        <div className="content-area">{renderContent()}</div>
      </div>
    </div>
  );
}
