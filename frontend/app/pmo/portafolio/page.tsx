"use client";

import { useEffect, useState } from "react";

import PmoShell from "@/src/components/layout/PmoShell";
import ExecutiveCard from "@/src/components/pmo/ExecutiveCard";
import PageHeader from "@/src/components/pmo/PageHeader";

import { getClients } from "@/src/services/pmo/clients";
import { getPrograms } from "@/src/services/pmo/programs";
import { getInitiatives } from "@/src/services/pmo/initiatives";
import { getProjects } from "@/src/services/pmo/projects";

export default function PortafolioPage() {

  const [clients, setClients] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [initiatives, setInitiatives] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const [
      clientsData,
      programsData,
      initiativesData,
      projectsData,
    ] = await Promise.all([
      getClients(),
      getPrograms(),
      getInitiatives(),
      getProjects(),
    ]);

    setClients(clientsData);
    setPrograms(programsData);
    setInitiatives(initiativesData);
    setProjects(projectsData);
  }

  return (
    <PmoShell>

      <PageHeader
        section="PMO · Portafolio"
        title="Portafolio Ejecutivo"
        description="Vista consolidada del portafolio PMO"
      />

      <div className="space-y-6 px-8 py-6">

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <ExecutiveCard
            label="Clientes"
            value={String(clients.length)}
            accent="gold"
          />

          <ExecutiveCard
            label="Programas"
            value={String(programs.length)}
            accent="green"
          />

          <ExecutiveCard
            label="Iniciativas"
            value={String(initiatives.length)}
            accent="gold"
          />

          <ExecutiveCard
            label="Proyectos"
            value={String(projects.length)}
            accent="green"
          />

        </div>

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #D6D3D1",
          }}
        >

          <table className="w-full">

            <thead>
              <tr>
                <th className="px-6 py-4 text-left">
                  Cliente
                </th>

                <th className="px-6 py-4 text-left">
                  Programas
                </th>

                <th className="px-6 py-4 text-left">
                  Iniciativas
                </th>

                <th className="px-6 py-4 text-left">
                  Proyectos
                </th>
              </tr>
            </thead>

            <tbody>

              {clients.map((client: any) => (

                <tr key={client.id}>

                  <td className="px-6 py-4">
                    {client.nombre}
                  </td>

                  <td className="px-6 py-4">
                    {programs.length}
                  </td>

                  <td className="px-6 py-4">
                    {initiatives.length}
                  </td>

                  <td className="px-6 py-4">
                    {projects.length}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </PmoShell>
  );
}