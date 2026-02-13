import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail, ChevronRight, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";

export function Login() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await apiRequest("POST", "/api/auth/login", {
        email: email.toLowerCase().trim(),
        password,
      });
      const user = await res.json();
      queryClient.setQueryData(["/api/auth/me"], user);

      if (user.role === 'cliente') {
        setLocation("/propostas");
      } else {
        setLocation("/dashboard");
      }
    } catch (err) {
      setError(err.message?.includes("401") ? "Email ou senha incorretos." : "Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1628160424522-8692793b890a?q=80&w=2574&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#7ab635]/90 to-[#92dc49]/70 mixing-blend-multiply"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full min-h-[600px]">
        <div className="hidden lg:flex flex-col text-white space-y-6">
          <div>
            <div className="flex items-end gap-3 mb-2">
              <h1 className="text-7xl font-bold tracking-tighter">S.I.G.A</h1>
            </div>
            <p className="text-2xl font-light text-white/90">
              Sistema Integrado <br /> de Gestão Amazônica
            </p>
          </div>
          <div className="w-16 h-1 bg-white/50 rounded-full my-6"></div>
          <p className="text-white/80 text-lg max-w-md leading-relaxed">
            Plataforma completa para análise de crédito, monitoramento de garantias e gestão de projetos rurais e corporativos.
          </p>
        </div>

        <div className="flex justify-center lg:justify-end w-full">
          <Card className="w-full max-w-md bg-white border-0 shadow-2xl rounded-3xl p-8 md:p-10 backdrop-blur-sm bg-white/95">
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight" data-testid="text-login-title">Bem-vindo(a) de volta.</h2>
                <p className="text-gray-500">Insira suas credenciais para acessar sua conta.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5 md:space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">E-mail</Label>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded bg-gray-100 text-gray-500 group-focus-within:bg-[#92dc49]/10 group-focus-within:text-[#92dc49] transition-colors">
                        <Mail className="w-4 h-4" />
                      </div>
                      <Input
                        id="email"
                        data-testid="input-email"
                        type="email"
                        placeholder="nome@empresa.com.br"
                        className="pl-12 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#92dc49] focus:ring-[#92dc49]/20 transition-all rounded-xl"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-gray-700 font-medium">Senha</Label>
                    </div>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded bg-gray-100 text-gray-500 group-focus-within:bg-[#92dc49]/10 group-focus-within:text-[#92dc49] transition-colors">
                        <Lock className="w-4 h-4" />
                      </div>
                      <Input
                        id="password"
                        data-testid="input-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-12 pr-10 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#92dc49] focus:ring-[#92dc49]/20 transition-all rounded-xl"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                        data-testid="button-toggle-password"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-in slide-in-from-top-2" data-testid="text-login-error">
                    {error}
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    data-testid="button-login"
                    className="w-full h-12 bg-[#92dc49] hover:bg-[#7ab635] text-white font-bold text-lg rounded-full shadow-lg shadow-[#92dc49]/40 transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>Entrar <ChevronRight className="w-5 h-5" /></>
                    )}
                  </Button>
                </div>

                <div className="flex justify-between items-center pt-2 flex-wrap gap-2">
                  <p className="text-xs text-gray-500 font-medium">
                    Perdeu seu acesso? <a href="#" className="underline hover:text-[#7ab635]">Entre em contato.</a>
                  </p>
                  <Link href="/registro">
                    <span className="text-xs text-[#7ab635] font-semibold hover:underline cursor-pointer" data-testid="link-register">
                      Criar conta
                    </span>
                  </Link>
                </div>
              </form>
            </div>
          </Card>
        </div>
      </div>

      <div className="absolute bottom-4 left-0 right-0 text-center z-10 text-white/50 text-xs">
        &copy; 2026 Monetare. Todos os direitos reservados.
      </div>
    </div>
  );
}
