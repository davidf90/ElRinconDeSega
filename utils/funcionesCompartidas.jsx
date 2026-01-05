"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

/* PARA EL FUNCIONAMIENTO DEL NAVBAR DE CADA CONSOLA */
export const NavBarConsolas = ({
  nombre,
  ruta,
  icono,
  sonidoHover,
  sonidoClick,
  handleSoundPlay,
  sounds,
  reproducirSonido,
  router,
}) => {

  return (
    <li
      className="consola-icono"
      data-nombre={nombre}
      onMouseEnter={() => // Al pasar por el icono se escucha el sonido para cada consola
        handleSoundPlay(
          sounds.find((s) => s.name === sonidoHover)
        )
      }
      onMouseDown={(e) => {
        // Para que no se pueda acceder a la página mediante clic de la ruedecilla del ratón
        // He hecho ésto porque da problemas a la hora de que se siga escuchando el sonido si cierras la pestaña
        if (e.button === 1 || e.button === 2) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        // Si haces clic izquierdo se activa el sonido correspondiente a la página
        if (e.button === 0) {
          reproducirSonido(sonidoClick);
        }
      }}

      // Añadido para que al 100% no se pueda entrar a la página ni con botón derecho del ratón ni con el de la ruedecilla
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Link
        href={`${ruta}?entrada=1`}
        className="nav-link"
        onClick={(e) => {
          e.preventDefault();
          localStorage.setItem("desdePrincipal", "true");
          localStorage.setItem("desdePrincipalTime", String(Date.now())); // Guardas la info en localStorage
          router.push(`${ruta}?entrada=1`); // Acceso a la página correspondiente
        }}
        onAuxClick={(e) => { // Para controlar definitivamente el entrar a la página sin ser cliz izquierdo
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {/* Imagen correspondiente para cada consola - Optimizada con next/image */}
        <Image
          src={icono}
          alt={nombre}
          width={60}
          height={60}
          className="nav-icon"
          priority={true}
        />
      </Link>
    </li>
  );
};




/* PARA EL EFECTO DE ENTRADA EN TODAS LAS CONSOLAS */
export const entradaPagina = ({ vienePorQuery, setMostrarEfecto, setMostrarContenido, delay = 1800 }) => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkTimeout = setTimeout(() => {
      const flag = localStorage.getItem("desdePrincipal") === "true";
      const timeStr = localStorage.getItem("desdePrincipalTime");
      const time = timeStr ? parseInt(timeStr, 10) : 0;
      const now = Date.now();
      const ES_RECIENTE = now - time < 3000;

      const vieneDePrincipal = vienePorQuery || (flag && ES_RECIENTE);

      // Limpiar flags inmediatamente
      localStorage.removeItem("desdePrincipal");
      localStorage.removeItem("desdePrincipalTime");

      // Limpiar parámetro de query si viene por él
      if (vienePorQuery) {
        const url = new URL(window.location.href);
        url.searchParams.delete("entrada");
        window.history.replaceState({}, "", url.pathname);
      }

      try {
        if (vieneDePrincipal) {
          setMostrarEfecto(true);
          setMostrarContenido(false);

          const t = setTimeout(() => {
            setMostrarEfecto(false);
            setMostrarContenido(true);
          }, delay);

          return () => clearTimeout(t);
        } else {
          setMostrarContenido(true);
        }
      } catch (err) {
        setMostrarContenido(true);
        console.warn("Comprobación efecto entrada fallida:", err);
      }
    }, 10);

    return () => clearTimeout(checkTimeout);
  }, [vienePorQuery, setMostrarEfecto, setMostrarContenido, delay]);
};




/* PARA TRADUCIR LOS GÉNEROS DE INGLÉS AL ESPAÑOL (ya que la web está en inglés) */
export const traducirGenero = (nombre) => {
  const traducciones = {
    Action: "Acción",
    Adventure: "Aventura",
    RPG: "Rol",
    "Role-playing (RPG)": "Rol",
    Shooter: "Disparos",
    Platformer: "Plataformas",
    Sports: "Deportes",
    Racing: "Carreras",
    Puzzle: "Puzle",
    Simulation: "Simulación",
    Strategy: "Estrategia",
    Fighting: "Lucha",
    Horror: "Terror",
    Indie: "Indie",
  };

  return traducciones[nombre] || nombre;
};




