// src/services/api.js
// Centralised API client for EduERP backend

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// ─── helpers ────────────────────────────────────────────────
const getToken = () => localStorage.getItem("token");

const headers = (extra = {}) => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
  ...extra,
});

const request = async (method, path, body) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: headers(),
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "Request failed");
  }
  return res.json();
};

// ─── Auth ────────────────────────────────────────────────────
export const authApi = {
  login: (email, password) =>
    request("POST", "/auth/login", { email, password }),
  signup: (data) =>
    request("POST", "/auth/signup", data),
  me: () => request("GET", "/auth/me"),
};

// ─── Students ────────────────────────────────────────────────
export const studentsApi = {
  getAll: (search) =>
    request("GET", `/students${search ? `?search=${encodeURIComponent(search)}` : ""}`),
  getById: (id) => request("GET", `/students/${id}`),
  create: (data) => request("POST", "/students", data),
  update: (id, data) => request("PUT", `/students/${id}`, data),
  delete: (id) => request("DELETE", `/students/${id}`),
};

// ─── Grades ──────────────────────────────────────────────────
export const gradesApi = {
  getAll: (subject) =>
    request("GET", `/grades${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`),
  getByStudent: (studentId) => request("GET", `/grades/student/${studentId}`),
  createOrUpdate: (data) => request("POST", "/grades", data),
  update: (id, data) => request("PUT", `/grades/${id}`, data),
  delete: (id) => request("DELETE", `/grades/${id}`),
};

// ─── Attendance ──────────────────────────────────────────────
export const attendanceApi = {
  getByStudent: (studentId) => request("GET", `/attendance/student/${studentId}`),
  getByCourseAndDate: (course, date) =>
    request("GET", `/attendance?course=${encodeURIComponent(course)}&date=${date}`),
  getSummary: (studentId) => request("GET", `/attendance/student/${studentId}/summary`),
  mark: (data) => request("POST", "/attendance", data),
  bulkMark: (data) => request("POST", "/attendance/bulk", data),
};

// ─── Schedules ───────────────────────────────────────────────
export const schedulesApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request("GET", `/schedules${qs ? `?${qs}` : ""}`);
  },
  getById: (id) => request("GET", `/schedules/${id}`),
  create: (data) => request("POST", "/schedules", data),
  update: (id, data) => request("PUT", `/schedules/${id}`, data),
  delete: (id) => request("DELETE", `/schedules/${id}`),
};

// ─── Users ───────────────────────────────────────────────────
export const usersApi = {
  getAll: () => request("GET", "/users"),
  getById: (id) => request("GET", `/users/${id}`),
  create: (data) => request("POST", "/users", data),
  update: (id, data) => request("PUT", `/users/${id}`, data),
  delete: (id) => request("DELETE", `/users/${id}`),
};
