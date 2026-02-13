import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserCog, CheckCircle2, Circle } from "lucide-react";

export function Configuracoes() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [selectedRole, setSelectedRole] = useState(null);

    const { data: user, isLoading } = useQuery({
        queryKey: ["/api/auth/me"],
        onSuccess: (data) => {
            if (data && !selectedRole) {
                setSelectedRole(data.role);
            }
        }
    });

    const updateRoleMutation = useMutation({
        mutationFn: async (newRole) => {
            const res = await apiRequest("PATCH", `/api/users/${user.id}`, { role: newRole });
            return res.json();
        },
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(["/api/auth/me"], updatedUser);
            toast({
                title: "Função atualizada",
                description: `Sua conta agora é do tipo: ${updatedUser.role}`,
            });
            // Force reload to ensure all components (like Sidebar) update correctly if they don't react to query cache instantly
            window.location.reload();
        },
        onError: (error) => {
            toast({
                title: "Erro ao atualizar",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const handleSave = () => {
        if (selectedRole && selectedRole !== user.role) {
            updateRoleMutation.mutate(selectedRole);
        }
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
            </Layout>
        );
    }

    const roles = [
        { value: "cliente", label: "Cliente", description: "Acesso a Propostas, Cadastro e Documentos." },
        { value: "projetista", label: "Projetista", description: "Mesmo acesso do Cliente." },
        { value: "analista", label: "Analista", description: "Acesso a Dashboard, Pipeline, Análise de Perfil e Cockpit." },
        { value: "gerente", label: "Gerente", description: "Acesso total, incluindo ferramentas administrativas." },
        { value: "ambregulatorio", label: "Ambiente Regulatório", description: "Acesso restrito para regulação." },
    ];

    return (
        <Layout>
            <div className="p-8 max-w-4xl mx-auto">
                <div className="mb-8 flex items-center gap-3">
                    <div className="p-3 bg-gray-100 rounded-xl">
                        <UserCog className="w-8 h-8 text-gray-700" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Configurações da Conta</h1>
                </div>

                <Card className="border-none shadow-md">
                    <CardHeader>
                        <CardTitle>Tipo de Perfil</CardTitle>
                        <CardDescription>
                            Selecione o papel do usuário para simular diferentes visualizações na plataforma.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {roles.map((role) => {
                                const isSelected = (selectedRole || user?.role) === role.value;
                                return (
                                    <div
                                        key={role.value}
                                        onClick={() => setSelectedRole(role.value)}
                                        className={`
                      relative flex flex-col items-start justify-between rounded-lg border-2 p-4 cursor-pointer transition-all
                      ${isSelected
                                                ? 'border-[#92dc49] bg-[#92dc49]/5 hover:bg-[#92dc49]/10'
                                                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                            }
                    `}
                                    >
                                        <div className="flex items-center gap-3 mb-2 w-full">
                                            {isSelected ? (
                                                <CheckCircle2 className="w-5 h-5 text-[#92dc49] fill-current" />
                                            ) : (
                                                <Circle className="w-5 h-5 text-gray-300" />
                                            )}
                                            <span className={`font-semibold text-lg ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                                                {role.label}
                                            </span>
                                        </div>
                                        <span className="text-sm text-muted-foreground ml-8">
                                            {role.description}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                onClick={handleSave}
                                disabled={updateRoleMutation.isPending || selectedRole === user.role}
                                className="bg-[#92dc49] hover:bg-[#7ab635] text-black font-medium px-8"
                            >
                                {updateRoleMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Salvar Alterações
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