/* FETCH GENERAL PARA BUSCAR LOS JUEGOS */
export const fetchJuegosBase = async ({
  busqueda,
  platformId,
  yearRange,
  API_KEY,
  BASE_URL,
  playSound,
  setCargando,
  setError,
  setResultados,
  setJuegos,
}) => {
  try {

    // Resetea valores para la búsqueda
    setCargando(true);
    setError(null);
    setResultados(0);
    setJuegos([]);

    // Si la api no es correcta salta el error
    if (!API_KEY) {
      console.error("API_KEY no definida");
      setError("Error de configuración del sistema.");
      return;
    }

    // Llamada a la api de la página con la ruta completa para el fetch que busca el juego/los juegos
    const response = await fetch(
      `${BASE_URL}?key=${API_KEY}&search=${busqueda}&platforms=${platformId}`
    );

    // Pasa la respuesta HTTP a json, ya que sin esto:
    // No puedes acceder a data.results. Y es el formato que devuelve RAWG
    const data = await response.json();

    // Si no hay resultados se escucha el sonido que le he puesto para cuando no encuentre juegos
    if (!data.results?.length) {
      playSound?.("sinresultados");
      return;
    }

    // Normaliza el texto, con minúsculas y sin acentos ni caracteres especiales
    const busquedaNorm = normalizarTexto(busqueda);

    let filtrados = data.results
      .filter((j) => normalizarTexto(j.name).includes(busquedaNorm)) // Comprueba que el nombre del juego contiene el texto buscado
      .filter((j) => { // Se controla que los resultados estén entre los 2 años que he puesto para cada consola 
        if (!j.released) return true;
        const year = parseInt(j.released.split("-")[0]);
        return year >= yearRange[0] && year <= yearRange[1];
      });

    // Si tras filtras no encuentra resultados se escucha el sonido que le he puesto para cuando no encuentre juegos
    if (!filtrados.length) {
      playSound?.("sinresultados");
      return;
    }

    // Por cada juego llama a su endpoint individual y obtiene los desarrolladores y los publishers
    const detallados = await Promise.all( // Promise.all espera a que todas terminen
      filtrados.map(async (juego) => {
        const res = await fetch(`${BASE_URL}/${juego.id}?key=${API_KEY}`);
        const data = await res.json();
        return {
          ...juego,
          developers: data.developers || [],
          publishers: data.publishers || [],
        };
      })
    );

    // Ordena los juegos obtenido. Primero por coincidencia y después por fecha
    detallados.sort((a, b) => {
      const aIncluye = normalizarTexto(a.name).includes(busquedaNorm);
      const bIncluye = normalizarTexto(b.name).includes(busquedaNorm);

      if (aIncluye && !bIncluye) return -1;
      if (!aIncluye && bIncluye) return 1;

      const yearA = a.released ? parseInt(a.released.split("-")[0]) : 0;
      const yearB = b.released ? parseInt(b.released.split("-")[0]) : 0;

      return yearB - yearA;
    });

    // Se actualiza con los juegos obetenidos y sus datos
    setJuegos(detallados);
    setResultados(detallados.length);
    playSound?.("resultados"); // Y se escucha el sonido que le he puesto para cuando encuentre juegos

  } catch (err) {
    console.error("Error en fetchJuegosBase:", err);
    setError("Hubo un problema al buscar juegos.");
  } finally {
    setCargando(false);
  }
};




/* NORMALIZACIÓN DEL TEXTO */
export const normalizarTexto = (texto = "") =>
  texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");





