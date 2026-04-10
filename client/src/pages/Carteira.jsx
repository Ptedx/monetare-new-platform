import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { ProposalList } from "@/components/proposals/ProposalList";
import { ProposalDetail } from "@/components/proposals/ProposalDetail";

export function Carteira() {
    const [selectedProposal, setSelectedProposal] = useState(null);
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || 'gerente');
    const [proposals, setProposals] = useState([]);
    const [, setTick] = useState(0);

    useEffect(() => {
        const handler = () => {
            setUserRole(localStorage.getItem('userRole') || 'gerente');
            setTick(t => t + 1);
        };
        window.addEventListener('storage', handler);
        // Detect manual role changes via custom event too
        const onProfile = () => {
            setUserRole(localStorage.getItem('userRole') || 'gerente');
            setTick(t => t + 1);
        };
        window.addEventListener('roleChanged', onProfile);
        return () => {
            window.removeEventListener('storage', handler);
            window.removeEventListener('roleChanged', onProfile);
        };
    }, []);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("proposals") || "[]");
        if (userRole === 'analista') {
            // Same filter as PipelineBoard — shows exactly what the pipeline shows
            const skipStages = new Set([
                "EM_ANALISE_JURIDICA", "EM_SEGURO", "SEGURO_COTADO",
                "FINALIZADA", "REPROVADA", "APROVADA"
            ]);
            setProposals(stored.filter(p => !skipStages.has(p.stage)));
        } else {
            setProposals(stored);
        }
    }, [userRole]);

    return (
        <Layout>
            {selectedProposal ? (
                <ProposalDetail
                    key={selectedProposal.id + userRole}
                    proposal={selectedProposal}
                    onBack={() => setSelectedProposal(null)}
                />
            ) : (
                <ProposalList
                    onSelectProposal={setSelectedProposal}
                    title="Sua carteira"
                    userRole={userRole}
                />
            )}
        </Layout>
    );
}
