import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const FEATURES = [
  { icon: "🔐", title: "Secure wallets", desc: "JWT auth, KYC/AML and role-based access control." },
  { icon: "💸", title: "Instant transfers", desc: "Send and receive CBDC in real time, 24/7." },
  { icon: "⛓️", title: "Blockchain settled", desc: "Every transaction is recorded on-chain for auditability." },
  { icon: "🛡️", title: "Central oversight", desc: "Mint, burn and monitor supply from the admin console." },
];

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-brand-50">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏦</span>
          <span className="text-lg font-bold text-slate-900">CBDC Platform</span>
        </div>
        <nav className="flex items-center gap-3">
          <Link href="/login" className="btn-secondary">
            Log in
          </Link>
          <Link href="/register" className="btn-primary">
            Get started
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        <section className="grid items-center gap-10 py-16 lg:grid-cols-2">
          <div>
            <span className="badge bg-brand-100 text-brand-700">
              Blockchain · Web3 · Programmable money
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
              The digital currency of the central bank.
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Issue, transfer and govern a fully digital currency with
              enterprise-grade security and on-chain transparency.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register" className="btn-primary px-6 py-3 text-base">
                Create your wallet
              </Link>
              <Link href="/login" className="btn-secondary px-6 py-3 text-base">
                I already have an account
              </Link>
            </div>
          </div>
          <div className="card">
            <p className="text-sm font-medium text-slate-500">Total balance</p>
            <p className="mt-1 text-4xl font-bold text-slate-900">
              12,450.75 <span className="text-xl text-brand-600">CBDC</span>
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">This month</p>
                <p className="text-lg font-semibold text-green-600">+5,200</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Transactions</p>
                <p className="text-lg font-semibold text-slate-900">128</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 pb-20 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card">
              <span className="text-3xl">{f.icon}</span>
              <h3 className="mt-3 font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{f.desc}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        Central Bank Digital Currency Platform · Built with Next.js
      </footer>
    </div>
  );
}
