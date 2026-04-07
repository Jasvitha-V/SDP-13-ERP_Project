import { useState, useEffect } from "react";
import { studentsApi } from "../../services/api";
import "./Module.css";

const EMPTY = { name: "", email: "", gradeClass: "10-A", gpa: "", attendance: "", status: "ACTIVE" };

export default function Students({ role }) {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const canEdit = role === "ADMIN" || role === "ADMINISTRATOR";

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentsApi.getAll();
      setStudents(data);
      setError("");
    } catch (err) {
      setError(`Failed to load students: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.gradeClass.includes(search)
  );

  const openAdd = () => { setForm(EMPTY); setEditing(null); setShowModal(true); setError(""); };
  const openEdit = (s) => { setForm({ ...s }); setEditing(s.id); setShowModal(true); setError(""); };

  const handleSave = async () => {
    if (!form.name || !form.email) { setError("Name and email are required"); return; }
    try {
      setLoading(true);
      setError("");
      const payload = { name: form.name, email: form.email, gradeClass: form.gradeClass, gpa: parseFloat(form.gpa) || 0, attendance: parseInt(form.attendance) || 0, status: form.status };
      if (editing) {
        await studentsApi.update(editing, payload);
        setStudents(prev => prev.map(s => s.id === editing ? { ...s, ...payload } : s));
        setSuccess("Student updated successfully");
      } else {
        const newStudent = await studentsApi.create(payload);
        setStudents(prev => [...prev, newStudent]);
        setSuccess("Student created successfully");
      }
      setShowModal(false);
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(`Save failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this student?")) {
      try {
        await studentsApi.delete(id);
        setStudents(prev => prev.filter(s => s.id !== id));
        setSuccess("Student deleted successfully");
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
          <h2 className="module-title">Students</h2>
          <p className="module-sub">{filtered.length} records found</p>
        </div>
        <div className="module-actions">
          <input className="search-input" placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} />
          {canEdit && <button className="btn-primary" onClick={openAdd} disabled={loading}>+ Add Student</button>}
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Grade</th>
              <th>GPA</th>
              <th>Attendance</th>
              <th>Status</th>
              {canEdit && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td>
                  <div className="td-student">
                    <div className="td-avatar">{s.name.split(" ").map(n=>n[0]).join("")}</div>
                    <div>
                      <div className="td-name">{s.name}</div>
                      <div className="td-email">{s.email}</div>
                    </div>
                  </div>
                </td>
                <td><span className="grade-chip">{s.gradeClass}</span></td>
                <td><span style={{ color: s.gpa >= 3.5 ? "var(--success)" : s.gpa >= 3.0 ? "var(--gold)" : "var(--danger)", fontWeight: 600 }}>{s.gpa}</span></td>
                <td>
                  <div className="att-cell">
                    <span style={{ color: s.attendance >= 90 ? "var(--success)" : s.attendance >= 80 ? "var(--gold)" : "var(--danger)" }}>{s.attendance}%</span>
                    <div className="mini-bar"><div style={{ width: `${s.attendance}%`, background: s.attendance >= 90 ? "var(--success)" : s.attendance >= 80 ? "var(--gold)" : "var(--danger)" }} /></div>
                  </div>
                </td>
                <td>
                  <span className={`status-chip ${s.status === "ACTIVE" ? "active" : "warning"}`}>{s.status}</span>
                </td>
                {canEdit && (
                  <td>
                    <div className="action-btns">
                      <button className="btn-edit" onClick={() => openEdit(s)} disabled={loading}>Edit</button>
                      <button className="btn-del" onClick={() => handleDelete(s.id)} disabled={loading}>Del</button>
                    </div>
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
            <h3>{editing ? "Edit Student" : "Add Student"}</h3>
            <div className="form-grid">
              <div className="field"><label>Full Name</label><input value={form.name} onChange={e => setForm(p=>({...p, name: e.target.value}))} placeholder="Full name" disabled={loading} /></div>
              <div className="field"><label>Email</label><input value={form.email} onChange={e => setForm(p=>({...p, email: e.target.value}))} placeholder="email@student.edu" disabled={loading} /></div>
              <div className="field"><label>Grade/Class</label>
                <select value={form.gradeClass} onChange={e => setForm(p=>({...p, gradeClass: e.target.value}))} disabled={loading}>
                  {["10-A","10-B","11-A","11-B","12-A","12-B"].map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div className="field"><label>Status</label>
                <select value={form.status} onChange={e => setForm(p=>({...p, status: e.target.value}))} disabled={loading}>
                  <option>ACTIVE</option><option>INACTIVE</option>
                </select>
              </div>
              <div className="field"><label>GPA</label><input type="number" step="0.1" min="0" max="4" value={form.gpa} onChange={e => setForm(p=>({...p, gpa: e.target.value}))} disabled={loading} /></div>
              <div className="field"><label>Attendance %</label><input type="number" min="0" max="100" value={form.attendance} onChange={e => setForm(p=>({...p, attendance: e.target.value}))} disabled={loading} /></div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)} disabled={loading}>Cancel</button>
              <button className="btn-primary" onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
