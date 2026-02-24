const fs = require('fs');

const path = 'c:/Users/vinic/OneDrive/Área de Trabalho/programação/monetare-new-platform/client/src/components/dashboard/PresidentDashboard.jsx';
const content = fs.readFileSync(path, 'utf8');

const newImports = `import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

import { DesempenhoTab } from "./tabs/DesempenhoTab";
import { VisaoGeralTab } from "./tabs/VisaoGeralTab";
import { RelacionamentoTab } from "./tabs/RelacionamentoTab";
import { OperacionalTab } from "./tabs/OperacionalTab";
import { CanaisTab } from "./tabs/CanaisTab";
import { CobrancaTab } from "./tabs/CobrancaTab";
import { FinanceiroTab } from "./tabs/FinanceiroTab";`;

const newTabsRender = `
            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === "desempenho" && <DesempenhoTab />}
                {activeTab === "visao-geral" && <VisaoGeralTab />}
                {activeTab === "relacionamento" && <RelacionamentoTab />}
                {activeTab === "operacional" && <OperacionalTab />}
                {activeTab === "canais" && <CanaisTab />}
                {activeTab === "cobranca" && <CobrancaTab />}
                {activeTab === "financeiro" && <FinanceiroTab />}
            </div>
        </div>
    );
}
`;

// Find where component definition starts
const componentStartIdx = content.indexOf('export function PresidentDashboard');

// Component declaration up to `const tabs =`
let insideComponent = content.substring(componentStartIdx);
// Extract tabs array and the start of return
const tabsStartIdx = insideComponent.indexOf('const tabs =');
const returnStartIdx = insideComponent.indexOf('return (');

const componentTop = insideComponent.substring(0, tabsStartIdx);
// Remove any leading internal data, leave just useState
const useStateLine = `export function PresidentDashboard() {
    const [activeTab, setActiveTab] = useState("desempenho");

    `;

const tabsDefToReturn = insideComponent.substring(tabsStartIdx, returnStartIdx);

let returnToTabsContent = insideComponent.substring(
    insideComponent.indexOf('return ('),
    insideComponent.indexOf('{/* Tab Content */}')
);

const finalCode = newImports + "\n\n" + useStateLine + tabsDefToReturn + returnToTabsContent + newTabsRender;

fs.writeFileSync(path, finalCode);
console.log("Refactoring complete");
