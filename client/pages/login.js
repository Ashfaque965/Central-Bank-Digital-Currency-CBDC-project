import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { DEMO_MODE, extractError } from "@/utils/api";

export default function Login() {
  const router = useRouter();
  const { login, user, loading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [user, loading, router]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(form);
      toast.success("Logged in successfully");
      router.push("/dashboard");
    } catch (err) {
      toast.error(extractError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-brand-50 px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2">
          <span className="text-2xl">🏦</span>
          <span className="text-lg font-bold text-slate-900">CBDC Platform</span>
        </Link>
        <div className="card">
          <h1 className="text-xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">
            Log in to access your digital wallet.
          </p>

          {DEMO_MODE ? (
            <div className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
              <p className="font-semibold">Demo credentials</p>
              <p>Citizen — demo@cbdc.gov / demo123</p>
              <p>Admin — admin@cbdc.gov / admin123</p>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="input"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                className="input"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-2.5"
            >
              {submitting ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-brand-600">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
