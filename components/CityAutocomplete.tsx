"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface IbgeCity {
  id: number;
  nome: string;
  microrregiao: { mesorregiao: { UF: { sigla: string } } };
}

interface CityOption {
  label: string; // "São Paulo - SP"
  value: string; // "São Paulo - SP"
}

let cachedCities: CityOption[] | null = null;

async function loadCities(): Promise<CityOption[]> {
  if (cachedCities) return cachedCities;
  const res = await fetch(
    "https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome"
  );
  const data: IbgeCity[] = await res.json();
  cachedCities = data.map((c) => {
    const uf = c.microrregiao?.mesorregiao?.UF?.sigla ?? "";
    const label = uf ? `${c.nome} - ${uf}` : c.nome;
    return { label, value: label };
  });
  return cachedCities;
}

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  placeholder?: string;
  className?: string;
}

export function CityAutocomplete({
  value,
  onChange,
  error,
  placeholder = "Ex: São Paulo - SP",
  className,
}: CityAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [suggestions, setSuggestions] = useState<CityOption[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    setLoading(true);
    loadCities()
      .then(setCities)
      .finally(() => setLoading(false));
  }, []);

  const filter = useCallback(
    (text: string) => {
      if (text.length < 2) {
        setSuggestions([]);
        setOpen(false);
        return;
      }
      const lower = text.toLowerCase();
      const matches = cities
        .filter((c) => c.label.toLowerCase().includes(lower))
        .slice(0, 8);
      setSuggestions(matches);
      setOpen(matches.length > 0);
    },
    [cities]
  );

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const text = e.target.value;
    setInputValue(text);
    onChange(text);
    filter(text);
  }

  function handleSelect(option: CityOption) {
    setInputValue(option.value);
    onChange(option.value);
    setSuggestions([]);
    setOpen(false);
  }

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <Input
        value={inputValue}
        onChange={handleInput}
        placeholder={loading ? "Carregando cidades..." : placeholder}
        disabled={loading}
        className={cn(error && "border-red-500", className)}
        autoComplete="off"
      />
      {open && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
          {suggestions.map((opt) => (
            <li
              key={opt.value}
              onMouseDown={() => handleSelect(opt)}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-[#F8BBD9]/40 hover:text-[#C2185B] transition-colors"
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
