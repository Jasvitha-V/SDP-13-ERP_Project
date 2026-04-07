import { useState, useEffect } from "react";
import { attendanceApi, studentsApi } from "../../services/api";
import "./Module.css";

const CLASSES = ["Computer Science 101 - Grade 10A", "Mathematics Advanced - 11B", "Physics II - 11A", "English Literature - 10B"];

export default function Attendance({ role }) {
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(CLASSES[0]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check if role can mark attendance (Admin or Teacher)
  const canMark = role === "Admin" || role === "Teacher";

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentsApi.getAll();
      setStudents(data);
      // Initialize attendance with default "Present" status
      const initialAttendance = {};
      data.forEach(s => { initialAttendance[s.id] = "PRESENT"; });
      setAttendance(initialAttendance);
      setError("");
    } catch (err) {
      setError(`Failed to load students: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const setStatus = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    if (!selectedDate) { setError("Please select a date"); return; }
    if (!canMark) { setError("You don't have permission to mark attendance"); return; }
    
    try {
      setLoading(true);
      setError("");
      
      const records = students.map(s => ({
        studentId: s.id,
        courseName: selectedClass,
        date: selectedDate,
        status: attendance[s.id] || "PRESENT",
      }));

      await attendanceApi.bulkMark(records);
      setSuccess("Attendance saved successfully");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(`Save failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const counts = {
    PRESENT: Object.values(attendance).filter(v => v === "PRESENT").length,
    ABSENT:  Object.values(attendance).filter(v => v === "ABSENT").length,
    LATE:    Object.values(attendance).filter(v => v === "LATE").length,
  };

  const pct = students.length ? Math.round((counts.PRESENT / students.length) * 100) : 0;

  const STATUS_COLORS = {
    PRESENT: { bg: "rgba(46,204,138,0.15)", color: "var(--success)", btn: "#2ecc8a" },
    ABSENT:  { bg: "rgba(231,76,94,0.15)",  color: "var(--danger)",  btn: "#e74c5e" },
    LATE:    { bg: "rgba(201,168,76,0.15)", color: "var(--gold)",    btn: "#c9a84c" },
  };

  return (
    <div className="module-wrap">
      {error && <div style={{ padding: "12px 16px", background: "rgba(231,76,94,0.15)", border: "1px solid var(--danger)", color: "var(--danger)", borderRadius: 8, marginBottom: 16 }}>{error}</div>}
      {success && <div style={{ padding: "12px 16px", background: "rgba(46,204,138,0.15)", border: "1px solid var(--success)", color: "var(--success)", borderRadius: 8, marginBottom: 16 }}>{success}</div>}
      
      <div className="module-header">
        <div>
          <h2 className="module-title">Attendance</h2>
          <p className="module-sub">Mark and track daily attendance</p>
        </div>
        <div className="module-actions">
          <select
            className="search-input"
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            style={{ width: "240px" }}
          >
            {CLASSES.map(c => <option key={c}>{c}</option>)}
          </select>
          <input
            type="date"
            className="search-input"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            style={{ width: "150px" }}
          />
          {canMark && (
            <button className="btn-primary" onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Attendance"}
            </button>
          )}
        </div>
      </div>

      {/* Summary row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
        {[
          { label: "Total Students", val: students.length, color: "var(--info)" },
          { label: "Present", val: counts.PRESENT, color: "var(--success)" },
          { label: "Absent",  val: counts.ABSENT,  color: "var(--danger)" },
          { label: "Late",    val: counts.LATE,    color: "var(--gold)" },
        ].map(s => (
          <div key={s.label} style={{
            background: "var(--navy-light)", border: "1px solid rgba(201,168,76,0.1)",
            borderRadius: 14, padding: "16px 18px", position: "relative", overflow: "hidden"
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: s.color }} />
            <div style={{ fontSize: 26, fontFamily: "'Playfair Display',serif", color: s.color, lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div style={{ background: "var(--navy-light)", border: "1px solid rgba(201,168,76,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: "var(--text-light)" }}>Attendance Rate</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: pct >= 90 ? "var(--success)" : pct >= 75 ? "var(--gold)" : "var(--danger)" }}>{pct}%</span>
        </div>
        <div style={{ height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", borderRadius: 4, background: pct >= 90 ? "var(--success)" : pct >= 75 ? "var(--gold)" : "var(--danger)", transition: "width 0.5s" }} />
        </div>
      </div>

      {/* Student grid */}
      <div className="att-grid">
        {students.map(student => {
          const status = attendance[student.id] || "PRESENT";
          const sc = STATUS_COLORS[status];
          return (
            <div key={student.id} className={`att-card ${status.toLowerCase()}`}>
              <div className="att-card-name">{student.name}</div>
              <div style={{ fontSize: 11, marginBottom: 8, color: sc.color, fontWeight: 600 }}>{status}</div>
              {canMark && (
                <div className="att-btns">
                  {["PRESENT", "ABSENT", "LATE"].map(s => (
                    <button
                      key={s}
                      className={`att-btn ${status === s ? "active" : ""}`}
                      style={{
                        background: STATUS_COLORS[s].bg,
                        color: STATUS_COLORS[s].color,
                      }}
                      onClick={() => setStatus(student.id, s)}
                      disabled={loading}
                    >
                      {s[0]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
