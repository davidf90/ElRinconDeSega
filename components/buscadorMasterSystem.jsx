"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAudio } from "@/context/AudioContext";
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



/* IMPORTANTE: COMO TODAS LAS PÁGINAS COMPONENTS DE LAS 6 CONSOLAS SON IGUALES (EXCEPTO fetchJuegos DE MEGA CD), SOLO HABRÁ COMENTARIOS
   SOBRE CÓDIGO DE DICHAS PÁGINAS EN ÉSTA, YA QUE ES LA PRIMERA EN MI PÁGINA. DE ESTA FORMA NO SE AGRANDAN DE FORMA INNECESARIA. */


export const BuscadorMasterSystem = () => {
  
  // Guarda la api obtenida de la página para buscar juegos
  const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;

  // URL de la página que alberga la BB.DD. de los juegos
  const BASE_URL = "https://api.rawg.io/api/games";

  // Estado que almacena el texto que introduce el usuario en el buscador
  const [busqueda, setBusqueda] = useState("");

  // Estado array que contiene la lista de juegos obtenidos de la API
  const [juegos, setJuegos] = useState([]);

  // Estado booleano que indica si la petición a la API está en curso
  const [cargando, setCargando] = useState(false);

  // Estado que almacena un mensaje de error si ocurre un fallo en la búsquedade los juegos
  const [error, setError] = useState(null);

  // Estado numérico que guarda la cantidad de resultados obtenidos
  const [resultados, setResultados] = useState(0);

  // Estado booleano que indica si el usuario ha realizado al menos una búsqueda
  const [haBuscado, setHaBuscado] = useState(false);

  // Hook personalizado que expone la función para reproducir sonidos
  const { playSound } = useAudio();

  // Estado booleano que controla si se deben ejecutar efectos visuales de entrada
  const [mostrarEfecto, setMostrarEfecto] = useState(false);

  // Estado booleano que determina cuándo el contenido principal debe renderizarse
  const [mostrarContenido, setMostrarContenido] = useState(false);

  // Estado booleano que controla la visibilidad del botón de volver
  const [mostrarVolver, setMostrarVolver] = useState(false);

  // Estado booleano que indica que la página ha completado su inicialización
  const [listo, setListo] = useState(false);

  // Hook de Next.js para acceder a los parámetros de la URL (query string)
  const searchParams = useSearchParams();
  
  // Booleano que indica si la página fue accedida desde la principal mediante query param
  const vienePorQuery = searchParams.get("entrada") === "1";

  // Marca el componente como “listo” justo después de montarse en el cliente.
  useEffect(() => setListo(true), []);

  /* Efecto de introducción a la página */
  entradaPagina({ vienePorQuery, setMostrarEfecto, setMostrarContenido, delay: 1800 });

  /* Audio */
  useAudioCleanup("Master System");

  /* Botón volver */
  useBotonVolver({ mostrarContenido, mostrarEfecto, setMostrarVolver, delay: 1600 });

  /* Búsqueda de juegos */
  const fetchJuegos = () =>
    fetchJuegosBase({
      busqueda,
      platformId: 74,
      yearRange: [1985, 1996],
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

  // Evita que la página se renderice hasta que el componente esté montado
  if (!listo) return <div style={{ visibility: "hidden", minHeight: "100vh" }} />;
  

  return (

    <div
      className={`buscador-mastersystem-wrapper container mt-4 relative ${mostrarEfecto ? "efecto-aparicion-horizontal" : ""
        }`}
    >

      {mostrarContenido && mostrarVolver && (
        // Botón para volver a página principal
        <BotonVolver
          mostrarContenido={mostrarContenido}
          mostrarVolver={mostrarVolver}
          playSound={playSound}
        />
      )}

      {/* Overlay oscuro que se muestra durante la animación de entrada de la página */}
      {mostrarEfecto && <div className="overlay-mastersystem"></div>}

      {/* Renderizado condicional: todo el contenido principal solo se muestra cuando mostrarContenido es true */}
      {mostrarContenido && (

        // Fragment para agrupar múltiples elementos sin añadir nodos extra al DOM
        <>

          {/* SECCIÓN DE VIDEOS */}
          {/* Contenedor que agrupa las tarjetas de videos de YouTube */}
          <div className="videos-section">

            {/* Primera tarjeta de video: Historia de la consola Master System */}
            <div className="video-card">

              {/* Título del video con icono de libro animado */}
              <h2 className="video-titulo">
                <img src="/gifs/libro.gif" className="icono-video" />
                Historia de la consola
              </h2>

              {/* Contenedor responsive para el iframe del video de YouTube */}
              <div className="video-container">

                {/* Iframe embebido de YouTube con el documental sobre la historia de Master System */}
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/Hl9mpjWKC68?si=uJSpG0BUBmT5LfAK"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen>
                </iframe>
              </div>
            </div>

            {/* Segunda tarjeta de video: Top juegos de Master System */}
            <div className="video-card">

              <h2 className="video-titulo">🎮 Top juegos</h2>

              {/* Contenedor responsive para el iframe*/}
              <div className="video-container">

                {/* Iframe embebido de YouTube con el ranking de mejores juegos */}
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/mp9crSTxC4U?si=FKzYYNsdiI_teDOC"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen>
                </iframe>
              </div>
            </div>
          </div>

          {/* Función para buscar resultados */}
          <BuscadorResultados
            busqueda={busqueda}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            cargando={cargando}
            error={error}
            resultados={resultados}
            juegos={juegos}
            traducirGenero={traducirGenero}
            claseResultados="dreamcast"
          />

          {/* MENSAJE DE SIN RESULTADOS */}
          {/* Se muestra solo cuando: no está cargando, no hay error, el usuario ya buscó,*/}
          {/* hay 0 resultados y el campo de búsqueda no está vacío*/}
          {!cargando && !error && haBuscado && resultados === 0 && busqueda.trim() !== "" && (
            <p className="texto-error">
              ❌ No existen juegos de Master System con ese nombre.
            </p>
          )}

        </>
      )}

    </div>
  );
};                                                                                                                                                                                                                                                                                                                                                                                                                  