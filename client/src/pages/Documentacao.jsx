import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { DocumentationList } from "@/components/documentation/DocumentationList";
import { DocumentationDetail } from "@/components/documentation/DocumentationDetail";
import { Button } from "@/components/ui/button";
import { Upload, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Documentacao() {
  const [selectedClient, setSelectedClient] = useState(null);

  return (
    <Layout>
      <div className="p-8">
        {!selectedClient ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold">Documentação</h1>
              {/* Search in header hidden in list view as per design flow */}
            </div>
            <DocumentationList onSelectClient={setSelectedClient} />
          </>
        ) : (
          <DocumentationDetail
            client={selectedClient}
            onBack={() => setSelectedClient(null)}
          />
        )}
      </div>
    </Layout>
  );
}
