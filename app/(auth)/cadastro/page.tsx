"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { createClient } from "@/lib/supabase";
import { slugify } from "@/lib/utils";

const schema = z
  .object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
    confirmPassword: z.string(),
    isAdult: z.boolean().refine((v) => v === true, {
      message: "Você precisa confirmar que tem 18 anos ou mais",
    }),
    acceptTerms: z.boolean().refine((v) => v === true, {
      message: "Você precisa aceitar os termos de uso",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function CadastroPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } =
    useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: { isAdult: false, acceptTerms: false },
    });

  const isAdult = watch("isAdult");
  const acceptTerms = watch("acceptTerms");

  async function onSubmit(data: FormData) {
    setLoading(true);
    setServerError("");

    const supabase = createClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { display_name: data.name },
      },
    });

    if (authError) {
      setServerError(
        authError.message === "User already registered"
          ? "Este e-mail já está cadastrado."
          : "Erro ao criar conta. Tente novamente."
      );
      setLoading(false);
      return;
    }

    if (authData.user) {
      const slug = slugify(data.name) + "-" + Math.random().toString(36).slice(2, 6);
      await supabase.from("profiles").insert({
        user_id: authData.user.id,
        display_name: data.name,
        slug,
        status: "pending",
      });
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8BBD9]/30 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Heart className="w-8 h-8 text-[#C2185B] fill-[#C2185B]" />
            <span className="text-2xl font-bold text-[#C2185B]">GarotasVip</span>
          </Link>
          <p className="text-muted-foreground mt-2 text-sm">
            Crie sua conta gratuitamente
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-xl font-bold mb-6">Criar conta</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Nome */}
            <div className="space-y-1.5">
              <Label htmlFor="name">Nome de exibição</Label>
              <Input
                id="name"
                placeholder="Como quer ser chamada"
                {...register("name")}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name.message}</p>
              )}
            </div>

            {/* E-mail */}
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                autoComplete="email"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>

            {/* Senha */}
            <div className="space-y-1.5">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  autoComplete="new-password"
                  {...register("password")}
                  className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password.message}</p>
              )}
            </div>

            {/* Confirmar senha */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repita a senha"
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                  className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Checkbox maioridade */}
            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="isAdult"
                  checked={isAdult}
                  onCheckedChange={(v) => setValue("isAdult", !!v)}
                  className="mt-0.5 border-[#C2185B] data-[state=checked]:bg-[#C2185B] data-[state=checked]:border-[#C2185B]"
                />
                <Label htmlFor="isAdult" className="text-sm leading-snug cursor-pointer font-normal">
                  Confirmo que tenho <strong>18 anos ou mais</strong>
                </Label>
              </div>
              {errors.isAdult && (
                <p className="text-red-500 text-xs">{errors.isAdult.message}</p>
              )}

              {/* Checkbox termos */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="acceptTerms"
                  checked={acceptTerms}
                  onCheckedChange={(v) => setValue("acceptTerms", !!v)}
                  className="mt-0.5 border-[#C2185B] data-[state=checked]:bg-[#C2185B] data-[state=checked]:border-[#C2185B]"
                />
                <Label htmlFor="acceptTerms" className="text-sm leading-snug cursor-pointer font-normal">
                  Li e aceito os{" "}
                  <Link href="/termos" className="text-[#C2185B] hover:underline" target="_blank">
                    Termos de Uso
                  </Link>{" "}
                  e a{" "}
                  <Link href="/privacidade" className="text-[#C2185B] hover:underline" target="_blank">
                    Política de Privacidade
                  </Link>
                </Label>
              </div>
              {errors.acceptTerms && (
                <p className="text-red-500 text-xs">{errors.acceptTerms.message}</p>
              )}
            </div>

            {/* Erro servidor */}
            {serverError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{serverError}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-[#C2185B] hover:bg-[#C2185B]/90 text-white"
              disabled={loading}
            >
              {loading ? "Criando conta..." : "Criar conta"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Já tem conta?{" "}
            <Link href="/login" className="text-[#C2185B] font-medium hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
