import { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "../features/auth/authSlice";
import type { AppDispatch } from "../app/store";
import { useNavigate, Link } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import AuthButton from "../components/auth/AuthButton";

export default function Register() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) return alert("Passwords do not match ❌");

    try {
      setLoading(true);
      await dispatch(register({ name, email, password }));
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="TaskFlow" subtitle="Create your account 🚀">
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <AuthInput
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <AuthInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <AuthInput
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <AuthButton loading={loading}>Register</AuthButton>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="underline font-semibold">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
