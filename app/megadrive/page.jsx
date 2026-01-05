"use client";

import { BuscadorMegaDrive } from "@/components/buscadorMegadrive";

export default function PageMegaDrive() {
  return (
    <main className="fondo-megadrive efecto-sonic">
      <section className="titulo-megadrive">
        <h1>Mega Drive</h1>
      </section>

      <section className="buscador-contenedor">
        <BuscadorMegaDrive />
      </section>
    </main>
  );
}
