import { Link, Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/Toaster";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-cream/40">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 block text-center font-display text-2xl text-ink">
            Éluxo Modas
          </Link>
          <div className="rounded-2xl bg-white p-8 shadow-card">
            <Outlet />
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
