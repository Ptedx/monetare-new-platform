import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowRight, Home, LayoutDashboard, Calculator, UserPlus, Info } from "lucide-react";

export function LandingPage() {
  const [, setLocation] = useLocation();
  return (
    <div className="min-h-screen bg-white">
      {/* Header / Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 h-20 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#92dc49] rounded-lg flex items-center justify-center">
            <LayoutDashboard className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tighter text-gray-900 leading-none">BANCO DA</span>
            <span className="text-xl font-bold tracking-tighter text-[#92dc49] leading-none">AMAZÔNIA</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            className="hidden md:flex rounded-full border-[#92dc49] text-[#7ab635] hover:bg-[#92dc49]/10 h-11 px-6"
            onClick={() => {
              const user = localStorage.getItem('user');
              if (user) setLocation('/propostas');
              else setLocation('/login');
            }}
          >
            Acessar propostas
          </Button>
          <Link href="/registro">
            <Button className="rounded-full bg-[#1e293b] hover:bg-[#0f172a] text-white h-11 px-8 shadow-lg shadow-gray-200">
              Cadastrar-se
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 md:px-12 overflow-hidden bg-gradient-to-br from-[#92dc49]/10 via-white to-[#7ab635]/5">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                Conte o que você precisa. <br />
                <span className="text-[#92dc49]">A gente encontra a melhor solução.</span>
              </h1>
              <p className="text-lg text-gray-500 max-w-lg leading-relaxed">
                Vamos te guiar em cada etapa, do diagnóstico ao <span className="font-semibold text-gray-900 italic">crédito aprovado</span>.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/solicitar-credito">
                <Button className="rounded-full bg-[#92dc49] hover:bg-[#7ab635] text-white h-14 px-10 text-lg font-bold shadow-xl shadow-[#92dc49]/30 transition-transform hover:scale-105 active:scale-95">
                  Solicitar crédito
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="rounded-full border-gray-300 text-gray-700 hover:bg-gray-50 h-14 px-10 text-lg font-semibold border-2">
                  Já possuo cadastro
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
             <div className="absolute inset-0 bg-[#92dc49]/20 rounded-3xl blur-3xl -z-10 transform rotate-6 scale-90"></div>
             <div className="bg-white p-3 rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden">
                <img 
                  src="/images/landing_hero_bg.png" 
                  alt="Banco da Amazônia Hero" 
                  className="w-full h-auto rounded-[24px] object-cover aspect-[4/3]"
                />
             </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-24 px-6 md:px-12 bg-gray-50">
        <div className="container mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Conheça os produtos do Banco da Amazônia
            </h2>
            <div className="w-20 h-1.5 bg-[#92dc49] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Product Card 1 */}
            <ProductCard 
              image="/images/product_rural_credit.png"
              title="Crédito rural até R$ 5 milhões"
              description="Financiamento completo para todas as etapas de produção."
            />
            {/* Product Card 2 */}
            <ProductCard 
              image="/images/product_investment.png"
              title="Investimento com taxas a partir de 7% a.a."
              description="Invista em infraestrutura e tecnologia para seu negócio crescer."
            />
            {/* Product Card 3 */}
            <ProductCard 
              image="/images/product_capital_giro.png"
              title="Capital de Giro"
              description="Mantenha seu caixa saudável e aproveite oportunidades."
            />
            {/* Product Card 4 */}
            <ProductCard 
              image="/images/product_small_producers.png"
              title="Pequenos produtores"
              description="Apoio financeiro para pequenos produtores familiares."
            />
            {/* Product Card 5 */}
            <ProductCard 
              image="/images/product_custeio_agricola.png"
              title="Custeio Agrícola"
              description="Financiamento completo para todas as etapas de produção."
            />
          </div>

          <div className="text-center pt-8">
            <p className="text-gray-500 font-medium flex items-center justify-center gap-2">
              Não sabe o que escolher? Acesse nosso 
              <Link href="/solicitar-credito" className="text-[#92dc49] hover:underline font-bold flex items-center gap-1">
                Simulador <ArrowRight className="w-4 h-4" />
              </Link> 
              e descubra a melhor opção para você.
            </p>
          </div>
        </div>
      </section>

      {/* Footer copyright */}
      <footer className="py-12 px-6 border-t border-gray-100 bg-white">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="text-white w-5 h-5" />
            </div>
            <span className="font-bold tracking-tighter text-gray-900">BANCO DA AMAZÔNIA</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2026 Monetare. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

function ProductCard({ image, title, description }) {
  return (
    <div className="bg-white rounded-[24px] overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col group transition-all hover:shadow-2xl hover:-translate-y-1">
      <div className="h-48 overflow-hidden relative">
        <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
      <div className="p-8 flex-1 flex flex-col space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-gray-900 leading-tight">{title}</h3>
            <Link href="/solicitar-credito" className="text-gray-400 hover:text-[#92dc49] transition-colors pt-1">
              <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1">Saiba mais <ArrowRight className="w-3 h-3" /></span>
            </Link>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            {description}
          </p>
        </div>
        <div className="pt-4 mt-auto">
          <Link href="/solicitar-credito">
            <Button className="w-full rounded-full bg-[#92dc49] hover:bg-[#7ab635] text-white font-bold h-11 transition-all group-hover:scale-[1.02]">
              Simular
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

