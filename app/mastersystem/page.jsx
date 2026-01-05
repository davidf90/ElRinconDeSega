"use client";

import { Suspense } from "react";
import { BuscadorMasterSystem } from "@/components/buscadorMasterSystem";

export default function PageMasterSystem() {
  return (
    <main className="fondo-mastersystem">
      <section className="titulo-mastersystem">
        <h1>Master System</h1>
      </section>

      <section className="buscador-contenedor">
        <Suspense fallback={<div style={{ visibility: "hidden", minHeight: "100vh" }} />}>
          <BuscadorMasterSystem />
        </Suspense>
      </section>
    </main>
  );
}