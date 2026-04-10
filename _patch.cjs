const fs = require('fs');
const p = 'client/src/components/proposals/AgroProposalDetail.jsx';
let t = fs.readFileSync(p, 'utf8');

// 1) Fix handleApprove
t = t.replace(
    /const handleApprove = \(\) => \{[^}]*advanceProposal\(proposal\.id, "APROVADA"[^}]*\};/s,
    `const handleApprove = () => {
        advanceProposal(proposal.id, "APROVADA", actionReason);
        setShowApproveModal(false);
        setActionReason("");
        setLocation("/propostas");
        setTimeout(() => window.location.reload(), 100);
    };`
);

// 2) Fix handleReject
t = t.replace(
    /const handleReject = \(\) => \{[^}]*if \(actionReason\.trim\(\)\) return;[^}]*\};/s,
    `const handleReject = () => {
        if (!actionReason.trim()) return;
        advanceProposal(proposal.id, "REPROVADA", actionReason);
        setShowRejectModal(false);
        setActionReason("");
        setLocation("/propostas");
        setTimeout(() => window.location.reload(), 100);
    };`
);

fs.writeFileSync(p, t, 'utf8');
console.log('Analista handlers patched');
