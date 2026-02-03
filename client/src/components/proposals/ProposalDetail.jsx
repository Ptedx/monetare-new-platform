import { AgroProposalDetail } from "./AgroProposalDetail";
import { CorporateProposalDetail } from "./CorporateProposalDetail";

export function ProposalDetail({ proposal, onBack }) {
    // Check for "Corporate" type (case-insensitive) or specific segment logic
    const isCorporate = proposal?.type?.toLowerCase() === 'corporate' || proposal?.segment === 'Corporate';

    if (isCorporate) {
        return <CorporateProposalDetail proposal={proposal} onBack={onBack} />;
    }

    return <AgroProposalDetail proposal={proposal} onBack={onBack} />;
}
