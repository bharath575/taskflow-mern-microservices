import { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "../features/auth/authSlice";
import type { AppDispatch } from "../app/store";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      alert("Passwords do not match ❌");
      return;
    }

    try {
      setLoading(true);

      await dispatch(register({ name, email, password }));

      alert("Registered successfully 🎉 Please login.");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.logo}>TaskFlow</h1>
        <p style={styles.subtitle}>Create your account 🚀</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Name */}
          <div style={styles.inputGroup}>
            <input
              style={styles.input}
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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

          {/* Confirm Password */}
          <div style={styles.inputGroup}>
            <input
              type={show ? "text" : "password"}
              style={styles.input}
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login
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
    maxWidth: 400,
    padding: 40,
    borderRadius: 20,

    /* glass look */
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
    gap: 16,
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
    fontSize: 14,
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
    fontSize: 14,
    background: "white",
    color: "#4f46e5",
    cursor: "pointer",
  },

  footer: {
    marginTop: 20,
    fontSize: 13,
    opacity: 0.9,
  },

  link: {
    color: "white",
    fontWeight: 600,
    textDecoration: "underline",
  },
};
