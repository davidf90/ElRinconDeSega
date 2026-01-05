"use client";

import { Suspense } from "react";
import { BuscadorMegaCd } from "@/components/buscadorMegaCd";

export default function PageMegaCd() {
  return (
    <main className="fondo-megacd">
      <section className="titulo-megacd">
        <h1>Mega CD</h1>
      </section>

      <section className="buscador-contenedor">
        <Suspense fallback={<div style={{ visibility: "hidden", minHeight: "100vh" }} />}>
          <BuscadorMegaCd />
        </Suspense>
      </section>
    </main>
  );
}