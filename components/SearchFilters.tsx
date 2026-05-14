"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CityAutocomplete } from "@/components/CityAutocomplete";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

interface FilterValues {
  city: string;
  priceMin: string;
  priceMax: string;
  ratingMin: string;
  premium: boolean;
}

function FiltersForm({
  onApply,
  onClose,
}: {
  onApply: (values: FilterValues) => void;
  onClose?: () => void;
}) {
  const searchParams = useSearchParams();

  const { register, handleSubmit, reset, watch, control } = useForm<FilterValues>({
    defaultValues: {
      city: searchParams.get("city") ?? "",
      priceMin: searchParams.get("priceMin") ?? "",
      priceMax: searchParams.get("priceMax") ?? "",
      ratingMin: searchParams.get("ratingMin") ?? "",
      premium: searchParams.get("premium") === "true",
    },
  });

  function onSubmit(values: FilterValues) {
    onApply(values);
    onClose?.();
  }

  function onReset() {
    reset({ city: "", priceMin: "", priceMax: "", ratingMin: "", premium: false });
    onApply({ city: "", priceMin: "", priceMax: "", ratingMin: "", premium: false });
    onClose?.();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Cidade */}
      <div className="space-y-1.5">
        <Label>Cidade</Label>
        <Controller
          name="city"
          control={control}
          render={({ field }) => (
            <CityAutocomplete
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      {/* Faixa de preço */}
      <div className="space-y-1.5">
        <Label>Faixa de preço (R$)</Label>
        <div className="flex gap-2">
          <Input placeholder="Mínimo" type="number" min={0} {...register("priceMin")} />
          <Input placeholder="Máximo" type="number" min={0} {...register("priceMax")} />
        </div>
      </div>

      {/* Avaliação mínima */}
      <div className="space-y-1.5">
        <Label>Avaliação mínima</Label>
        <div className="flex gap-2">
          {[0, 3, 4, 5].map((v) => (
            <label key={v} className="flex-1">
              <input type="radio" value={v} {...register("ratingMin")} className="sr-only" />
              <div
                className={`border rounded-lg py-1.5 text-center text-sm cursor-pointer transition-colors
                  ${watch("ratingMin") === String(v)
                    ? "bg-[#C2185B] text-white border-[#C2185B]"
                    : "border-gray-200 hover:border-[#C2185B] text-muted-foreground"
                  }`}
              >
                {v === 0 ? "Todas" : `${v}★+`}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Somente premium */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" {...register("premium")} className="sr-only" />
        <div
          className={`w-10 h-6 rounded-full transition-colors relative ${
            watch("premium") ? "bg-[#C2185B]" : "bg-gray-200"
          }`}
        >
          <div
            className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
              watch("premium") ? "translate-x-5" : "translate-x-1"
            }`}
          />
        </div>
        <span className="text-sm font-medium">Somente Premium</span>
      </label>

      {/* Botões */}
      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onReset}
        >
          Limpar
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-[#C2185B] hover:bg-[#C2185B]/90 text-white"
        >
          Aplicar
        </Button>
      </div>
    </form>
  );
}

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sheetOpen, setSheetOpen] = useState(false);

  const activeCount = [
    searchParams.get("city"),
    searchParams.get("priceMin"),
    searchParams.get("priceMax"),
    searchParams.get("ratingMin"),
    searchParams.get("premium"),
  ].filter(Boolean).length;

  function applyFilters(values: FilterValues) {
    const params = new URLSearchParams();
    if (values.city) params.set("city", values.city);
    if (values.priceMin) params.set("priceMin", values.priceMin);
    if (values.priceMax) params.set("priceMax", values.priceMax);
    if (values.ratingMin && values.ratingMin !== "0") params.set("ratingMin", values.ratingMin);
    if (values.premium) params.set("premium", "true");
    params.set("page", "1");
    router.push(`/perfis?${params.toString()}`);
  }

  return (
    <>
      {/* Desktop: painel lateral */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-24">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-gray-900">Filtros</h3>
            {activeCount > 0 && (
              <span className="text-xs bg-[#C2185B] text-white rounded-full px-2 py-0.5">
                {activeCount}
              </span>
            )}
          </div>
          <FiltersForm onApply={applyFilters} />
        </div>
      </aside>

      {/* Mobile: botão + sheet */}
      <div className="lg:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-[#C2185B] text-[#C2185B]"
              type="button"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
              {activeCount > 0 && (
                <span className="bg-[#C2185B] text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {activeCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto">
            <SheetHeader className="mb-4">
              <SheetTitle>Filtros</SheetTitle>
            </SheetHeader>
            <FiltersForm onApply={applyFilters} onClose={() => setSheetOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
