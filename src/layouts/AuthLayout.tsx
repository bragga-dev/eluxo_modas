import { Outlet } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/Toaster";
import authCover from "@/assets/auth-cover.jpg";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-cream/40">
      <Header />
      <main className="flex flex-1 lg:grid lg:grid-cols-2">
        <div className="relative hidden lg:block">
          <img src={authCover} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          <div className="absolute bottom-10 left-10 right-10 text-white">
            <p className="font-display text-2xl">ÉLUXO MODAS</p>
            <p className="mt-1 text-sm text-white/80">Feminina e masculina — estilo que valoriza você.</p>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="rounded-2xl bg-white p-8 shadow-card">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}