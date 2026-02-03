import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Lock, User } from "lucide-react";

export function Login() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#92dc49] to-[#5a8a2a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-lg mx-auto mb-4 flex items-center justify-center">
            <span className="text-3xl font-bold text-[#92dc49]">FC</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Plataforma de Crédito</h1>
          <p className="text-white/80 mt-2">Sistema de Gestão de Propostas</p>
        </div>

        <Card className="p-8 shadow-2xl">
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <Button
                type="button"
                onClick={() => {
                  localStorage.setItem('userRole', 'gerente');
                  setLocation("/dashboard");
                }}
                className="w-full bg-[#92dc49] hover:bg-[#7ab635] text-white py-6 flex items-center gap-3"
              >
                <User className="w-5 h-5" />
                Entrar como Gerente de Contas
              </Button>

              <Button
                type="button"
                onClick={() => {
                  localStorage.setItem('userRole', 'analista');
                  setLocation("/dashboard");
                }}
                className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-6 flex items-center gap-3"
              >
                <User className="w-5 h-5" />
                Entrar como Analista
              </Button>

              <Button
                type="button"
                onClick={() => {
                  localStorage.setItem('userRole', 'projetista');
                  setLocation("/dashboard");
                }}
                className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-6 flex items-center gap-3"
              >
                <User className="w-5 h-5" />
                Entrar como Projetista
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Problemas para acessar?{" "}
              <a href="#" className="text-[#92dc49] hover:underline">
                Contate o suporte
              </a>
            </p>
          </div>
        </Card>

        <p className="text-center text-white/60 text-sm mt-6">
          © 2024 Plataforma de Crédito. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
