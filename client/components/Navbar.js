import { useAuth } from "@/context/AuthContext";
import { DEMO_MODE } from "@/utils/api";

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();

  const initials = (user?.name || "U")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open menu"
        >
          ☰
        </button>
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Welcome back{user?.name ? `, ${user.name}` : ""}
          </p>
          {DEMO_MODE ? (
            <span className="badge bg-amber-100 text-amber-700">Demo mode</span>
          ) : null}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-900">{user?.name}</p>
          <p className="text-xs capitalize text-slate-500">{user?.role}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
          {initials}
        </div>
        <button type="button" onClick={logout} className="btn-secondary">
          Logout
        </button>
      </div>
    </header>
  );
}
