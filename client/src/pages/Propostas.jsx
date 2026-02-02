import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { ProposalList } from "@/components/proposals/ProposalList";
import { ProposalDetail } from "@/components/proposals/ProposalDetail";

export function Propostas() {
  const [selectedProposal, setSelectedProposal] = useState(null);

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
        />
      )}
    </Layout>
  );
}
