"use client";

import { Suspense } from "react";
import { BuscadorGameGear } from "@/components/buscadorGameGear";

export default function PageGameGear() {
  return (
    <main className="fondo-gamegear">
      <section className="titulo-gamegear">
        <h1>Game Gear</h1>
      </section>

      <section className="buscador-contenedor">
        <Suspense fallback={<div style={{ visibility: "hidden", minHeight: "100vh" }} />}>
          <BuscadorGameGear />
        </Suspense>
      </section>
    </main>
  );
}