import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { ProposalList } from "@/components/proposals/ProposalList";
import { ProposalDetail } from "@/components/proposals/ProposalDetail";
import { ClientProposalDetail } from "@/components/proposals/ClientProposalDetail";
import { JuridicoProposalDetail } from "@/components/proposals/JuridicoProposalDetail";

export function Propostas() {
  const [selectedProposal, setSelectedProposal] = useState(null);
  const userRole = localStorage.getItem('userRole');
  const [location] = useLocation();

  useEffect(() => {
    // If the user clicks the "Propostas" nav link while already on the page, clear the selection
    if (location === '/propostas' && selectedProposal) {
      setSelectedProposal(null);
    }
  }, [location]);

  return (
    <Layout>
      {selectedProposal ? (
        userRole === 'cliente' ? (
          <ClientProposalDetail
            proposal={selectedProposal}
            onBack={() => setSelectedProposal(null)}
          />
        ) : userRole === 'juridico' ? (
          <JuridicoProposalDetail
            proposal={selectedProposal}
            onBack={() => setSelectedProposal(null)}
          />
        ) : (
          <ProposalDetail
            proposal={selectedProposal}
            onBack={() => setSelectedProposal(null)}
          />
        )
      ) : (
        <ProposalList
          onSelectProposal={setSelectedProposal}
          userRole={userRole}
        />
      )}
    </Layout>
  );
}
