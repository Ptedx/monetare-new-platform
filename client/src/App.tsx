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
// @ts-ignore
import { Cobranca } from "@/pages/Cobranca";
// @ts-ignore
import { CobrancaDetail } from "@/pages/CobrancaDetail";
// @ts-ignore
import { Seguros } from "@/pages/Seguros";
// @ts-ignore
import { CotacaoSeguro } from "@/pages/CotacaoSeguro";
// @ts-ignore
import { SeguroDetail } from "@/pages/SeguroDetail";
import { Canais } from "@/pages/Canais";
import { Visitas } from "@/pages/Visitas";
import { Aprender } from "@/pages/Aprender";
import { AprenderArticle } from "@/pages/AprenderArticle";

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
      <Route path="/cobranca" component={Cobranca} />
      <Route path="/cobranca/:id" component={CobrancaDetail} />
      <Route path="/canais" component={Canais} />
      <Route path="/visitas" component={Visitas} />
      <Route path="/seguros" component={Seguros} />
      <Route path="/cotacao-seguro" component={CotacaoSeguro} />
      <Route path="/seguros/:id" component={SeguroDetail} />
      <Route path="/aprender" component={Aprender} />
      <Route path="/aprender/:id" component={AprenderArticle} />
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
