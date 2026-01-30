import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";
import type { AppDispatch } from "../app/store";
import { useNavigate, Link } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import AuthButton from "../components/auth/AuthButton";

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
    <AuthLayout title="TaskFlow" subtitle="Welcome back 👋 Login to continue">
      <form onSubmit={handleSubmit} className="space-y-5">
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

        <AuthButton loading={loading}>Login</AuthButton>

        <p className="text-center text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="underline font-semibold">
            Register
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
