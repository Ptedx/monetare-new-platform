import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { ProposalList } from "@/components/proposals/ProposalList";
import { ProposalDetail } from "@/components/proposals/ProposalDetail";

export function Carteira() {
    const [selectedProposal, setSelectedProposal] = useState(null);
    const userRole = localStorage.getItem('userRole');
    const [proposals, setProposals] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("proposals") || "[]");
        if (userRole === 'analista') {
            setProposals(stored.filter(p => p.status === "PENDENTE_COMITE"));
        } else {
            setProposals(stored);
        }
    }, [userRole]);

    return (
        <Layout>
            {selectedProposal ? (
                <ProposalDetail
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
