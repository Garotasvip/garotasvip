"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Eye, Search, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ProfileStatus = "pending" | "active" | "suspended";

interface AdminProfile {
  id: string;
  name: string;
  city: string;
  email: string;
  status: ProfileStatus;
  isPremium: boolean;
  trustScore: number;
  createdAt: string;
  photoCount: number;
}

const MOCK_PROFILES: AdminProfile[] = Array.from({ length: 20 }, (_, i) => ({
  id: String(i + 1),
  name: ["Ana Silva", "Julia Santos", "Carla Mendes", "Fernanda Costa", "Paula Lima"][i % 5] + ` ${i + 1}`,
  city: ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Brasília", "Curitiba"][i % 5],
  email: `usuario${i + 1}@email.com`,
  status: (["pending", "active", "active", "active", "suspended"][i % 5]) as ProfileStatus,
  isPremium: i % 4 === 0,
  trustScore: 20 + (i % 8) * 10,
  createdAt: new Date(Date.now() - i * 86400000).toLocaleDateString("pt-BR"),
  photoCount: i % 5,
}));

const STATUS_CONFIG = {
  pending: { label: "Pendente", class: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  active: { label: "Ativo", class: "bg-green-100 text-green-700 border-green-200" },
  suspended: { label: "Suspenso", class: "bg-red-100 text-red-700 border-red-200" },
};

export default function AdminPerfisPage() {
  const [profiles, setProfiles] = useState(MOCK_PROFILES);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<ProfileStatus | "all">("all");

  function updateStatus(id: string, status: ProfileStatus) {
    setProfiles((prev) => prev.map((p) => p.id === id ? { ...p, status } : p));
  }

  const filtered = profiles.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: profiles.length,
    pending: profiles.filter((p) => p.status === "pending").length,
    active: profiles.filter((p) => p.status === "active").length,
    suspended: profiles.filter((p) => p.status === "suspended").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Perfis</h1>
        <p className="text-muted-foreground text-sm mt-1">Aprove, suspenda ou visualize perfis da plataforma.</p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou cidade..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(["all", "pending", "active", "suspended"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={cn(
                "text-sm px-3 py-1.5 rounded-full border transition-colors font-medium",
                filterStatus === s
                  ? "bg-[#C2185B] text-white border-[#C2185B]"
                  : "border-gray-200 text-muted-foreground hover:border-[#C2185B]"
              )}
            >
              {s === "all" ? "Todos" : STATUS_CONFIG[s].label} ({counts[s]})
            </button>
          ))}
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left p-4 font-semibold text-gray-700">Perfil</th>
                <th className="text-left p-4 font-semibold text-gray-700 hidden sm:table-cell">Status</th>
                <th className="text-left p-4 font-semibold text-gray-700 hidden md:table-cell">Score</th>
                <th className="text-left p-4 font-semibold text-gray-700 hidden lg:table-cell">Cadastro</th>
                <th className="text-right p-4 font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((profile) => (
                <tr key={profile.id} className="hover:bg-gray-50/50 transition-colors">
                  {/* Nome + cidade */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#F8BBD9]/40 flex items-center justify-center flex-shrink-0">
                        <span className="text-[#C2185B] font-bold text-sm">{profile.name.charAt(0)}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 truncate">{profile.name}</p>
                          {profile.isPremium && (
                            <Badge className="bg-[#C2185B] text-white border-0 text-xs px-1.5 py-0">VIP</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {profile.city}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="p-4 hidden sm:table-cell">
                    <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full border", STATUS_CONFIG[profile.status].class)}>
                      {STATUS_CONFIG[profile.status].label}
                    </span>
                  </td>

                  {/* Trust Score */}
                  <td className="p-4 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full",
                            profile.trustScore >= 70 ? "bg-green-500" :
                            profile.trustScore >= 40 ? "bg-yellow-500" : "bg-red-400"
                          )}
                          style={{ width: `${profile.trustScore}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{profile.trustScore}%</span>
                    </div>
                  </td>

                  {/* Data */}
                  <td className="p-4 hidden lg:table-cell">
                    <span className="text-xs text-muted-foreground">{profile.createdAt}</span>
                  </td>

                  {/* Ações */}
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-[#C2185B]"
                        title="Ver perfil"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      {profile.status !== "active" && (
                        <Button
                          size="sm"
                          className="h-8 px-3 bg-green-500 hover:bg-green-600 text-white gap-1 text-xs"
                          onClick={() => updateStatus(profile.id, "active")}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Aprovar
                        </Button>
                      )}

                      {profile.status !== "suspended" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-3 border-red-200 text-red-500 hover:bg-red-50 gap-1 text-xs"
                          onClick={() => updateStatus(profile.id, "suspended")}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Suspender
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>Nenhum perfil encontrado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
