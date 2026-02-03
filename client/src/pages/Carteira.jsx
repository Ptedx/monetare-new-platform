import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Carteira() {
    return (
        <Layout>
            <div className="p-8 h-[calc(100vh-64px)] flex flex-col pt-0">
                <div className="flex items-center justify-between py-6">
                    <h1 className="text-4xl font-bold">Carteira</h1>
                </div>

                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Minha Carteira de Clientes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-500">
                                Visualização da carteira disponível para Analistas e Projetistas.
                                (Feature em desenvolvimento)
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
