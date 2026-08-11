import { FormEvent, useState } from "react";
import { apiRequest } from "../api/client";

type LoginResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

type LoginProps = {
  onLogin: (user: LoginResponse["user"]) => void;
};

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("admin@mini-erp.local");
  const [password, setPassword] = useState("Admin12345!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await apiRequest<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      onLogin(result.user);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to sign in",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div>
          <p className="eyebrow">MINI ERP</p>
          <h1>Sign in</h1>
          <p className="muted">
            Manage customers, products, inventory and sales challans.
          </p>
        </div>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}