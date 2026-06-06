import { useState } from "react";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency, statusColor } from "@/utils/format";

function ProfileContent() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(user?.walletAddress || "");
      setCopied(true);
      toast.success("Address copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy address");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        <p className="text-sm text-slate-500">Your account details and wallet.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-600 text-2xl font-bold text-white">
            {(user?.name || "U")
              .split(" ")
              .map((p) => p[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            {user?.name}
          </h2>
          <p className="text-sm text-slate-500">{user?.email}</p>
          <span className="badge mt-3 bg-brand-50 capitalize text-brand-700">
            {user?.role}
          </span>
        </div>

        <div className="card lg:col-span-2">
          <h2 className="mb-4 font-semibold text-slate-900">Account information</h2>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-slate-500">Full name</dt>
              <dd className="font-medium text-slate-900">{user?.name}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Email</dt>
              <dd className="font-medium text-slate-900">{user?.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Role</dt>
              <dd className="font-medium capitalize text-slate-900">{user?.role}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">KYC status</dt>
              <dd>
                <span className={`badge ${statusColor(user?.kycStatus)}`}>
                  {(user?.kycStatus || "pending").toUpperCase()}
                </span>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm text-slate-500">Wallet address</dt>
              <dd className="mt-1 flex items-center gap-2">
                <code className="break-all rounded bg-slate-100 px-2 py-1 text-xs text-slate-700">
                  {user?.walletAddress}
                </code>
                <button
                  type="button"
                  onClick={copyAddress}
                  className="btn-secondary px-2 py-1 text-xs"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="card bg-gradient-to-r from-brand-600 to-brand-800 text-white">
        <p className="text-sm text-brand-100">Wallet balance</p>
        <p className="mt-1 text-3xl font-bold">{formatCurrency(user?.balance)}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
