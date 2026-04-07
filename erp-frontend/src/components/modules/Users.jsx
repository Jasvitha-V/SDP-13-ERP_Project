import { useState, useEffect } from "react";
import { usersApi } from "../../services/api";
import { toUppercaseRole } from "../../utils/roleUtils";
import "./Module.css";

const ROLE_COLORS = {
  ADMIN: { bg: "rgba(201,168,76,0.12)", color: "#c9a84c" },
  TEACHER: { bg: "rgba(74,158,255,0.12)", color: "#4a9eff" },
  STUDENT: { bg: "rgba(46,204,138,0.12)", color: "#2ecc8a" },
  ADMINISTRATOR: { bg: "rgba(176,106,255,0.12)", color: "#b06aff" },
};

const EMPTY = { name: "", email: "", password: "", role: "Teacher", department: "", status: "ACTIVE" };

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await usersApi.getAll();
      setUsers(data);
      setError("");
    } catch (err) {
      setError(`Failed to load users: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "All" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const openAdd = () => { setForm(EMPTY); setEditing(null); setShowModal(true); setError(""); };
  const openEdit = (u) => { setForm({ ...u, password: "" }); setEditing(u.id); setShowModal(true); setError(""); };

  const handleDelete = async (id) => {
    if (confirm("Remove this user?")) {
      try {
        await usersApi.delete(id);
        setUsers(prev => prev.filter(u => u.id !== id));
        setSuccess("User deleted successfully");
        setTimeout(() => setSuccess(""), 2000);
      } catch (err) {
        setError(`Delete failed: ${err.message}`);
      }
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.email) { setError("Name and email are required"); return; }
    if (!editing && !form.password) { setError("Password is required for new users"); return; }

    try {
      setLoading(true);
      setError("");
      const payload = { 
        name: form.name, 
        email: form.email, 
        role: toUppercaseRole(form.role),
        department: form.dept || "",
        status: form.status || "ACTIVE"
      };
      if (form.password) payload.password = form.password;

      if (editing) {
        await usersApi.update(editing, payload);
        setUsers(prev => prev.map(u => u.id === editing ? { ...u, role: toUppercaseRole(form.role), ...payload } : u));
        setSuccess("User updated successfully");
      } else {
        const newUser = await usersApi.create(payload);
        setUsers(prev => [...prev, newUser]);
        setSuccess("User created successfully");
      }
      setShowModal(false);
      setForm(EMPTY);
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(`Save failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const roleCounts = ["ADMIN", "TEACHER", "STUDENT", "ADMINISTRATOR"].map(r => ({
    role: r, count: users.filter(u => u.role === r).length
  }));

  return (
    <div className="module-wrap">
      {error && <div style={{ padding: "12px 16px", background: "rgba(231,76,94,0.15)", border: "1px solid var(--danger)", color: "var(--danger)", borderRadius: 8, marginBottom: 16 }}>{error}</div>}
      {success && <div style={{ padding: "12px 16px", background: "rgba(46,204,138,0.15)", border: "1px solid var(--success)", color: "var(--success)", borderRadius: 8, marginBottom: 16 }}>{success}</div>}

      <div className="module-header">
        <div>
          <h2 className="module-title">User Management</h2>
          <p className="module-sub">{filtered.length} users • Configure roles & access</p>
        </div>
        <div className="module-actions">
          <input className="search-input" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
          <select className="search-input" value={filterRole} onChange={e => setFilterRole(e.target.value)} style={{ width: 140 }}>
            <option>All</option>
            <option>ADMIN</option>
            <option>TEACHER</option>
            <option>STUDENT</option>
            <option>ADMINISTRATOR</option>
          </select>
          <button className="btn-primary" onClick={openAdd} disabled={loading}>+ Add User</button>
        </div>
      </div>

      {/* Role summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {roleCounts.map(({ role, count }) => {
          const rc = ROLE_COLORS[role];
          return (
            <div key={role} style={{
              background: "var(--navy-light)", border: "1px solid rgba(201,168,76,0.1)",
              borderRadius: 12, padding: "14px 16px", cursor: "pointer",
              transition: "border-color 0.2s",
            }}
              onClick={() => setFilterRole(filterRole === role ? "All" : role)}
            >
              <div style={{ fontSize: 24, fontFamily: "'Playfair Display',serif", color: rc.color }}>{count}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>{role}s</div>
            </div>
          );
        })}
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => {
              const rc = ROLE_COLORS[u.role];
              const initials = u.name.split(" ").map(n => n[0]).join("").slice(0, 2);
              return (
                <tr key={u.id}>
                  <td>
                    <div className="td-student">
                      <div className="td-avatar" style={{ background: rc.bg, color: rc.color }}>{initials}</div>
                      <div>
                        <div className="td-name">{u.name}</div>
                        <div className="td-email">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ background: rc.bg, color: rc.color, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ color: "var(--text-muted)" }}>{u.department || "—"}</td>
                  <td>
                    <span className={`status-chip ${u.status === "ACTIVE" ? "active" : "warning"}`}>{u.status}</span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-edit" onClick={() => openEdit(u)} disabled={loading}>Edit</button>
                      <button className="btn-del" onClick={() => handleDelete(u.id)} disabled={loading}>Del</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{editing ? "Edit User" : "Add User"}</h3>
            <div className="form-grid">
              <div className="field"><label>Full Name</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Full name" />
              </div>
              <div className="field"><label>Email</label>
                <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="email@edu.com" />
              </div>
              <div className="field"><label>Role</label>
                <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
                  <option>Admin</option><option>Teacher</option><option>Student</option><option>Administrator</option>
                </select>
              </div>
              <div className="field"><label>Department / Class</label>
                <input value={form.dept} onChange={e => setForm(p => ({ ...p, dept: e.target.value }))} placeholder="e.g. Computer Science" />
              </div>
              <div className="field"><label>Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                  <option>Active</option><option>Inactive</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave}>Save User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
