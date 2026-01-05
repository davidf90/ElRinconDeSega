"use client";

import { Suspense } from "react";
import { BuscadorSaturn } from "@/components/buscadorSaturn";

export default function PageSaturn() {
  return (
    <main className="fondo-saturn efecto-entrada">
      <section className="titulo-saturn">
        <h1>Saturn</h1>
      </section>

      <section className="buscador-contenedor">
        <Suspense fallback={<div style={{ visibility: "hidden", minHeight: "100vh" }} />}>
          <BuscadorSaturn />
        </Suspense>
      </section>
    </main>
  );
}