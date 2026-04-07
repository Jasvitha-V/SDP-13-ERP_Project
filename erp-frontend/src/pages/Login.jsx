import { useState } from "react";
import { authApi } from "../services/api";
import { formatRole } from "../utils/roleUtils";
import { useTheme } from "../context/ThemeContext";
import "./Login.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT",
  });
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");
  const { isDark, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authApi.login(email, password);
      localStorage.setItem("token", response.token);
      onLogin({ 
        email, 
        role: formatRole(response.role), 
        name: response.name,
        id: response.id 
      });
    } catch (err) {
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError("");
    setSignupSuccess("");

    if (!signupForm.name || !signupForm.email || !signupForm.password) {
      setSignupError("Please fill in all fields");
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      setSignupError("Passwords do not match");
      return;
    }

    if (signupForm.password.length < 6) {
      setSignupError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await authApi.signup?.({
        name: signupForm.name,
        email: signupForm.email,
        password: signupForm.password,
        role: signupForm.role,
      }) || Promise.reject(new Error("Signup endpoint not available"));
      
      setSignupSuccess("Account created successfully! Please log in.");
      setTimeout(() => {
        setShowSignup(false);
        setSignupForm({ name: "", email: "", password: "", confirmPassword: "", role: "STUDENT" });
        setSignupSuccess("");
      }, 2000);
    } catch (err) {
      setSignupError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      {/* Theme Toggle */}
      <button className="theme-toggle" onClick={toggleTheme} title="Toggle dark/light mode">
        {isDark ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <circle cx="10" cy="10" r="3" />
            <path d="M10 2v4m0 8v4M18 10h-4m-8 0H2m14.14-7.14l-2.83 2.83m-7.42 7.42l-2.83 2.83M18 18l-2.83-2.83m-7.42-7.42l-2.83-2.83" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>

      <div className="login-bg">
        <div className="bg-orb orb1" />
        <div className="bg-orb orb2" />
        <div className="bg-grid" />
      </div>

      <div className="login-card">
        <div className="login-brand">
          <div className="brand-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="12" height="12" rx="2" fill="var(--gold)" />
              <rect x="16" width="12" height="12" rx="2" fill="var(--gold)" opacity="0.6" />
              <rect y="16" width="12" height="12" rx="2" fill="var(--gold)" opacity="0.6" />
              <rect x="16" y="16" width="12" height="12" rx="2" fill="var(--gold)" opacity="0.3" />
            </svg>
          </div>
          <div>
            <h1 className="brand-title">EduERP</h1>
            <p className="brand-sub">Enterprise Resource Planning</p>
          </div>
        </div>

        {!showSignup ? (
          <>
            <h2 className="login-heading">Welcome back</h2>
            <p className="login-desc">Sign in to access your institution portal</p>

            {error && <div className="login-error">{error}</div>}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="field">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@institution.edu"
                  required
                  disabled={loading}
                />
              </div>
              <div className="field">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>
              <button type="submit" className="btn-login" disabled={loading}>
                {loading ? <span className="spinner" /> : "Sign In"}
              </button>
            </form>

            <div className="auth-toggle">
              <span className="toggle-text">Don't have an account?</span>
              <button 
                type="button"
                className="btn-link" 
                onClick={() => setShowSignup(true)}
                disabled={loading}
              >
                Create account
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="login-heading">Create Account</h2>
            <p className="login-desc">Join the EduERP system</p>

            {signupError && <div className="login-error">{signupError}</div>}
            {signupSuccess && <div className="login-success">{signupSuccess}</div>}

            <form onSubmit={handleSignup} className="login-form">
              <div className="field">
                <label>Full Name</label>
                <input
                  type="text"
                  value={signupForm.name}
                  onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                  placeholder="John Doe"
                  required
                  disabled={loading}
                />
              </div>
              <div className="field">
                <label>Email Address</label>
                <input
                  type="email"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  placeholder="john@institution.edu"
                  required
                  disabled={loading}
                />
              </div>
              <div className="field">
                <label>Role</label>
                <select
                  value={signupForm.role}
                  onChange={(e) => setSignupForm({ ...signupForm, role: e.target.value })}
                  disabled={loading}
                  className="role-select"
                >
                  <option value="STUDENT">Student</option>
                  <option value="TEACHER">Teacher</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="field">
                <label>Password</label>
                <input
                  type="password"
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>
              <div className="field">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={signupForm.confirmPassword}
                  onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>
              <button type="submit" className="btn-login" disabled={loading}>
                {loading ? <span className="spinner" /> : "Create Account"}
              </button>
            </form>

            <div className="auth-toggle">
              <span className="toggle-text">Already have an account?</span>
              <button 
                type="button"
                className="btn-link" 
                onClick={() => {
                  setShowSignup(false);
                  setEmail("");
                  setPassword("");
                  setError("");
                }}
                disabled={loading}
              >
                Sign in
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
