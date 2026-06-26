"use client";

import { useEffect, useState } from "react";
import PmoShell from "@/src/components/layout/PmoShell";
import PageHeader from "@/src/components/pmo/PageHeader";
import ExecutiveCard from "@/src/components/pmo/ExecutiveCard";
import BibliotecaDocumentalExplorer from "@/components/pmo/BibliotecaDocumentalExplorer";
import { getUsers } from "@/src/services/pmo/users";
import { getDocuments } from "@/src/services/pmo/documents";
import { areasService } from "@/services/areasService";
import { processesService } from "@/services/processesService";
import { documentTypesService } from "@/services/documentTypesService";
import { documentStatusesService } from "@/services/documentStatusesService";

export default function BibliotecaDocumentalPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [processes, setProcesses] = useState<any[]>([]);
  const [documentTypes, setDocumentTypes] = useState<any[]>([]);
  const [documentStatuses, setDocumentStatuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [documentsData, usersData, areasData, processesData, documentTypesData, documentStatusesData] = await Promise.all([
        getDocuments(),
        getUsers(),
        areasService.getAll(),
        processesService.getAll(),
        documentTypesService.getAllActive(),
        documentStatusesService.getAllActive(),
      ]);

      setDocuments(documentsData);
      setUsers(usersData);
      setAreas("data" in areasData ? areasData.data : areasData);
      setProcesses("data" in processesData ? processesData.data : processesData);
      setDocumentTypes(documentTypesData);
      setDocumentStatuses(documentStatusesData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PmoShell>
      <PageHeader
        section="PMO · Biblioteca Documental"
        title="Biblioteca Documental"
        description="Explora documentos PMO con una navegación jerárquica y filtros inteligentes."
      />

      <div className="space-y-6 px-8 py-6">
        <BibliotecaDocumentalExplorer
          documents={documents}
          areas={areas}
          processes={processes}
          documentTypes={documentTypes}
          documentStatuses={documentStatuses}
          onRefresh={loadData}
          loading={loading}
        />

      </div>
    </PmoShell>
  );
}
