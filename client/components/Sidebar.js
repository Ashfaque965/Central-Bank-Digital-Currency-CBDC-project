import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/transfer", label: "Send CBDC", icon: "💸" },
  { href: "/transactions", label: "Transactions", icon: "📊" },
  { href: "/kyc", label: "KYC", icon: "🪪" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

const ADMIN_NAV = [{ href: "/admin", label: "Admin", icon: "🛡️" }];

export default function Sidebar({ open, onClose }) {
  const router = useRouter();
  const { user } = useAuth();

  const items = [...NAV, ...(user?.role === "admin" ? ADMIN_NAV : [])];

  return (
    <>
      {open ? (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      ) : null}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white px-4 py-6 transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2 px-2">
          <span className="text-2xl">🏦</span>
          <div>
            <p className="text-sm font-bold leading-tight text-slate-900">CBDC</p>
            <p className="text-xs text-slate-500">Central Bank</p>
          </div>
        </div>
        <nav className="mt-8 space-y-1">
          {items.map((item) => {
            const active = router.pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
