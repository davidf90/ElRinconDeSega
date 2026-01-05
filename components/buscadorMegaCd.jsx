"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAudio } from "@/context/AudioContext";
import { useRouter } from "next/navigation";
import { entradaPagina,
  traducirGenero,
  normalizarTexto,
  BuscadorResultados,
  useAudioCleanup,
  BotonVolver,
  useBotonVolver,
  handleInputChangeBase,
  handleSubmitBase,
} from "@/utils/funcionesCompartidas";

export const BuscadorMegaCd = () => {

  const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;
  const BASE_URL = "https://api.rawg.io/api/games";

  const [busqueda, setBusqueda] = useState("");
  const [juegos, setJuegos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [resultados, setResultados] = useState(0);
  const [haBuscado, setHaBuscado] = useState(false);

  const { playSound } = useAudio();

  const [mostrarEfecto, setMostrarEfecto] = useState(false);
  const [mostrarContenido, setMostrarContenido] = useState(false);
  const [mostrarVolver, setMostrarVolver] = useState(false);
  const [listo, setListo] = useState(false);

  const searchParams = useSearchParams();
  const vienePorQuery = searchParams.get("entrada") === "1";

  useEffect(() => setListo(true), []);

  entradaPagina({ vienePorQuery, setMostrarEfecto, setMostrarContenido, delay: 1800 });

  useAudioCleanup("MegaCD");

  useBotonVolver({ mostrarContenido, mostrarEfecto, setMostrarVolver, delay: 1600 });

  // Creación de confeti para el efecto de entrada de la página
  const crearParticulas = () => {
    const particulas = [];
    const cantidad = 120;
    for (let i = 0; i < cantidad; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const dist = 200 + Math.random() * 250;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      particulas.push({ dx, dy, delay: Math.random() * 0.6 });
    }
    return particulas;
  };

  const particulas = mostrarEfecto ? crearParticulas() : [];

  const busquedaNormalizada = normalizarTexto(busqueda);

  /**
   * Al tener que realizar otro tipo de búsqueda de juegos para esta consola (ya que al parecer no consta de id propio en esta
   * BB.DD.), se ha tenido que crear un fetch específico, de ahí que no se pueda usar el importado, como en el resto de consolas.
   * Se comentarán aquellas partes que difieran y puedan necesitar explicación
  */
  const fetchJuegos = async () => {

    try {
      
      setCargando(true);
      setError(null);
      setResultados(0);
      setJuegos([]);

      let allResults = [];

      // Buscar en múltiples páginas de la propia web para encontrar juegos de Sega CD
      for (let page = 1; page <= 5; page++) {

        const response = await fetch(
          `${BASE_URL}?key=${API_KEY}&search=${busqueda}&page=${page}&page_size=40`
        );

        const data = await response.json();

        if (data.results) {
          allResults = allResults.concat(data.results);
        }

        // Filtrar por plataformas Sega CD/Mega CD
        const tempFiltered = allResults.filter((juego) =>

          juego.platforms?.some((p) => {

            const nombre = p.platform?.name?.toLowerCase() || "";

            return nombre.includes("sega cd") || nombre.includes("mega cd") || nombre.includes("mega-cd");
          })
        );
        if (tempFiltered.length >= 5) break;
      }

      let results = allResults.filter((juego) =>

        juego.platforms?.some((p) => {

          const nombre = p.platform?.name?.toLowerCase() || "";

          return nombre.includes("sega cd") || nombre.includes("mega cd") || nombre.includes("mega-cd");
        })
      );

      results = results.filter((juego) => {

        if (!juego.released) return true; 

        const año = parseInt(juego.released.split("-")[0]);

        return año >= 1991 && año <= 1996;
      });

      if (results.length > 0) {

        // Usar directamente los resultados de RAWG sin filtro adicional
        const resultadosFiltrados = results;

        if (resultadosFiltrados.length === 0) {
          setResultados(0);
          setJuegos([]);
          playSound("sinresultados");
          return;
        }

        const juegosDetallados = await Promise.all(
          resultadosFiltrados.map(async (juego) => {
            const detalleResponse = await fetch(
              `${BASE_URL}/${juego.id}?key=${API_KEY}`
            );
            const detalleData = await detalleResponse.json();
            return {
              ...juego,
              developers: detalleData.developers || [],
              publishers: detalleData.publishers || [],
            };
          })
        );

        const ordenados = juegosDetallados.sort((a, b) => {
          const incluyeA = normalizarTexto(a.name).includes(busquedaNormalizada);
          const incluyeB = normalizarTexto(b.name).includes(busquedaNormalizada);

          if (incluyeA && !incluyeB) return -1;
          if (!incluyeA && incluyeB) return 1;

          const añoA = a.released ? parseInt(a.released.split("-")[0]) : 0;
          const añoB = b.released ? parseInt(b.released.split("-")[0]) : 0;

          return añoB - añoA;
        });

        setJuegos(ordenados);
        setResultados(ordenados.length);

        if (ordenados.length > 0) {
          playSound("resultados"); 
        }

      } else {
        setJuegos([]);
        setResultados(0);
        playSound("sinresultados");
      }

    } catch (error) {
      console.error("Error al buscar juegos:", error);
      setError("Hubo un problema al buscar los juegos.");
    } finally {
      setCargando(false);
    }
  };

  const handleInputChange = handleInputChangeBase(setBusqueda, playSound);
  const handleSubmit = handleSubmitBase(busqueda, fetchJuegos, setHaBuscado);
  
  if (!listo) return <div style={{ visibility: "hidden", minHeight: "100vh" }} />;

  return (
    <div
      className={`buscador-megacd-wrapper container mt-4 relative ${mostrarEfecto ? "efecto-aparicion-megacd" : ""
        }`}
    >
      
      {mostrarContenido && mostrarVolver && (
        <BotonVolver
          mostrarContenido={mostrarContenido}
          mostrarVolver={mostrarVolver}
          playSound={playSound}
        />
      )}
      
      {mostrarEfecto && (
        <>
          <div className="particulas-megacd">
            {particulas.map((p, i) => (
              <div
                key={i}
                className="particula-megacd"
                style={{
                  "--dx": `${p.dx}px`,
                  "--dy": `${p.dy}px`,
                  animationDelay: `${p.delay}s`,
                }}
              />
            ))}
          </div>
          <div className="destello-megacd"></div>
        </>
      )}
      

      {mostrarContenido && (
        <>
          <div className="videos-section">
            <div className="video-card">
              <h2 className="video-titulo">
                <img src="/gifs/libro.gif" className="icono-video" />
                Historia de la consola
              </h2>
              <div className="video-container">
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/k6MACt2J8uk?si=jcB2UDLKgel3S_MN"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            <div className="video-card">
              <h2 className="video-titulo">🎮 Top juegos</h2>
              <div className="video-container">
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/fdQfdBLmAUo?si=fX6B5s_aIPsSo6Vf"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>

          <div className="posible-resultado">
            *Resultados menos exactos para esta consola :(
          </div>

          <BuscadorResultados
            busqueda={busqueda}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            cargando={cargando}
            error={error}
            resultados={resultados}
            juegos={juegos}
            traducirGenero={traducirGenero}
            claseResultados="megacd"
          />

          {!cargando &&
            !error &&
            haBuscado &&
            resultados === 0 &&
            busqueda.trim() !== "" && (
              <p className="texto-error">
                ❌ No existen juegos de Mega CD con ese nombre.
              </p>
            )}
        </>
      )}
      
    </div>
  );
};
