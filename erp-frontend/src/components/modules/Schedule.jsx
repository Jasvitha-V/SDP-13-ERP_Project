import { useState, useEffect } from "react";
import { schedulesApi } from "../../services/api";
import "./Module.css";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

const CLASS_COLORS = [
  { bg: "rgba(74,158,255,0.15)",  border: "rgba(74,158,255,0.4)",  text: "#4a9eff" },
  { bg: "rgba(46,204,138,0.15)",  border: "rgba(46,204,138,0.4)",  text: "#2ecc8a" },
  { bg: "rgba(201,168,76,0.15)",  border: "rgba(201,168,76,0.4)",  text: "#c9a84c" },
  { bg: "rgba(176,106,255,0.15)", border: "rgba(176,106,255,0.4)", text: "#b06aff" },
  { bg: "rgba(231,76,94,0.15)",   border: "rgba(231,76,94,0.4)",   text: "#e74c5e" },
];

export default function Schedule({ role }) {
  const [view, setView] = useState("week");
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ day: "Monday", startTime: "08:00", subject: "", room: "", className: "" });

  const canEdit = role === "Admin" || role === "Teacher";

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const data = await schedulesApi.getAll();
      // Map backend entity fields to frontend expected fields
      const mappedData = data.map(s => ({
        id: s.id,
        day: s.dayOfWeek,
        startTime: s.startTime,
        subject: s.courseName,
        room: s.roomNumber,
        className: s.gradeClass,
        teacher: s.teacherName
      }));
      setSchedules(mappedData);
      setError("");
    } catch (err) {
      // If API call fails, just use empty array
      setSchedules([]);
      setError(`Failed to load schedules: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Map schedules to grid format
  // Expected format: { day: "Monday", startTime: "08:00", subject, room, className }
  const mapScheduleToGrid = () => {
    const grid = Array.from({ length: 5 }, () => Array(9).fill(null));
    const skipCells = new Set();
    const dayMap = { "Monday": 0, "Tuesday": 1, "Wednesday": 2, "Thursday": 3, "Friday": 4 };
    const timeMap = TIME_SLOTS.reduce((acc, t, i) => ({ ...acc, [t]: i }), {});

    schedules.forEach((s, idx) => {
      const dayIdx = dayMap[s.day];
      const timeIdx = timeMap[s.startTime];
      if (dayIdx !== undefined && timeIdx !== undefined) {
        const span = 1; // Default span
        grid[dayIdx][timeIdx] = { 
          name: s.subject || s.className, 
          room: s.room || "—", 
          ci: idx % 5, 
          span,
          id: s.id 
        };
        for (let s = 1; s < span; s++) {
          skipCells.add(`${dayIdx}-${timeIdx + s}`);
        }
      }
    });
    return { grid, skipCells };
  };

  const { grid, skipCells } = mapScheduleToGrid();

  const handleSave = async () => {
    if (!form.subject || !form.room) {
      setError("Subject and room are required");
      return;
    }
    try {
      setLoading(true);
      const timeIdx = TIME_SLOTS.indexOf(form.startTime);
      const endTime = timeIdx !== -1 && timeIdx < TIME_SLOTS.length - 1 
        ? TIME_SLOTS[timeIdx + 1] 
        : "17:00";

      // Map frontend fields back to backend entity fields
      const payload = { 
        dayOfWeek: form.day, 
        startTime: form.startTime, 
        endTime: endTime,
        courseName: form.subject, 
        roomNumber: form.room, 
        gradeClass: form.className || "",
        teacherName: form.teacher || "TBD",
        semester: "Spring 2025"
      };

      if (form.id) {
        await schedulesApi.update(form.id, payload);
        setSchedules(prev => prev.map(s => s.id === form.id ? { ...s, ...form } : s));
        setSuccess("Schedule updated successfully");
      } else {
        const result = await schedulesApi.create(payload);
        // Map back to frontend fields for the new item
        const newSchedule = {
          id: result.id,
          day: result.dayOfWeek,
          startTime: result.startTime,
          subject: result.courseName,
          room: result.roomNumber,
          className: result.gradeClass,
          teacher: result.teacherName
        };
        setSchedules(prev => [...prev, newSchedule]);
        setSuccess("Schedule created successfully");
      }
      setShowModal(false);
      setForm({ day: "Monday", startTime: "08:00", subject: "", room: "", className: "" });
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(`Save failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this schedule?")) {
      try {
        await schedulesApi.delete(id);
        setSchedules(prev => prev.filter(s => s.id !== id));
        setSuccess("Schedule deleted successfully");
        setTimeout(() => setSuccess(""), 2000);
      } catch (err) {
        setError(`Delete failed: ${err.message}`);
      }
    }
  };

  return (
    <div className="module-wrap">
      {error && <div style={{ padding: "12px 16px", background: "rgba(231,76,94,0.15)", border: "1px solid var(--danger)", color: "var(--danger)", borderRadius: 8, marginBottom: 16 }}>{error}</div>}
      {success && <div style={{ padding: "12px 16px", background: "rgba(46,204,138,0.15)", border: "1px solid var(--success)", color: "var(--success)", borderRadius: 8, marginBottom: 16 }}>{success}</div>}
      
      <div className="module-header">
        <div>
          <h2 className="module-title">Schedule</h2>
          <p className="module-sub">Spring Semester 2025 — Weekly Timetable • {schedules.length} classes</p>
        </div>
        <div className="module-actions">
          <div style={{ display: "flex", gap: 6, background: "var(--navy-light)", border: "1px solid rgba(201,168,76,0.12)", borderRadius: 10, padding: 4 }}>
            {["week", "list"].map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                background: view === v ? "rgba(201,168,76,0.15)" : "transparent",
                border: "none", color: view === v ? "var(--gold)" : "var(--text-muted)",
                borderRadius: 7, padding: "6px 14px", fontSize: 13, fontWeight: view === v ? 600 : 400,
                transition: "all 0.2s"
              }}>
                {v === "week" ? "Week View" : "List View"}
              </button>
            ))}
          </div>
          {canEdit && <button className="btn-primary" onClick={() => { setForm({ day: "Monday", startTime: "08:00", subject: "", room: "", className: "" }); setShowModal(true); }} disabled={loading}>+ Add Class</button>}
        </div>
      </div>

      {view === "week" ? (
        <div style={{ overflowX: "auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "70px repeat(5, 1fr)",
            gap: 2,
            minWidth: 700,
            background: "var(--navy-light)",
            border: "1px solid rgba(201,168,76,0.1)",
            borderRadius: 16,
            overflow: "hidden",
          }}>
            {/* Header row */}
            <div style={{ padding: "12px 8px", background: "rgba(10,22,40,0.5)" }} />
            {DAYS.map(d => (
              <div key={d} style={{
                padding: "12px 8px", textAlign: "center", fontWeight: 700,
                fontSize: 12, color: "var(--gold)", textTransform: "uppercase",
                letterSpacing: "0.5px", background: "rgba(10,22,40,0.5)",
                borderBottom: "1px solid rgba(201,168,76,0.1)"
              }}>{d}</div>
            ))}

            {/* Time rows */}
            {TIME_SLOTS.map((time, ti) => (
              <>
                <div key={`t-${ti}`} style={{
                  padding: "0 8px", display: "flex", alignItems: "flex-start",
                  justifyContent: "center", paddingTop: 10,
                  fontSize: 11, color: "var(--text-muted)", fontWeight: 600,
                  background: ti % 2 === 0 ? "rgba(10,22,40,0.2)" : "transparent",
                  height: 56
                }}>{time}</div>
                {DAYS.map((_, di) => {
                  const key = `${di}-${ti}`;
                  if (skipCells.has(key)) return null;
                  const cell = grid[di][ti];
                  const c = cell ? CLASS_COLORS[cell.ci] : null;
                  return (
                    <div key={key} style={{
                      height: cell ? (cell.span * 56 + (cell.span - 1) * 2) : 56,
                      gridRow: cell && cell.span > 1 ? `span ${cell.span}` : undefined,
                      background: ti % 2 === 0 ? "rgba(10,22,40,0.2)" : "transparent",
                      padding: 4,
                    }}>
                      {cell && (
                        <div style={{
                          height: "100%", background: c.bg, border: `1px solid ${c.border}`,
                          borderRadius: 8, padding: "6px 8px", display: "flex",
                          flexDirection: "column", justifyContent: "center", cursor: canEdit ? "pointer" : "default"
                        }}
                          onClick={() => canEdit && setShowModal(true) && setForm(cell)}
                        >
                          <div style={{ fontSize: 12, fontWeight: 700, color: c.text }}>{cell.name}</div>
                          <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>{cell.room}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {DAYS.map((day) => {
            const dayClasses = schedules
              .filter(s => s.day === day)
              .sort((a, b) => TIME_SLOTS.indexOf(a.startTime) - TIME_SLOTS.indexOf(b.startTime));
            return (
              <div key={day} style={{ background: "var(--navy-light)", border: "1px solid rgba(201,168,76,0.1)", borderRadius: 14, overflow: "hidden" }}>
                <div style={{ padding: "12px 18px", borderBottom: "1px solid rgba(201,168,76,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--gold)" }}>{day}</span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{dayClasses.length} classes</span>
                </div>
                {dayClasses.length > 0 ? dayClasses.map((s, idx) => {
                  const c = CLASS_COLORS[idx % 5];
                  const timeIdx = TIME_SLOTS.indexOf(s.startTime);
                  const endTime = timeIdx < TIME_SLOTS.length - 1 ? TIME_SLOTS[timeIdx + 1] : "17:00";
                  return (
                    <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 18px", borderBottom: idx < dayClasses.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
                      <div style={{ width: 60, fontSize: 12, color: "var(--gold)", fontWeight: 600 }}>{s.startTime}</div>
                      <div style={{ width: 4, alignSelf: "stretch", background: c.border, borderRadius: 2, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--cream)" }}>{s.subject || s.className}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{s.room}</div>
                      </div>
                      <span style={{ fontSize: 11, background: c.bg, color: c.text, padding: "3px 10px", borderRadius: 20, fontWeight: 600 }}>
                        {s.startTime}–{endTime}
                      </span>
                      {canEdit && (
                        <div className="action-btns">
                          <button className="btn-edit" onClick={() => { setForm(s); setShowModal(true); }} disabled={loading}>Edit</button>
                          <button className="btn-del" onClick={() => handleDelete(s.id)} disabled={loading}>Del</button>
                        </div>
                      )}
                    </div>
                  );
                }) : (
                  <div style={{ padding: "12px 18px", color: "var(--text-muted)", fontSize: 12 }}>No classes scheduled</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{form.id ? "Edit Class" : "Add Class"}</h3>
            <div className="form-grid">
              <div className="field"><label>Day</label>
                <select value={form.day} onChange={e => setForm(p => ({ ...p, day: e.target.value }))}>
                  {DAYS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="field"><label>Start Time</label>
                <select value={form.startTime} onChange={e => setForm(p => ({ ...p, startTime: e.target.value }))}>
                  {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="field"><label>Subject</label>
                <input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="e.g. Computer Science" />
              </div>
              <div className="field"><label>Room/Lab</label>
                <input value={form.room} onChange={e => setForm(p => ({ ...p, room: e.target.value }))} placeholder="e.g. Lab A-201" />
              </div>
              <div className="field" style={{ gridColumn: "1 / -1" }}><label>Class Name (Optional)</label>
                <input value={form.className} onChange={e => setForm(p => ({ ...p, className: e.target.value }))} placeholder="e.g. CS 101" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save Class"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
