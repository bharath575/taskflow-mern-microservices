import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";
import type { AppDispatch } from "../app/store";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      await dispatch(login({ email, password }));
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.logo}>TaskFlow</h1>
        <p style={styles.subtitle}>Welcome back 👋 Login to continue</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Email */}
          <div style={styles.inputGroup}>
            <input
              style={styles.input}
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div style={styles.inputGroup}>
            <input
              type={show ? "text" : "password"}
              style={styles.input}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span style={styles.eye} onClick={() => setShow(!show)}>
              {show ? "🙈" : "👁️"}
            </span>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {/* 🔥 NEW REGISTER LINK */}
        <p style={styles.footer}>
          Don’t have an account?{" "}
          <Link to="/register" style={styles.link}>
            Create one →
          </Link>
        </p>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #4f46e5, #7c3aed, #9333ea)",
    padding: 20,
  },

  card: {
    width: "100%",
    maxWidth: 380,
    padding: 40,
    borderRadius: 20,
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "white",
    textAlign: "center",
  },

  logo: {
    fontSize: 30,
    fontWeight: 800,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    marginBottom: 30,
    opacity: 0.85,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },

  inputGroup: {
    position: "relative",
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "none",
    outline: "none",
    background: "rgba(255,255,255,0.9)",
    color: "#333",
  },

  eye: {
    position: "absolute",
    right: 10,
    top: 10,
    cursor: "pointer",
  },

  button: {
    padding: 12,
    borderRadius: 12,
    border: "none",
    fontWeight: 700,
    background: "white",
    color: "#4f46e5",
    cursor: "pointer",
  },

  footer: {
    marginTop: 22,
    fontSize: 13,
    opacity: 0.9,
  },

  link: {
    color: "white",
    fontWeight: 600,
    textDecoration: "underline",
  },
};
