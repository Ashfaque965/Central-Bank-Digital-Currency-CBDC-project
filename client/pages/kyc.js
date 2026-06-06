import { useState } from "react";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { api, extractError } from "@/utils/api";
import { statusColor } from "@/utils/format";

const STEPS = [
  { key: "submitted", label: "Submitted" },
  { key: "processing", label: "Under review" },
  { key: "verified", label: "Verified" },
];

function KycContent() {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.name || "",
    idType: "passport",
    idNumber: "",
    address: "",
    dob: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const status = user?.kycStatus || "pending";
  const verified = status === "verified";

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.submitKyc(form);
      toast.success("KYC documents submitted");
      await refresh();
    } catch (err) {
      toast.error(extractError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">KYC verification</h1>
        <p className="text-sm text-slate-500">
          Verify your identity to unlock full wallet capabilities.
        </p>
      </div>

      <div className="card flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">Current status</p>
          <span className={`badge mt-1 ${statusColor(status)}`}>
            {status.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {STEPS.map((step, idx) => {
            const reached =
              verified ||
              (status === "submitted" && idx === 0) ||
              (status === "processing" && idx <= 1);
            return (
              <div key={step.key} className="flex items-center gap-2">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                    reached
                      ? "bg-brand-600 text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {idx + 1}
                </span>
                <span className="hidden text-sm text-slate-600 sm:inline">
                  {step.label}
                </span>
                {idx < STEPS.length - 1 ? (
                  <span className="h-px w-6 bg-slate-200" />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {verified ? (
        <div className="card text-center">
          <p className="text-4xl">✅</p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900">
            You&apos;re verified
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Your identity has been verified. You have full access to all features.
          </p>
        </div>
      ) : (
        <div className="card">
          <h2 className="mb-4 font-semibold text-slate-900">Submit your documents</h2>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label" htmlFor="fullName">
                Legal full name
              </label>
              <input
                id="fullName"
                name="fullName"
                required
                value={form.fullName}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div>
              <label className="label" htmlFor="idType">
                ID type
              </label>
              <select
                id="idType"
                name="idType"
                value={form.idType}
                onChange={handleChange}
                className="input"
              >
                <option value="passport">Passport</option>
                <option value="national_id">National ID</option>
                <option value="drivers_license">Driver&apos;s license</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="idNumber">
                ID number
              </label>
              <input
                id="idNumber"
                name="idNumber"
                required
                value={form.idNumber}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div>
              <label className="label" htmlFor="dob">
                Date of birth
              </label>
              <input
                id="dob"
                name="dob"
                type="date"
                required
                value={form.dob}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div>
              <label className="label" htmlFor="address">
                Residential address
              </label>
              <input
                id="address"
                name="address"
                required
                value={form.address}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full py-2.5"
              >
                {submitting ? "Submitting..." : "Submit for verification"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function KycPage() {
  return (
    <ProtectedRoute>
      <KycContent />
    </ProtectedRoute>
  );
}
