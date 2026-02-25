import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function Login() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = '/fundo-siga.png';
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(true); // Fallback to avoid infinite loading
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Por favor, selecione um perfil de acesso.");
      return;
    }

    const cleanEmail = email.toLowerCase().trim();

    if (cleanEmail === "gerente@gmail.com") {
      localStorage.setItem('userRole', 'gerente');
      setLocation("/dashboard");
    } else if (cleanEmail === "analista@gmail.com") {
      localStorage.setItem('userRole', 'analista');
      setLocation("/dashboard");
    } else if (cleanEmail === "projetista@gmail.com") {
      localStorage.setItem('userRole', 'projetista');
      setLocation("/dashboard");
    } else if (cleanEmail === "ambregulatorio@gmail.com") {
      localStorage.setItem('userRole', 'ambregulatorio');
      setLocation("/dashboard");
    } else if (cleanEmail === "cliente@gmail.com") {
      localStorage.setItem('userRole', 'cliente');
      setLocation("/propostas");
    } else if (cleanEmail === "posvenda@gmail.com") {
      localStorage.setItem('userRole', 'posvenda');
      setLocation("/cobranca");
    } else if (cleanEmail === "gerencial@gmail.com") {
      localStorage.setItem('userRole', 'gerencial');
      setLocation("/dashboard");
    } else {
      setError("Email não reconhecido. Use: gerente@gmail.com, analista@gmail.com, projetista@gmail.com, ambregulatorio@gmail.com, cliente@gmail.com, posvenda@gmail.com ou gerencial@gmail.com");
    }
  };

  if (!imageLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 bg-opacity-90">
        <div className="w-12 h-12 border-4 border-[#92dc49] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Carregando S.I.G.A...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/fundo-siga.png')`,
        }}
      >
        {/* Gradient Overlay matching the reference (Green/Yellow tint) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#7ab635]/90 to-[#92dc49]/70 mixing-blend-multiply"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full min-h-[600px]">

        {/* Branding Section (Left) */}
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

        {/* Login Card Section (Right/Center) */}
        <div className="flex justify-center lg:justify-end w-full">
          <Card className="w-full max-w-md bg-white border-0 shadow-2xl rounded-3xl p-8 md:p-10 backdrop-blur-sm bg-white/95">
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Bem-vindo(a) de volta.</h2>
                <p className="text-gray-500">Insira suas credenciais para acessar sua conta.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5 md:space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">Conta de Acesso</Label>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded bg-gray-100 text-gray-500 z-10 group-focus-within:text-[#92dc49]">
                        <Mail className="w-4 h-4" />
                      </div>
                      <Select value={email} onValueChange={setEmail}>
                        <SelectTrigger className="pl-12 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#92dc49] focus:ring-[#92dc49]/20 transition-all rounded-xl w-full">
                          <SelectValue placeholder="Selecione um perfil de acesso" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-100 rounded-xl shadow-lg">
                          <SelectItem value="gerente@gmail.com">Gerente de Contas</SelectItem>
                          <SelectItem value="analista@gmail.com">Analista</SelectItem>
                          <SelectItem value="projetista@gmail.com">Projetista</SelectItem>
                          <SelectItem value="ambregulatorio@gmail.com">Ambiente Regulatório</SelectItem>
                          <SelectItem value="cliente@gmail.com">Cliente</SelectItem>
                          <SelectItem value="posvenda@gmail.com">Pós Venda</SelectItem>
                          <SelectItem value="gerencial@gmail.com">Gerencial</SelectItem>
                        </SelectContent>
                      </Select>
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
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-12 pr-10 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#92dc49] focus:ring-[#92dc49]/20 transition-all rounded-xl"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-in slide-in-from-top-2">
                    {error}
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full h-12 bg-[#92dc49] hover:bg-[#7ab635] text-white font-bold text-lg rounded-full shadow-lg shadow-[#92dc49]/40 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    Entrar <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <p className="text-xs text-gray-500 font-medium">Perdeu seu acesso? <a href="#" className="underline hover:text-[#7ab635]">Entre em contato.</a></p>
                </div>
              </form>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="absolute bottom-4 left-0 right-0 text-center z-10 text-white/50 text-xs">
        © 2026 Monetare. Todos os direitos reservados.
      </div>
    </div>
  );
}
