"use client";

import { BuscadorMegaCd } from "@/components/buscadorMegaCd";

export default function PageMegaCd() {
  return (
    <main className="fondo-megacd">
      <section className="titulo-megacd">
        <h1>Mega CD</h1>
      </section>

      <section className="buscador-contenedor">
        <BuscadorMegaCd />
      </section>
    </main>
  );
}