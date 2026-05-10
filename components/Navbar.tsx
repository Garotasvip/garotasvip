"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#F8BBD9]/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Heart className="w-7 h-7 text-[#C2185B] fill-[#C2185B]" />
            <span className="text-xl font-bold text-[#C2185B]">GarotasVip</span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/perfis" className="text-sm text-muted-foreground hover:text-[#C2185B] transition-colors">
              Encontrar
            </Link>
            <Link href="/perfis?premium=true" className="text-sm text-muted-foreground hover:text-[#C2185B] transition-colors">
              Premium
            </Link>
          </nav>

          {/* Ações desktop */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="gap-2 text-[#C2185B]">
                    <LayoutDashboard className="w-4 h-4" />
                    Meu painel
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-[#C2185B] text-[#C2185B] hover:bg-[#C2185B] hover:text-white"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-[#C2185B]">
                    Entrar
                  </Button>
                </Link>
                <Link href="/cadastro">
                  <Button size="sm" className="bg-[#C2185B] hover:bg-[#C2185B]/90 text-white">
                    Anunciar
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Hamburguer mobile */}
          <button
            className="md:hidden p-2 text-[#C2185B]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#F8BBD9]/60 px-4 py-4 space-y-3">
          <Link
            href="/perfis"
            className="block text-sm text-muted-foreground hover:text-[#C2185B] py-2"
            onClick={() => setMenuOpen(false)}
          >
            Encontrar
          </Link>
          <Link
            href="/perfis?premium=true"
            className="block text-sm text-muted-foreground hover:text-[#C2185B] py-2"
            onClick={() => setMenuOpen(false)}
          >
            Premium
          </Link>

          <div className="pt-2 border-t border-[#F8BBD9]/60 space-y-2">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full gap-2 border-[#C2185B] text-[#C2185B]">
                    <User className="w-4 h-4" />
                    Meu painel
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full gap-2 text-muted-foreground"
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full border-[#C2185B] text-[#C2185B]">
                    Entrar
                  </Button>
                </Link>
                <Link href="/cadastro" onClick={() => setMenuOpen(false)}>
                  <Button size="sm" className="w-full bg-[#C2185B] hover:bg-[#C2185B]/90 text-white">
                    Anunciar
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
