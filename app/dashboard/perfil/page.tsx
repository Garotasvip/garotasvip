"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase";
import { upsertProfile } from "@/lib/mutations";
import { CityAutocomplete } from "@/components/CityAutocomplete";
import { slugify } from "@/lib/utils";

const DAYS = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"] as const;
const DAYS_LABEL: Record<string, string> = {
  seg: "Seg", ter: "Ter", qua: "Qua", qui: "Qui",
  sex: "Sex", sab: "Sáb", dom: "Dom",
};

const schema = z.object({
  displayName: z.string().min(2, "Mínimo 2 caracteres"),
  city: z.string().min(2, "Informe a cidade"),
  description: z.string().max(1000).optional(),
  priceFrom: z.string().optional(),
  priceTo: z.string().optional(),
  whatsappNumber: z.string().min(10, "Número inválido (mínimo 10 dígitos)").max(15).optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

export default function EditarPerfilPage() {
  const [saving, setSaving] = useState(false);
  const [services, setServices] = useState<string[]>([]);
  const [newService, setNewService] = useState("");
  const [availability, setAvailability] = useState<Record<string, string>>(
    Object.fromEntries(DAYS.map((d) => [d, ""]))
  );
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profileExists, setProfileExists] = useState(false);

  const { register, handleSubmit, reset, watch, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: "",
      city: "",
      description: "",
      priceFrom: "",
      priceTo: "",
      whatsappNumber: "",
    },
  });

  const description = watch("description") ?? "";

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      setUserEmail(user.email ?? null);

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setProfileExists(true);
        reset({
          displayName: data.display_name ?? "",
          city: data.city ?? "",
          description: data.description ?? "",
          priceFrom: data.price_from ? String(data.price_from) : "",
          priceTo: data.price_to ? String(data.price_to) : "",
          whatsappNumber: data.whatsapp_number ?? "",
        });
        setServices(data.services ?? []);
        if (data.availability) {
          setAvailability({ ...Object.fromEntries(DAYS.map((d) => [d, ""])), ...(data.availability as Record<string, string>) });
        }
      }
    }
    loadProfile();
  }, [reset]);

  function addService() {
    const s = newService.trim();
    if (s && !services.includes(s) && services.length < 15) {
      setServices((prev) => [...prev, s]);
      setNewService("");
    }
  }

  async function onSubmit(data: FormData) {
    if (!userId) {
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }
    setSaving(true);

    const payload: Record<string, unknown> = {
      display_name: data.displayName,
      city: data.city,
      description: data.description ?? null,
      price_from: data.priceFrom ? parseFloat(data.priceFrom) : null,
      price_to: data.priceTo ? parseFloat(data.priceTo) : null,
      whatsapp_number: data.whatsappNumber || null,
      services,
      availability,
    };

    if (!profileExists) {
      payload.slug = slugify(data.displayName) + "-" + userId.slice(0, 8);
      payload.status = "pending";
    }

    const { error } = await upsertProfile(userId, payload);
    setSaving(false);

    if (error) {
      toast.error("Erro ao salvar perfil. Tente novamente.");
    } else {
      setProfileExists(true);
      toast.success("Perfil salvo com sucesso!");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Editar Perfil</h1>
        <p className="text-muted-foreground text-sm mt-1">Mantenha suas informações sempre atualizadas.</p>
        {userEmail && (
          <div className="mt-2 inline-flex items-center gap-2 bg-[#F8BBD9]/30 text-[#C2185B] text-sm font-medium px-3 py-1.5 rounded-full">
            <span className="text-xs text-gray-500">Conta:</span>
            {userEmail}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Informações básicas */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <h2 className="font-semibold text-gray-900">Informações básicas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Nome de exibição</Label>
              <Input {...register("displayName")} className={errors.displayName ? "border-red-500" : ""} />
              {errors.displayName && <p className="text-red-500 text-xs">{errors.displayName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Cidade</Label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <CityAutocomplete
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.city}
                  />
                )}
              />
              {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>Descrição</Label>
              <span className="text-xs text-muted-foreground">{description.length}/1000</span>
            </div>
            <Textarea placeholder="Fale sobre você..." rows={5} {...register("description")} />
          </div>
          <div className="space-y-1.5">
            <Label>WhatsApp</Label>
            <Input placeholder="11999999999" {...register("whatsappNumber")} className={errors.whatsappNumber ? "border-red-500" : ""} />
            {errors.whatsappNumber && <p className="text-red-500 text-xs">{errors.whatsappNumber.message}</p>}
            <p className="text-xs text-muted-foreground">Apenas números com DDD. Ex: 11999999999</p>
          </div>
        </div>

        {/* Preço */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Faixa de preço (R$)</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Valor mínimo</Label>
              <Input type="number" min={0} placeholder="Ex: 150" {...register("priceFrom")} />
            </div>
            <div className="space-y-1.5">
              <Label>Valor máximo</Label>
              <Input type="number" min={0} placeholder="Ex: 500" {...register("priceTo")} />
            </div>
          </div>
        </div>

        {/* Serviços */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Serviços oferecidos</h2>
          <div className="flex gap-2">
            <Input
              placeholder="Ex: Jantares, Viagens..."
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addService(); } }}
            />
            <Button type="button" variant="outline" onClick={addService} className="border-[#C2185B] text-[#C2185B]">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {services.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {services.map((s) => (
                <span key={s} className="flex items-center gap-1.5 bg-[#F8BBD9]/40 text-[#C2185B] text-sm rounded-full px-3 py-1">
                  {s}
                  <button type="button" onClick={() => setServices((prev) => prev.filter((x) => x !== s))} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Disponibilidade */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Disponibilidade</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DAYS.map((day) => (
              <div key={day} className="flex items-center gap-3">
                <span className="w-10 text-sm font-medium text-gray-700 flex-shrink-0">{DAYS_LABEL[day]}</span>
                <Input
                  placeholder="Ex: 09:00–22:00"
                  value={availability[day] ?? ""}
                  onChange={(e) => setAvailability((prev) => ({ ...prev, [day]: e.target.value }))}
                  className="text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button type="submit" className="ml-auto bg-[#C2185B] hover:bg-[#C2185B]/90 text-white gap-2" disabled={saving}>
            <Save className="w-4 h-4" />
            {saving ? "Salvando..." : "Salvar perfil"}
          </Button>
        </div>
      </form>
    </div>
  );
}
