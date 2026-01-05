"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAudio } from "@/context/AudioContext";
import { useRouter } from "next/navigation";
import { entradaPagina,
  traducirGenero,
  fetchJuegosBase,
  BuscadorResultados,
  useAudioCleanup,
  BotonVolver,
  useBotonVolver,
  handleInputChangeBase,
  handleSubmitBase,
} from "@/utils/funcionesCompartidas";

export const BuscadorGameGear = () => {

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

  useAudioCleanup("Game Gear");

  useBotonVolver({ mostrarContenido, mostrarEfecto, setMostrarVolver, delay: 1600 });

  const fetchJuegos = () =>
    fetchJuegosBase({
      busqueda,
      platformId: 77,
      yearRange: [1990, 1997],
      API_KEY,
      BASE_URL,
      playSound,
      setCargando,
      setError,
      setResultados,
      setJuegos,
    });

  const handleInputChange = handleInputChangeBase(setBusqueda, playSound);
  const handleSubmit = handleSubmitBase(busqueda, fetchJuegos, setHaBuscado);

  if (!listo) return <div style={{ visibility: "hidden", minHeight: "100vh" }} />;

  return (
    <div
      className={`buscador-gamegear-wrapper container mt-4 relative ${mostrarEfecto ? "efecto-aparicion-gamegear" : ""
        }`}
    >

      {mostrarEfecto && (
        <div className="efecto-sonic-gamegear">
          <img src="/gifs/sonic-run.gif" alt="Sonic corriendo" className="sonic-gif" />
        </div>
      )}

      {mostrarContenido && (
        <BotonVolver
          mostrarContenido={mostrarContenido}
          mostrarVolver={mostrarVolver}
          playSound={playSound}
        />
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
                  src="https://www.youtube.com/embed/Joydl1XDMFY?si=zkMKP9kBJjFtEIcg"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen>
                </iframe>
              </div>
            </div>

            <div className="video-card">
              <h2 className="video-titulo">🎮 Top juegos</h2>
              <div className="video-container">
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/wrcXzAA0NHo?si=BNmYDwEVBsO37lY7"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen>
                </iframe>
              </div>
            </div>
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

          {!cargando && !error && haBuscado && resultados === 0 && busqueda.trim() !== "" && (
            <p className="texto-error">
              ❌ No existen juegos de Game Gear con ese nombre.
            </p>
          )}
        </>
      )}
    </div>
  );
};                                                                                                                                                                                                                                                                                                                                                                                                                                                                    