/* PARA LA APARICIÓN DE RESULTADOS DE CADA CONSOLA */
export const BuscadorResultados = ({
  busqueda,
  handleInputChange,
  handleSubmit,
  cargando,
  error,
  resultados,
  juegos,
  traducirGenero,
  claseResultados,
}) => {
  return (
    <>
      {/* Buscador */}
      <form
        onSubmit={handleSubmit}
        className="buscador-formulario d-flex justify-content-center mb-4"
      >
        <input
          type="text"
          placeholder="Escriba un nombre de juego..."
          value={busqueda}
          onChange={handleInputChange}
          className="buscador-input form-control w-50 me-2"
        />
        <button type="submit" className="buscador-boton btn btn-primary">
          Buscar
        </button>
      </form>

      {/* Estado de búsqueda */}
      {cargando && <p className="texto-buscando">🔍 Buscando...</p>}
      {error && <p className="texto-error">{error}</p>}

      {resultados > 0 && (
        <p>
          <span className={`texto-juegos-encontrados-${claseResultados}`}>
            JUEGOS ENCONTRADOS:
          </span>{" "}
          <span className={`texto-numero-juegos-encontrados-${claseResultados}`}>
            {resultados}
          </span>
        </p>
      )}

      {/* Resultados, con cada dato de la ficha */}
      <div className="buscador-resultados">
        {juegos.map((juego) => (
          <div key={juego.id} className="resultado-card">
            <h5 className="resultado-titulo">{juego.name}</h5>

            <img
              src={juego.background_image}
              alt={juego.name}
              className="resultado-imagen"
            />

            <div className="resultado-info">
              <p>
                <b>Año:</b>{" "}
                {juego.released ? juego.released.split("-")[0] : "-"}
              </p>

              <p>
                <b>Género:</b>{" "}
                {juego.genres?.length
                  ? juego.genres
                    .map((g) => traducirGenero(g.name))
                    .join(", ")
                  : "-"}
              </p>

              <p>
                <b>Desarrolladora:</b>{" "}
                {juego.developers?.length
                  ? juego.developers.map((d) => d.name).join(", ")
                  : "-"}
              </p>

              <p>
                <b>Distribuidora:</b>{" "}
                {juego.publishers?.length
                  ? juego.publishers.map((p) => p.name).join(", ")
                  : "-"}
              </p>

              <p>
                <b>Rating (5⭐):</b> {juego.rating}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};




/* Cleanup DE AUDIO, PARA LIMPIARLO CUANDO EL COMPONENTE SE DESMORONA */
export const useAudioCleanup = (label = "") => {

  useEffect(() => {

    // Guarda el momento en el que el componente se monta
    const mountTime = Date.now();

    return () => {

      // Milisegundos que el componente estuvo activo
      const alive = Date.now() - mountTime;

      // Comprueba que está activo, parando y rebobinando el audio
      if (alive > 100 && window.audioActualGlobal) {

        console.log(`[${label}] stopping audio`);

        window.audioActualGlobal.pause();

        window.audioActualGlobal.currentTime = 0;

        window.audioActualGlobal = null;
      }
    };
  }, []);
};




/* BOTÓN VOLVER (que aparezzca el botón y controla la función al pulsarlo) */
export const BotonVolver = ({
  mostrarContenido,
  mostrarVolver,
  playSound,
  delayNavegacion = 120,
}) => {

  const router = useRouter();

  // Si no renderiza y no ocupa espacios no añade listeners
  if (!mostrarContenido || !mostrarVolver) return null;

  return (

    <div
      className="boton-volver boton-volver-fade"
      onPointerDown={() => { // Se escucha el sonido al hacer clic en el botón y vuelve a la página de inicio
        playSound?.("volver");
        setTimeout(() => {
          router.push("/");
        }, delayNavegacion); // Un pequeño delay para que se escuche el sonido
      }}
    >
      <img
        src="/gifs/ryo-shenmue-volviendo.gif"
        alt="Volver"
        className="boton-volver-gif"
      />
      <span className="boton-volver-texto">VOLVER</span>
    </div>
  );
};




/* BOTÓN VOLVER (Hook que decide cuándo aparece el botón) */
export const useBotonVolver = ({ mostrarContenido, mostrarEfecto, setMostrarVolver, delay }) => {

  useEffect(() => {
    // Para que no aparezca antes de que termine el efecto de entrada
    if (!mostrarContenido) return;

    // Espera a que termine el efecto para aparecer
    if (mostrarEfecto) {
      const timeout = setTimeout(() => setMostrarVolver(true), delay);
      return () => clearTimeout(timeout);
    }

    // Actualiza el botón su estado para que aparezca
    setMostrarVolver(true);
  }, [mostrarContenido, mostrarEfecto, setMostrarVolver, delay]);
};

/* Handler base para que se escuche el sonido cada vez que introduces un caracter */
export const handleInputChangeBase = (setter, playSound) => (e) => {

  setter(e.target.value);

  playSound?.("tecleo");
};

/* Handler reutilizable para el formulario */
export const handleSubmitBase = (busqueda, fetchFn, setHaBuscado) => (e) => {

  e.preventDefault();

  setHaBuscado(true);

  if (busqueda.trim()) fetchFn();
};
