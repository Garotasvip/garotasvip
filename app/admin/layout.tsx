"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, Video, MessageSquareWarning,
  Heart, LogOut, Menu, X, Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface Badges {
  perfis: number;
  videos: number;
  moderacao: number;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [badges, setBadges] = useState<Badges>({ perfis: 0, videos: 0, moderacao: 0 });

  useEffect(() => {
    async function loadBadges() {
      const supabase = createClient();
      const [
        { count: perfis },
        { count: videos },
        { count: moderacao },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("verification_videos").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("reviews").select("*", { count: "exact", head: true }).gte("flag_count", 3).eq("is_approved", true),
      ]);
      setBadges({
        perfis: perfis ?? 0,
        videos: videos ?? 0,
        moderacao: moderacao ?? 0,
      });
    }
    loadBadges();
  }, [pathname]); // recarrega ao navegar entre páginas

  const NAV_ITEMS = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true, badge: 0 },
    { href: "/admin/perfis", label: "Perfis", icon: Users, badge: badges.perfis },
    { href: "/admin/videos", label: "Vídeos", icon: Video, badge: badges.videos },
    { href: "/admin/moderacao", label: "Moderação", icon: MessageSquareWarning, badge: badges.moderacao },
  ];

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
      <div className="p-5 border-b border-gray-800">
        <Link href="/" className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-[#C2185B] fill-[#C2185B]" />
          <span className="font-bold text-white text-lg">GarotasVip</span>
        </Link>
        <div className="flex items-center gap-1.5 mt-1">
          <Shield className="w-3 h-3 text-[#F8BBD9]" />
          <p className="text-xs text-gray-400">Painel Administrativo</p>
        </div>
      </div>

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
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            )}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{item.label}</span>
            {item.badge > 0 && (
              <span className={cn(
                "text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold",
                isActive(item) ? "bg-white/20 text-white" : "bg-red-500 text-white"
              )}>
                {item.badge > 99 ? "99+" : item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-2">
        <Link href="/dashboard">
          <Button variant="ghost" className="w-full justify-start gap-3 text-gray-400 hover:text-white hover:bg-gray-800 text-sm">
            <Users className="w-4 h-4" />
            Ver como usuário
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Sair
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="hidden lg:flex flex-col w-64 bg-gray-900 border-r border-gray-800 flex-shrink-0 fixed h-full z-30">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={cn(
        "fixed top-0 left-0 h-full w-64 bg-gray-900 z-50 shadow-xl transform transition-transform duration-300 lg:hidden",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <button className="absolute top-4 right-4 text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
          <X className="w-5 h-5" />
        </button>
        <SidebarContent />
      </aside>

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-20 bg-gray-900 border-b border-gray-800 px-4 h-14 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-white">Admin</span>
        </header>

        <main className="flex-1 p-6 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
