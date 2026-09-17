import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const emptyAuthForm = {
  email: "",
  username: "",
  password: "",
  display_name: "",
};

export function AuthPage() {
  const { handleLogin, handleRegister, loading, error, setError } = useAuth();
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState(emptyAuthForm);

  async function handleSubmit(event) {
    event.preventDefault();
    if (authMode === "register") {
      await handleRegister(authForm.email, authForm.password, authForm.display_name);
    } else {
      await handleLogin(authForm.email, authForm.password);
    }
  }

  function toggleMode(mode) {
    setError("");
    setAuthMode(mode);
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div className="brand-icon" style={{ margin: "0 auto 14px auto", width: 48, height: 48, fontSize: "1.6rem" }}>
            ⏱️
          </div>
          <h1>Pomodoro Rooms</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", margin: 0 }}>
            Collaborative focus sessions with real-time room sync
          </p>
        </div>

        <div className="auth-segmented">
          <button type="button" className={authMode === "login" ? "active" : ""} onClick={() => toggleMode("login")}>
            Sign In
          </button>
          <button type="button" className={authMode === "register" ? "active" : ""} onClick={() => toggleMode("register")}>
            Register
          </button>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="stack">
          <label>
            Email Address
            <input
              type="email"
              placeholder="user@example.com"
              value={authForm.email}
              onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
              required
            />
          </label>

          {authMode === "register" && (
            <label>
              Display Name
              <input
                type="text"
                placeholder="Your Name"
                value={authForm.display_name}
                onChange={(e) => setAuthForm({ ...authForm, display_name: e.target.value })}
                required
              />
            </label>
          )}

          <label>
            Password
            <input
              type="password"
              placeholder="••••••••"
              value={authForm.password}
              onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
              required
              minLength={8}
            />
          </label>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 10 }}>
            {loading ? "Processing..." : authMode === "register" ? "Create Account" : "Sign In"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default AuthPage;
