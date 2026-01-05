"use client";

import { Suspense } from "react";
import { BuscadorDreamcast } from "@/components/buscadorDreamcast";

export default function PageDreamcast() {
  return (
    <main className="fondo-dreamcast">
      <section className="titulo-dreamcast">
        <h1>Dreamcast</h1>
      </section>

      <section className="buscador-contenedor">
        <Suspense fallback={<div style={{ visibility: "hidden", minHeight: "100vh" }} />}>
          <BuscadorDreamcast />
        </Suspense>
      </section>
    </main>
  );
}