import { useState, useEffect } from "react";
import { gradesApi, studentsApi } from "../../services/api";
import "./Module.css";

const letterGrade = (score) => {
  if (score >= 95) return "A+";
  if (score >= 90) return "A";
  if (score >= 85) return "B+";
  if (score >= 80) return "B";
  if (score >= 75) return "C+";
  if (score >= 70) return "C";
  if (score >= 65) return "D";
  return "F";
};

const gradeColor = (g) => {
  if (g.startsWith("A")) return "var(--success)";
  if (g.startsWith("B")) return "var(--info)";
  if (g.startsWith("C")) return "var(--gold)";
  return "var(--danger)";
};

export default function Grades({ role }) {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check if user can edit grades (Admin or Teacher)
  const canEdit = role === "Admin" || role === "Teacher";
  const subjects = ["All", "Computer Science", "Mathematics", "Physics", "English", "Chemistry", "History"];

  useEffect(() => { 
    fetchGrades();
    fetchStudents();
  }, []);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const data = await gradesApi.getAll();
      setGrades(data);
      setError("");
    } catch (err) {
      setError(`Failed to load grades: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await studentsApi.getAll();
      setStudents(data);
    } catch (err) {
      console.error("Failed to load students:", err);
    }
  };

  const filtered = grades.filter(g => {
    const matchSearch = g.student?.toLowerCase().includes(search.toLowerCase());
    const matchSubject = filterSubject === "All" || g.subject === filterSubject;
    return matchSearch && matchSubject;
  });

  const openEdit = (g) => {
    setForm({ ...g });
    setEditing(g.id);
    setShowModal(true);
    setError("");
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this grade record?")) {
      try {
        await gradesApi.delete(id);
        setGrades(prev => prev.filter(g => g.id !== id));
        setSuccess("Grade deleted successfully");
        setTimeout(() => setSuccess(""), 2000);
      } catch (err) {
        setError(`Delete failed: ${err.message}`);
      }
    }
  };

  const handleSave = async () => {
    if (!form.midtermScore || !form.finalScore || !form.assignmentScore) { 
      setError("All score fields are required");
      return;
    }
    if (!canEdit) {
      setError("You don't have permission to edit grades");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      
      const total = Math.round((parseFloat(form.midtermScore) + parseFloat(form.finalScore) + parseFloat(form.assignmentScore)) / 3);
      
      const payload = {
        studentId: form.studentId,
        subject: form.subject,
        midtermScore: parseFloat(form.midtermScore),
        finalScore: parseFloat(form.finalScore),
        assignmentScore: parseFloat(form.assignmentScore),
        totalScore: total,
        grade: letterGrade(total),
      };
      
      if (editing) {
        await gradesApi.update(editing, payload);
        setGrades(prev => prev.map(g => g.id === editing ? { ...g, ...payload } : g));
        setSuccess("Grade updated successfully");
      } else {
        const result = await gradesApi.createOrUpdate(payload);
        setGrades(prev => [...prev, result]);
        setSuccess("Grade created successfully");
      }
      
      setShowModal(false);
      setForm({});
      setEditing(null);
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(`Save failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const avg = filtered.length ? Math.round(filtered.reduce((s, g) => s + g.total, 0) / filtered.length) : 0;

  return (
    <div className="module-wrap">
      {error && <div style={{ padding: "12px 16px", background: "rgba(231,76,94,0.15)", border: "1px solid var(--danger)", color: "var(--danger)", borderRadius: 8, marginBottom: 16 }}>{error}</div>}
      {success && <div style={{ padding: "12px 16px", background: "rgba(46,204,138,0.15)", border: "1px solid var(--success)", color: "var(--success)", borderRadius: 8, marginBottom: 16 }}>{success}</div>}
      
      <div className="module-header">
        <div>
          <h2 className="module-title">Grades</h2>
          <p className="module-sub">Class average: {avg}% • {filtered.length} records</p>
        </div>
        <div className="module-actions">
          <input className="search-input" placeholder="Search student..." value={search} onChange={e => setSearch(e.target.value)} />
          <select className="search-input" value={filterSubject} onChange={e => setFilterSubject(e.target.value)} style={{ width: 180 }}>
            {subjects.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Grade distribution */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
        {["A+/A", "B+/B", "C+/C", "D", "F"].map((label, i) => {
          const counts = [
            filtered.filter(g => g.grade.startsWith("A")).length,
            filtered.filter(g => g.grade.startsWith("B")).length,
            filtered.filter(g => g.grade.startsWith("C")).length,
            filtered.filter(g => g.grade === "D").length,
            filtered.filter(g => g.grade === "F").length,
          ];
          const colors = ["var(--success)", "var(--info)", "var(--gold)", "var(--danger)", "#ff4444"];
          return (
            <div key={label} style={{ background: "var(--navy-light)", border: "1px solid rgba(201,168,76,0.1)", borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 24, fontFamily: "'Playfair Display',serif", color: colors[i] }}>{counts[i]}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{label}</div>
            </div>
          );
        })}
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Subject</th>
              <th>Midterm (35%)</th>
              <th>Final (45%)</th>
              <th>Assignment (20%)</th>
              <th>Total</th>
              <th>Grade</th>
              {canEdit && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map(g => (
              <tr key={g.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="td-avatar">{g.student?.split(" ").map(n => n[0]).join("") || "?"}</div>
                    <span style={{ color: "var(--cream)", fontWeight: 500 }}>{g.student}</span>
                  </div>
                </td>
                <td><span className="grade-chip">{g.subject}</span></td>
                <td>{g.midtermScore}</td>
                <td>{g.finalScore}</td>
                <td>{g.assignmentScore}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 50, height: 5, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${g.totalScore}%`, height: "100%", background: gradeColor(g.grade), borderRadius: 3 }} />
                    </div>
                    <span style={{ fontWeight: 600, color: "var(--cream)" }}>{g.totalScore}%</span>
                  </div>
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: gradeColor(g.grade), fontSize: 14 }}>{g.grade}</span>
                </td>
                {canEdit && (
                  <td>
                    <button className="btn-edit" onClick={() => openEdit(g)} disabled={loading}>Edit</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Edit Grades — {form.student}</h3>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>{form.subject}</p>
            <div className="form-grid">
              <div className="field">
                <label>Midterm Score (35%)</label>
                <input type="number" min="0" max="100" value={form.midtermScore || ""}
                  onChange={e => setForm(p => ({ ...p, midtermScore: +e.target.value }))} disabled={loading} />
              </div>
              <div className="field">
                <label>Final Score (45%)</label>
                <input type="number" min="0" max="100" value={form.finalScore || ""}
                  onChange={e => setForm(p => ({ ...p, finalScore: +e.target.value }))} disabled={loading} />
              </div>
              <div className="field">
                <label>Assignment Score (20%)</label>
                <input type="number" min="0" max="100" value={form.assignmentScore || ""}
                  onChange={e => setForm(p => ({ ...p, assignmentScore: +e.target.value }))} disabled={loading} />
              </div>
              <div className="field">
                <label>Calculated Total</label>
                <div style={{ padding: "10px 12px", background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 8, fontSize: 14, fontWeight: 700, color: "var(--gold)" }}>
                  {Math.round(((form.midtermScore || 0) + (form.finalScore || 0) + (form.assignmentScore || 0)) / 3)}% — {letterGrade(Math.round(((form.midtermScore || 0) + (form.finalScore || 0) + (form.assignmentScore || 0)) / 3))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)} disabled={loading}>Cancel</button>
              <button className="btn-primary" onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save Grades"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
