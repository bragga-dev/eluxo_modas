import { Outlet } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/Toaster";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-cream/40">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl bg-white p-8 shadow-card">
            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}