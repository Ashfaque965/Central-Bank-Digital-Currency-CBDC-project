import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { extractError } from "@/utils/api";

const ROLES = [
  { value: "citizen", label: "Citizen" },
  { value: "merchant", label: "Merchant" },
  { value: "bank", label: "Bank" },
];

export default function Register() {
  const router = useRouter();
  const { register, user, loading } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    role: "citizen",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [user, loading, router]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setSubmitting(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      toast.success("Account created");
      router.push("/dashboard");
    } catch (err) {
      toast.error(extractError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-brand-50 px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2">
          <span className="text-2xl">🏦</span>
          <span className="text-lg font-bold text-slate-900">CBDC Platform</span>
        </Link>
        <div className="card">
          <h1 className="text-xl font-bold text-slate-900">Create your account</h1>
          <p className="mt-1 text-sm text-slate-500">
            Open a digital wallet in seconds.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="input"
                placeholder="Jane Doe"
              />
            </div>
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
              <label className="label" htmlFor="role">
                Account type
              </label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="input"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
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
                placeholder="At least 6 characters"
              />
            </div>
            <div>
              <label className="label" htmlFor="confirm">
                Confirm password
              </label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                required
                value={form.confirm}
                onChange={handleChange}
                className="input"
                placeholder="Re-enter your password"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-2.5"
            >
              {submitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-brand-600">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
