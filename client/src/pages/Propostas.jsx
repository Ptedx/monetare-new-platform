import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { ProposalList } from "@/components/proposals/ProposalList";
import { ProposalDetail } from "@/components/proposals/ProposalDetail";

export function Propostas() {
  const [selectedProposal, setSelectedProposal] = useState(null);
  const userRole = localStorage.getItem('userRole');

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
          userRole={userRole}
        />
      )}
    </Layout>
  );
}
