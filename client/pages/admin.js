import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import StatCard from "@/components/StatCard";
import Loader from "@/components/Loader";
import { api, extractError } from "@/utils/api";
import { formatCurrency, shortenHash, statusColor } from "@/utils/format";

function AdminContent() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mintForm, setMintForm] = useState({ to: "", amount: "" });
  const [burnForm, setBurnForm] = useState({ from: "", amount: "" });
  const [busy, setBusy] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      const data = await api.getAdminStats();
      setStats(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleMint = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.mint({ to: mintForm.to.trim(), amount: Number(mintForm.amount) });
      toast.success("Tokens minted");
      setMintForm({ to: "", amount: "" });
      await loadStats();
    } catch (err) {
      toast.error(extractError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleBurn = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.burn({ from: burnForm.from.trim(), amount: Number(burnForm.amount) });
      toast.success("Tokens burned");
      setBurnForm({ from: "", amount: "" });
      await loadStats();
    } catch (err) {
      toast.error(extractError(err));
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Loader label="Loading admin console..." />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin console</h1>
        <p className="text-sm text-slate-500">
          Manage currency supply and monitor the network.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total supply"
          value={formatCurrency(stats?.totalSupply)}
          sub="In circulation"
          accent="brand"
        />
        <StatCard label="Users" value={stats?.totalUsers ?? 0} sub="Registered" accent="slate" />
        <StatCard
          label="Transactions"
          value={stats?.totalTransactions ?? 0}
          sub="All time"
          accent="green"
        />
        <StatCard
          label="Pending"
          value={stats?.pendingTransactions ?? 0}
          sub="Awaiting"
          accent="amber"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-4 font-semibold text-slate-900">💰 Mint tokens</h2>
          <form onSubmit={handleMint} className="space-y-4">
            <div>
              <label className="label" htmlFor="mintTo">
                Recipient address
              </label>
              <input
                id="mintTo"
                value={mintForm.to}
                onChange={(e) =>
                  setMintForm((p) => ({ ...p, to: e.target.value }))
                }
                required
                className="input font-mono"
                placeholder="0x..."
              />
            </div>
            <div>
              <label className="label" htmlFor="mintAmount">
                Amount
              </label>
              <input
                id="mintAmount"
                type="number"
                min="0"
                step="0.01"
                value={mintForm.amount}
                onChange={(e) =>
                  setMintForm((p) => ({ ...p, amount: e.target.value }))
                }
                required
                className="input"
                placeholder="0.00"
              />
            </div>
            <button type="submit" disabled={busy} className="btn-primary w-full py-2.5">
              {busy ? "Processing..." : "Mint"}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="mb-4 font-semibold text-slate-900">🔥 Burn tokens</h2>
          <form onSubmit={handleBurn} className="space-y-4">
            <div>
              <label className="label" htmlFor="burnFrom">
                Source address
              </label>
              <input
                id="burnFrom"
                value={burnForm.from}
                onChange={(e) =>
                  setBurnForm((p) => ({ ...p, from: e.target.value }))
                }
                required
                className="input font-mono"
                placeholder="0x..."
              />
            </div>
            <div>
              <label className="label" htmlFor="burnAmount">
                Amount
              </label>
              <input
                id="burnAmount"
                type="number"
                min="0"
                step="0.01"
                value={burnForm.amount}
                onChange={(e) =>
                  setBurnForm((p) => ({ ...p, amount: e.target.value }))
                }
                required
                className="input"
                placeholder="0.00"
              />
            </div>
            <button type="submit" disabled={busy} className="btn-danger w-full py-2.5">
              {busy ? "Processing..." : "Burn"}
            </button>
          </form>
        </div>
      </div>

      <div className="card">
        <h2 className="mb-4 font-semibold text-slate-900">Registered users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-400">
              <tr>
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Role</th>
                <th className="py-2">Wallet</th>
                <th className="py-2">Balance</th>
                <th className="py-2">KYC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(stats?.users || []).map((u) => (
                <tr key={u.id}>
                  <td className="py-3 font-medium text-slate-900">{u.name}</td>
                  <td className="py-3 text-slate-500">{u.email}</td>
                  <td className="py-3 capitalize">{u.role}</td>
                  <td className="py-3 font-mono text-xs text-slate-500">
                    {shortenHash(u.walletAddress)}
                  </td>
                  <td className="py-3 font-semibold">{formatCurrency(u.balance)}</td>
                  <td className="py-3">
                    <span className={`badge ${statusColor(u.kycStatus)}`}>
                      {u.kycStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute adminOnly>
      <AdminContent />
    </ProtectedRoute>
  );
}
