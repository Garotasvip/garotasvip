"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CityAutocomplete } from "@/components/CityAutocomplete";

export function HeroSearch() {
  const [city, setCity] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    router.push(`/perfis?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10 pointer-events-none" />
        <CityAutocomplete
          value={city}
          onChange={setCity}
          placeholder="Buscar por cidade..."
          className="pl-10 h-12 bg-white text-gray-900 border-0 rounded-xl text-base focus:ring-2 focus:ring-white/50"
        />
      </div>
      <Button
        type="submit"
        className="h-12 px-8 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold"
      >
        Buscar
      </Button>
    </form>
  );
}
