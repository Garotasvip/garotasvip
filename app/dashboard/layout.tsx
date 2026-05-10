"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, User, Images, Video, Crown,
  Heart, LogOut, Menu, X, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/perfil", label: "Editar Perfil", icon: User },
  { href: "/dashboard/fotos", label: "Minhas Fotos", icon: Images },
  { href: "/dashboard/video", label: "Vídeo de Verificação", icon: Video },
  { href: "/dashboard/premium", label: "Plano Premium", icon: Crown },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  function isActive(item: typeof NAV_ITEMS[0]) {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href);
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-[#C2185B] fill-[#C2185B]" />
          <span className="font-bold text-[#C2185B] text-lg">GarotasVip</span>
        </Link>
        <p className="text-xs text-muted-foreground mt-1">Painel da acompanhante</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
              isActive(item)
                ? "bg-[#C2185B] text-white"
                : "text-gray-600 hover:bg-[#F8BBD9]/30 hover:text-[#C2185B]"
            )}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {item.label}
            {item.href === "/dashboard/premium" && (
              <span className="ml-auto text-xs bg-yellow-400 text-yellow-900 rounded-full px-1.5 py-0.5 font-semibold">
                VIP
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-red-500 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Sair da conta
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 flex-shrink-0 fixed h-full z-30">
        <SidebarContent />
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar mobile */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-xl transform transition-transform duration-300 lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          className="absolute top-4 right-4 text-muted-foreground"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>
        <SidebarContent />
      </aside>

      {/* Conteúdo principal */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        {/* Topbar mobile */}
        <header className="lg:hidden sticky top-0 z-20 bg-white border-b border-gray-100 px-4 h-14 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="text-[#C2185B]">
            <Menu className="w-6 h-6" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#C2185B] fill-[#C2185B]" />
            <span className="font-bold text-[#C2185B]">GarotasVip</span>
          </Link>
        </header>

        <main className="flex-1 p-6 max-w-4xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
