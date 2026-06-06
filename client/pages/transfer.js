import { useState } from "react";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { api, extractError } from "@/utils/api";
import { formatCurrency } from "@/utils/format";

function TransferContent() {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState({ to: "", amount: "", note: "" });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    try {
      const res = await api.transfer({
        to: form.to.trim(),
        amount: Number(form.amount),
        note: form.note.trim(),
      });
      toast.success("Transfer completed");
      setResult(res.transaction || res);
      setForm({ to: "", amount: "", note: "" });
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
        <h1 className="text-2xl font-bold text-slate-900">Send CBDC</h1>
        <p className="text-sm text-slate-500">
          Transfer digital currency instantly to another wallet.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="to">
                Recipient wallet address
              </label>
              <input
                id="to"
                name="to"
                required
                value={form.to}
                onChange={handleChange}
                className="input font-mono"
                placeholder="0x..."
              />
            </div>
            <div>
              <label className="label" htmlFor="amount">
                Amount (CBDC)
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                min="0"
                step="0.01"
                required
                value={form.amount}
                onChange={handleChange}
                className="input"
                placeholder="0.00"
              />
              <p className="mt-1 text-xs text-slate-400">
                Available: {formatCurrency(user?.balance)}
              </p>
            </div>
            <div>
              <label className="label" htmlFor="note">
                Note (optional)
              </label>
              <input
                id="note"
                name="note"
                value={form.note}
                onChange={handleChange}
                className="input"
                placeholder="What is this for?"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-2.5"
            >
              {submitting ? "Processing..." : "Send transfer"}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="card bg-brand-600 text-white">
            <p className="text-sm text-brand-100">Your balance</p>
            <p className="mt-1 text-2xl font-bold">{formatCurrency(user?.balance)}</p>
            <p className="mt-4 break-all font-mono text-xs text-brand-100">
              {user?.walletAddress}
            </p>
          </div>
          {result ? (
            <div className="card">
              <p className="font-semibold text-green-700">Transfer successful</p>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">Amount</dt>
                  <dd className="font-semibold">{formatCurrency(result.amount)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Tx hash</dt>
                  <dd className="mt-1 break-all font-mono text-xs text-slate-700">
                    {result.txHash}
                  </dd>
                </div>
              </dl>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function TransferPage() {
  return (
    <ProtectedRoute>
      <TransferContent />
    </ProtectedRoute>
  );
}
