"use client";

import { BuscadorMasterSystem } from "@/components/buscadorMasterSystem";

export default function PageMasterSystem() {
  return (
    <main className="fondo-mastersystem">
      <section className="titulo-mastersystem">
        <h1>Master System</h1>
      </section>

      <section className="buscador-contenedor">
        <BuscadorMasterSystem />
      </section>
    </main>
  );
}