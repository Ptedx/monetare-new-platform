import { useRoute } from "wouter";
import { ArrowLeft, BookOpen, Clock, FileType, Download } from "lucide-react";
import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";

// Shared/Simulated Data
const tutoriais = [
    {
        id: 1,
        title: "Criação da Carta Consulta",
        category: "Sistema",
        time: "4 min",
        img: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Subindo propostas agro",
        category: "Sistema",
        time: "4 min",
        img: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Subindo propostas corporate",
        category: "Sistema",
        time: "4 min",
        img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 4,
        title: "Subindo propostas varejo",
        category: "Sistema",
        time: "4 min",
        img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 5,
        title: "Dicas FNO",
        category: "Dicas",
        time: "4 min",
        img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 6,
        title: "Normas para FDA",
        category: "Normativo",
        time: "4 min",
        img: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 7,
        title: "Como qualificar um cliente",
        category: "Atendimento",
        time: "4 min",
        img: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 8,
        title: "Tudo sobre simulação",
        category: "Atendimento",
        time: "4 min",
        img: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?q=80&w=600&auto=format&fit=crop"
    }
];

export function AprenderArticle() {
    const [, params] = useRoute("/aprender/:id");
    const articleId = params?.id ? parseInt(params.id, 10) : 1;

    // Find the actual tutorial
    const tutorial = tutoriais.find(t => t.id === articleId) || tutoriais[0];

    // Details from matched tutorial
    const articleTitle = tutorial.title;
    const articleTime = tutorial.time;
    const categorySystem = tutorial.category;
    const articleImage = tutorial.img;
    const userName = "Projetista";

    // Mock document body blocks
    const topics = [
        { id: "intro", title: "Introdução" },
        { id: "como-ajuda", title: "Como o sistema ajuda" },
        { id: "acessar", title: "Como acessar a carta-consulta" },
        { id: "preenchimento", title: "Preenchimento do documento" },
        { id: "opcoes", title: "Opções manuais" },
        { id: "conclusao", title: "Conclusão" },
        { id: "anexos", title: "Anexos" }
    ];

    const handleScrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <Layout>
            <div className="flex-1 w-full bg-[#f8faf9] rounded-2xl shadow-sm border border-gray-100 overflow-y-auto min-h-screen pb-20">

                {/* Top Graphic Header */}
                <div className="relative w-full h-80 rounded-t-2xl overflow-hidden mb-12">
                    <div className="absolute top-6 left-6 z-10">
                        <Link href="/aprender">
                            <button className="flex items-center justify-center w-10 h-10 bg-white shadow-md rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        </Link>
                    </div>
                    <img
                        src={articleImage}
                        alt={articleTitle}
                        className="w-full h-full object-cover"
                    />
                    {/* Soft bottom fade to match the site background */}
                    <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-[#f8faf9] to-transparent" />

                    {/* Article Meta Data over the graphic fade */}
                    <div className="absolute bottom-12 left-12 lg:left-20 text-gray-900 max-w-2xl">
                        <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-4">
                            {articleTitle}
                        </h1>
                        <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                <span>{articleTime}</span>
                            </div>
                            <div>{categorySystem}</div>
                            <div>{userName}</div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="max-w-[1200px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-4 gap-12 items-start relative">

                    {/* Left Sidebar Table of Contents (Sticky) */}
                    <aside className="hidden lg:block lg:col-span-1 sticky top-8">
                        <div className="bg-[#f0f4f1] rounded-2xl p-5 border border-gray-100 text-[13px] font-medium text-gray-500 space-y-3">
                            {topics.map((topic, idx) => (
                                <div
                                    key={topic.id}
                                    className={`cursor-pointer transition-colors hover:text-gray-900 ${idx === 0 ? "text-gray-900 font-semibold" : ""}`}
                                    onClick={() => handleScrollTo(topic.id)}
                                >
                                    {topic.title}
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* Right Article Scroll View */}
                    <main className="lg:col-span-3 text-gray-800 text-[15px] leading-relaxed space-y-12">

                        <section id="intro">
                            <p className="mb-4">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut fringilla egestas dui,
                                pharetra aliquet enim feugiat vel. Integer auctor diam non quam iaculis, eu viverra
                                neque volutpat. Vestibulum sed sodales mi. Nulla ac porta tortor. Quisque tincidunt nulla
                                et libero varius, quis pulvinar nibh vestibulum. Aenean auctor quis sapien et faucibus.
                                Pellentesque sed sagittis enim. Nunc semper ligula massa, sed cursus quam aliquam ac.
                                Nulla facilisi. Proin volutpat convallis leo vitae viverra.
                            </p>
                            <p>
                                Donec accumsan quam nulla, id luctus dui iaculis vel. Suspendisse ultricies dolor posuere
                                interdum semper. Orci varius natoque penatibus et magnis dis parturient montes, nascetur
                                ridiculus mus. Nam ut laoreet elit. Vivamus sit amet magna justo. Mauris eleifend, sapien ut
                                suscipit sollicitudin, orci magna tempus sem, non luctus nisi est vitae ex. Aenean gravida,
                                libero eu iaculis dignissim, lorem lorem ultrices lorem, sed rutrum nulla libero sit amet dolor.
                                Nunc pharetra leo ut arcu condimentum condimentum. Sed eget hendrerit dolor. Praesent vitae
                                enim quam. Praesent vel pharetra nibh, et ultricies justo. In vel ullamcorper nibh.
                            </p>
                        </section>

                        <section id="como-ajuda">
                            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm my-8">
                                <h3 className="font-semibold text-gray-900 mb-4 text-base">2. IDENTIFICAÇÃO DA EMPRESA:</h3>
                                <ul className="space-y-3 pl-4 text-sm font-medium text-gray-700">
                                    <li>2.1. RAZÃO SOCIAL:</li>
                                    <li>2.2. CNPJ:</li>
                                    <li>2.3. ENDEREÇO DA SEDE:</li>
                                    <li>2.4. TELEFONES:</li>
                                    <li>2.5. ATIVIDADE ECONÔMICA:</li>
                                    <li>2.6. DATA DA CONSTITUIÇÃO:</li>
                                </ul>
                            </div>

                            <p>
                                Praesent tincidunt bibendum erat, in interdum mauris convallis maximus. Mauris in tristique mi,
                                eu fermentum dolor. Duis condimentum imperdiet maximus. Donec ligula libero, consectetur in
                                venenatis a, egestas vel turpis. Nunc nec neque ac orci sagittis accumsan at placerat diam.
                                Donec mollis odio eu tincidunt iaculis. Aenean varius neque tincidunt, maximus lacus a,
                                pulvinar urna. Sed id vehicula tellus, sit amet rutrum ligula. Donec convallis aliquet pretium.
                                Nam ultricies leo ut ipsum semper, vel condimentum urna ornare. Vestibulum eget diam turpis.
                            </p>
                        </section>

                        <section id="acessar">
                            {/* Simulated UI Mockup image or gray box inside the article */}
                            <div className="w-full bg-gray-100 rounded-2xl border border-gray-200 h-64 md:h-80 my-8 flex items-center justify-center relative overflow-hidden">
                                {/* Visual representation of an interface */}
                                <div className="absolute inset-x-8 top-12 bg-white rounded-xl shadow-lg border border-gray-200 h-96 p-6">
                                    <div className="w-32 h-8 bg-[#92dc49] rounded-full float-right flex items-center justify-center text-white font-medium text-xs mb-6">
                                        Ações
                                    </div>
                                    <div className="clear-both" />
                                    <div className="w-48 h-10 bg-gray-100 rounded md mb-3 flex items-center px-4 text-sm text-gray-600 font-medium ml-auto">
                                        Gerar Carta Consulta
                                    </div>
                                    <div className="w-48 h-10 border border-red-200 rounded md flex items-center px-4 text-sm text-red-600 font-medium ml-auto">
                                        Cancelar proposta
                                    </div>
                                </div>
                            </div>

                            <p className="mb-4">
                                Curabitur facilisis tristique eleifend. Vestibulum porttitor laoreet placerat. Maecenas
                                vitae leo metus. Maecenas ut posuere tellus. Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Maecenas sed lorem at ex convallis rutrum. Maecenas vel neque urna.
                                Duis sit amet vestibulum nibh. Praesent malesuada sollicitudin laoreet. Etiam ex urna,
                                sagittis vel ornare eu, ultricies vitae nulla. Vestibulum finibus maximus ipsum sit amet
                                sodales. Nunc purus leo, fringilla nec rhoncus quis, lacinia a nisi.
                            </p>

                            <p className="mb-4">
                                Nam tortor massa, facilisis at tincidunt ut, elementum quis nunc. Donec hendrerit tincidunt
                                mauris in volutpat. Fusce diam sem, posuere non ante at, tincidunt volutpat quam. Vivamus
                                elit quam, sagittis at lobortis id, feugiat vitae purus. Curabitur venenatis purus vel
                                faucibus pharetra. Maecenas ac lectus vulputate, ornare ante eget, varius lorem.
                                Nulla tincidunt augue eu felis congue hendrerit. Ut a dapibus purus, id porta arcu.
                                Nunc gravida dignissim leo vel fringilla. Vestibulum dictum et urna quis sollicitudin.
                                In leo sem, convallis quis sapien fringilla, maximus ultricies lectus.
                            </p>

                            <p>
                                Ut scelerisque posuere viverra. Sed elit ex, interdum sed varius vitae, aliquam in nisi.
                                Fusce id venenatis tellus. Sed eu ligula ac mi fringilla dignissim vel non enim. Cras id
                                erat eleifend, iaculis mauris eget, mollis libero. Nulla sit amet augue in quam rhoncus
                                vestibulum. Nam bibendum neque sit amet quam semper egestas. Nulla in magna maximus,
                                dictum velit at, sagittis urna. Interdum et malesuada fames ac ante ipsum primis in
                                faucibus. Donec lobortis ligula ac erat pellentesque aliquet. Nam ante arcu, dignissim
                                vitae posuere vel, convallis eget lacus. Integer pharetra ut quam interdum pellentesque.
                                Vivamus tincidunt rutrum purus, id porttitor erat.
                            </p>
                        </section>

                        <section id="anexos" className="pt-8">
                            <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-4">Anexos</h3>

                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-3 pr-5 hover:border-[#92dc49] transition-colors cursor-pointer w-72">
                                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                                        <FileType className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-900 leading-tight">Roteiro da Carta Consulta</p>
                                        <p className="text-xs text-gray-400 mt-0.5">27/01/22</p>
                                    </div>
                                    <Download className="w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                        </section>

                    </main>
                </div>
            </div>
        </Layout>
    );
}
