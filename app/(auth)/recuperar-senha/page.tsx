"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Heart, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase";

const schema = z.object({
  email: z.string().email("E-mail inválido"),
});

type FormData = z.infer<typeof schema>;

export default function RecuperarSenhaPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setLoading(true);
    setServerError("");

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/senha`,
    });

    if (error) {
      setServerError("Erro ao enviar e-mail. Tente novamente.");
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
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
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {sent ? (
            // Estado de sucesso
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              </div>
              <h1 className="text-xl font-bold">E-mail enviado!</h1>
              <p className="text-muted-foreground text-sm">
                Verifique sua caixa de entrada e clique no link para redefinir sua senha.
              </p>
              <Link href="/login">
                <Button variant="outline" className="w-full mt-2">
                  Voltar para o login
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <Link href="/login" className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-xl font-bold">Recuperar senha</h1>
              </div>

              <p className="text-muted-foreground text-sm mb-6">
                Digite seu e-mail e enviaremos um link para redefinir sua senha.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  {loading ? "Enviando..." : "Enviar link de recuperação"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
