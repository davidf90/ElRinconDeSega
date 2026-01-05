"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Crea el contexto de audio con valor inicial null
const AudioContext = createContext(null);

/* COMPONENTE PROVEEDOR QUE ENVUELVE LA APP Y PROPORCIONA EL CONTEXTO DE ADUIO */
export const AudioProvider = ({ children }) => {

  // Referencia para almacenar todos los objetos de audio
  const audios = useRef({});

  // Obtiene la ruta actual de la página
  const pathname = usePathname();

  // Constante que define el volumen global (5%) para todos los sonidos
  const VOLUMEN_GLOBAL = 0.05;

  // Efecto que detiene todos los sonidos cuando cambia la ruta
  useEffect(() => {
    stopAll();
  }, [pathname]);

  // Efecto que se ejecuta al montar el componente para inicializar los audios
  useEffect(() => {

    // Si el audio no está definido (servidor), sale del efecto
    if (typeof Audio === "undefined") return;

    try {
      audios.current = {
        mastersystem: new Audio("/sounds/Master_System_Intro.mp3"),
        megadrive: new Audio("/sounds/Mega_Drive_intro.mp3"),
        gamegear: new Audio("/sounds/Game_Gear_intro.mp3"),
        megacd: new Audio("/sounds/Mega_CD_intro.mp3"),
        saturn: new Audio("/sounds/Saturn_intro.mp3"),
        dreamcast: new Audio("/sounds/Dreamcast_Intro.mp3"),

        resultados: new Audio("/sounds/encontro_juegos.mp3"),
        sinresultados: new Audio("/sounds/no_encontro_juegos.mp3"),
        tecleo: new Audio("/sounds/escribir_caracter.mp3"),
        volver: new Audio("/sounds/volver.mp3"),
      };

      // Aplica el volumen global a todos los audios inicializados
      Object.values(audios.current).forEach((a) => {
        if (a) a.volume = VOLUMEN_GLOBAL;
      });
      // Captura errores si falla la inicialización
    } catch (err) {
      console.warn("Error inicializando audios:", err);
    }
  }, []);




  /* FUNCIÓN PARA REPRODUCIR UN SONIDO ESPECÍFICO POR EL NOMBRE DE LA CONSOLA */
  const playSound = (name) => {

    // Obtiene el objeto de audio correspondiente al nombre
    const a = audios.current[name];

    // Si no existe el audio, sale de la función
    if (!a) return;

    try {

      // Reinicia el audio al inicio
      a.currentTime = 0;
      // Establece el volumen global
      a.volume = VOLUMEN_GLOBAL;
      // Intenta reproducir el audio y guarda la promesa
      const p = a.play();

      // Si play() devolvió una promesa válida, captura errores
      if (p && typeof p.catch === "function") {
        p.catch((err) => console.warn("playSound error:", err));
      }
      // Captura errores al reproducir
    } catch (err) {
      console.warn("Error al reproducir sonido:", err);
    }
  };




  /* FUNCIÓN PARA DETENER TODOS LOS SONIDOS ACTIVOS */
  const stopAll = () => {

    try {

      // Recorre todos los audios y los detiene
      Object.values(audios.current).forEach((a) => {

        // Si el audio no existe, continúa con el siguiente
        if (!a) return;

        // Pausa el audio
        a.pause();

        // Reinicia el audio al inicio
        a.currentTime = 0;
      });
    } catch (err) {
      console.warn("Error al detener audios:", err);
    }
  };


  // Efecto para limpiar los audios cuando se cierra la pestaña
  useEffect(() => {

    // Función que se ejecuta cuando el usuario cierra o abandona la página
    const handleUnload = () => {

      // Detiene todos los sonidos del contexto
      stopAll();

      // Si existe un audio global, lo detiene también
      if (window.audioActualGlobal) {

        try {

          // Pausa el audio global
          window.audioActualGlobal.pause();

          // Limpia la referencia global
          window.audioActualGlobal = null;
        } catch (err) { }
      }
    };

    // Añade el listener para el evento antes de cerrar
    window.addEventListener("beforeunload", handleUnload);
    
    // Añade el listener para ocultar página
    window.addEventListener("pagehide", handleUnload);

    // Función de limpieza que remueve los listeners al desmontar
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("pagehide", handleUnload);
    };
  }, []);

  // Renderiza el Provider pasando las funciones y los audios como valor del contexto
  return (
    <AudioContext.Provider value={{ playSound, stopAll, audios: audios.current }}>
      {children}
    </AudioContext.Provider>
  );
};




/* HOOK PERSONALIZADO PARA CONSUMIR EL CONTEXTO DE AUDIO DESDE CUALQUIER COMPONENTE */
export const useAudio = () => {

  // Obtiene el contexto actual
  const ctx = useContext(AudioContext);

  // Si no hay contexto, lanza un error indicando que debe estar dentro del Provider
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");

  // Devuelve el contexto
  return ctx;
};

export default AudioContext;
