import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ProtectedRoute from "@/components/ProtectedRoute";
import StatCard from "@/components/StatCard";
import Loader from "@/components/Loader";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/utils/api";
import { formatCurrency, formatDate, shortenHash, statusColor } from "@/utils/format";

function buildChartData(transactions) {
  const days = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const total = transactions
      .filter((t) => {
        const td = new Date(t.createdAt);
        return td.toDateString() === d.toDateString();
      })
      .reduce((sum, t) => sum + t.amount, 0);
    days.push({ day: key, volume: Math.round(total) });
  }
  return days;
}

function DashboardContent() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await api.getTransactions();
        if (active) setTransactions(data);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const chartData = useMemo(() => buildChartData(transactions), [transactions]);
  const sent = useMemo(
    () =>
      transactions
        .filter((t) => t.from === user?.walletAddress && t.type === "transfer")
        .reduce((s, t) => s + t.amount, 0),
    [transactions, user]
  );

  if (loading) return <Loader label="Loading dashboard..." />;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">
            Your wallet at a glance.
          </p>
        </div>
        <Link href="/transfer" className="btn-primary">
          💸 Send CBDC
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Wallet balance"
          value={formatCurrency(user?.balance)}
          sub="Available"
          accent="brand"
        />
        <StatCard
          label="Total sent"
          value={formatCurrency(sent)}
          sub="All time"
          accent="amber"
        />
        <StatCard
          label="Transactions"
          value={transactions.length}
          sub="Recorded"
          accent="slate"
        />
        <StatCard
          label="KYC status"
          value={(user?.kycStatus || "pending").toUpperCase()}
          sub={user?.kycStatus === "verified" ? "Verified" : "Action needed"}
          accent={user?.kycStatus === "verified" ? "green" : "amber"}
        />
      </div>

      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Activity (7 days)</h2>
          <span className="text-xs text-slate-400">Volume in CBDC</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="vol" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1d3df5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1d3df5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} width={40} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="#1d3df5"
                strokeWidth={2}
                fill="url(#vol)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Recent transactions</h2>
          <Link href="/transactions" className="text-sm font-semibold text-brand-600">
            View all
          </Link>
        </div>
        {transactions.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">
            No transactions yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-400">
                <tr>
                  <th className="py-2">Type</th>
                  <th className="py-2">Counterparty</th>
                  <th className="py-2">Amount</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.slice(0, 5).map((t) => {
                  const outgoing = t.from === user?.walletAddress;
                  return (
                    <tr key={t.id}>
                      <td className="py-3 capitalize">{t.type}</td>
                      <td className="py-3 font-mono text-xs text-slate-500">
                        {shortenHash(outgoing ? t.to : t.from)}
                      </td>
                      <td
                        className={`py-3 font-semibold ${
                          outgoing ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {outgoing ? "-" : "+"}
                        {formatCurrency(t.amount)}
                      </td>
                      <td className="py-3">
                        <span className={`badge ${statusColor(t.status)}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-500">{formatDate(t.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
