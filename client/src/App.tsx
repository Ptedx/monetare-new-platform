import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { Pipeline } from "@/pages/Pipeline";
import { Propostas } from "@/pages/Propostas";
import { Simulador } from "@/pages/Simulador";
import { AnalisePerfil } from "@/pages/AnalisePerfil";
import { Documentacao } from "@/pages/Documentacao";
import { Historico } from "@/pages/Historico";
import { Chat } from "@/pages/Chat";
import { CadastroProposta } from "@/pages/CadastroProposta";
import { Carteira } from "@/pages/Carteira";
import { Pagamentos } from "@/pages/Pagamentos";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/pipeline" component={Pipeline} />
      <Route path="/propostas" component={Propostas} />
      <Route path="/carteira" component={Carteira} />
      <Route path="/simulador" component={Simulador} />
      <Route path="/perfil" component={AnalisePerfil} />
      <Route path="/documentacao" component={Documentacao} />
      <Route path="/historico" component={Historico} />
      <Route path="/chat" component={Chat} />
      <Route path="/cadastro-proposta" component={CadastroProposta} />
      <Route path="/pagamentos" component={Pagamentos} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
