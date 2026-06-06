import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Loader from "@/components/Loader";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/utils/api";
import { formatCurrency, formatDate, shortenHash, statusColor } from "@/utils/format";

const FILTERS = ["all", "transfer", "mint", "burn"];

function TransactionsContent() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

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

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchesType = filter === "all" || t.type === filter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        t.txHash?.toLowerCase().includes(q) ||
        t.to?.toLowerCase().includes(q) ||
        t.from?.toLowerCase().includes(q) ||
        t.note?.toLowerCase().includes(q);
      return matchesType && matchesQuery;
    });
  }, [transactions, filter, query]);

  if (loading) return <Loader label="Loading transactions..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>
        <p className="text-sm text-slate-500">
          Your full on-chain transaction history.
        </p>
      </div>

      <div className="card">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-full px-3 py-1 text-sm font-medium capitalize transition ${
                  filter === f
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input max-w-xs"
            placeholder="Search hash, address, note..."
          />
        </div>

        {filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-500">
            No transactions match your filters.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-400">
                <tr>
                  <th className="py-2">Type</th>
                  <th className="py-2">From</th>
                  <th className="py-2">To</th>
                  <th className="py-2">Amount</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((t) => {
                  const outgoing = t.from === user?.walletAddress;
                  return (
                    <tr key={t.id}>
                      <td className="py-3 capitalize">{t.type}</td>
                      <td className="py-3 font-mono text-xs text-slate-500">
                        {shortenHash(t.from)}
                      </td>
                      <td className="py-3 font-mono text-xs text-slate-500">
                        {shortenHash(t.to)}
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

export default function TransactionsPage() {
  return (
    <ProtectedRoute>
      <TransactionsContent />
    </ProtectedRoute>
  );
}
