"use client";

import { BuscadorSaturn } from "@/components/buscadorSaturn";

export default function PageSaturn() {
  return (
    <main className="fondo-saturn efecto-entrada">
      <section className="titulo-saturn">
        <h1>Saturn</h1>
      </section>

      <section className="buscador-contenedor">
        <BuscadorSaturn />
      </section>
    </main>
  );
}