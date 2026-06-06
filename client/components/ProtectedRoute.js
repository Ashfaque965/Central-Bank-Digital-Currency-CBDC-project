import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Loader from "./Loader";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
    } else if (adminOnly && user.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [user, loading, adminOnly, router]);

  if (loading || !user || (adminOnly && user.role !== "admin")) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader label="Checking your session..." />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
