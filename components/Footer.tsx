import Link from "next/link";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#C2185B] fill-[#C2185B]" />
              <span className="text-white font-bold text-lg">GarotasVip</span>
            </div>
            <p className="text-sm leading-relaxed">
              Plataforma adulta com perfis verificados, avaliações reais e total segurança.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm">Plataforma</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/perfis" className="hover:text-[#F8BBD9] transition-colors">
                  Encontrar acompanhantes
                </Link>
              </li>
              <li>
                <Link href="/cadastro" className="hover:text-[#F8BBD9] transition-colors">
                  Anunciar perfil
                </Link>
              </li>
              <li>
                <Link href="/dashboard/premium" className="hover:text-[#F8BBD9] transition-colors">
                  Planos premium
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/termos" className="hover:text-[#F8BBD9] transition-colors">
                  Termos de uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="hover:text-[#F8BBD9] transition-colors">
                  Política de privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© {new Date().getFullYear()} GarotasVip. Todos os direitos reservados.</p>
          <p className="text-center text-gray-600">
            Plataforma destinada exclusivamente a maiores de 18 anos.
          </p>
        </div>
      </div>
    </footer>
  );
}
