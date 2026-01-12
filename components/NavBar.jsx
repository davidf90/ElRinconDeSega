"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NavBarConsolas } from "@/utils/funcionesCompartidas";


export const NavBar = () => {

  // Obtener el router mediante el hook useRouter y guardarlo en una constante
  const router = useRouter();

  // Reproductor para los efectos hover/click
  // Crea una referencia al elemento <audio> del DOM para controlar la reproducción
  const audioRef = useRef(null);

  // Estado que almacena el sonido que se está reproduciendo actualmente
  const [currentSound, setCurrentSound] = useState(null);

  // Objeto para definir el volumen base (5%) para los efectos de sonido
  const VOLUMEN_SONIDOS_BASE = 0.05;

  // Array para guardar cada sonido musical cuando pase el ratón por cada icono
  const sounds = [
    { name: "Master System Hover", src: "/sounds/cursor_master_system.mp3" },
    { name: "Mega Drive Hover", src: "/sounds/cursor_mega_drive.mp3" },
    { name: "Game Gear Hover", src: "/sounds/cursor_game_gear.mp3" },
    { name: "Mega CD Hover", src: "/sounds/cursor_mega_cd.mp3" },
    { name: "Saturn Hover", src: "/sounds/cursor_saturn.mp3" },
    { name: "Dreamcast Hover", src: "/sounds/cursor_dreamcast.mp3" },
  ];


  /* FUNCIÓN QUE REPRODUCE EL SONIDO HOVER DE CADA CONSOLA */
  const handleSoundPlay = (sound) => {

    // Si no hay sonido definido, sale de la función
    if (!sound) return;

    // Si la referencia al audio no existe, sale de la función
    if (!audioRef.current) return;

    // Verifica si ya existe un contexto de audio
    if (!audioRef.current.context) {

      // Crea un nuevo contexto de audio (compatible con diferentes navegadores)
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();

      // Crea una fuente de audio a partir del elemento <audio>
      const source = audioContext.createMediaElementSource(audioRef.current);

      // Crea un nodo de ganancia para controlar el volumen
      const gainNode = audioContext.createGain();

      // Establece el valor del volumen base
      gainNode.gain.value = VOLUMEN_SONIDOS_BASE;

      // Conecta la fuente al nodo de ganancia y este a la salida de audio
      source.connect(gainNode).connect(audioContext.destination);

      // Guarda el contexto de audio en la referencia para reutilizarlo
      audioRef.current.context = audioContext;

      // Guarda el nodo de ganancia en la referencia para ajustar volumen después
      audioRef.current.gainNode = gainNode;
    }

    // Asegura que el volumen esté en el nivel base antes de reproducir
    audioRef.current.gainNode.gain.value = VOLUMEN_SONIDOS_BASE;

    // Actualiza el estado con el sonido actual
    setCurrentSound(sound);

    // Asigna la ruta del archivo de audio al elemento <audio>
    audioRef.current.src = sound.src;

    // Reinicia el audio al inicio (tiempo 0)
    audioRef.current.currentTime = 0;

    // Intenta reproducir el audio y guarda la promesa
    const playPromise = audioRef.current.play();

    // Verifica si play() devolvió una promesa válida
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => { });
    }
  };




  /* FUNCIÓN QUE REPRODUCE EL SONIDO DE INTRODUCCIÓN DE CADA CONSOLA CUANDO SE HACE CLIC EN EL ICONO CORRESPONDIENTE */
  const reproducirSonido = (consolaName) => {

    // Verifica si hay un audio global reproduciéndose actualmente
    if (window.audioActualGlobal) {

      try {

        // Pausa el audio anterior
        window.audioActualGlobal.pause();

        // Reinicia el audio anterior al inicio
        window.audioActualGlobal.currentTime = 0;
      } catch (err) { }
    }

    // Objeto que mapea el nombre de cada consola con su archivo de audio de introducción
    const audioFiles = {
      mastersystem: "Master_System_Intro.mp3",
      megadrive: "Mega_Drive_intro.mp3",
      gamegear: "Game_Gear_intro.mp3",
      megacd: "Mega_CD_intro.mp3",
      saturn: "Saturn_intro.mp3",
      dreamcast: "Dreamcast_Intro.mp3",
    };

    // Obtiene el nombre del archivo de audio según la consola
    const audioFile = audioFiles[consolaName];

    // Si no existe archivo para esa consola, sale de la función
    if (!audioFile) return;

    try {

      // Crea un nuevo objeto Audio con la ruta del archivo
      const audio = new Audio(`/sounds/${audioFile}`);

      // Establece el volumen al 5%
      audio.volume = 0.05;

      // Guarda el audio en una variable global para poder controlarlo desde otras partes
      window.audioActualGlobal = audio;

      // Intenta reproducir el audio
      audio.play()
        .then(() => { // Si la reproducción es exitosa
          console.log("[NavBar] ✅ Audio reproduciéndose exitosamente");
        })
        .catch((err) => {
          console.error("[NavBar] ❌ Error al reproducir:", err);
        });

    } catch (err) {
      console.error("[NavBar] ❌ Error creando audio:", err);
    }
  };




  return (

    <>
      {/* Elemento audio oculto para reproducir efectos de sonido hover */}
      <audio ref={audioRef} style={{ display: "none" }} />

      {/* Barra de navegación con clases personalizadas para mantener horizontal en móvil */}
      <nav>
        {/* Lista de navegación centrada */}
        <ul className="navbar-nav">

          {/* Función refactorizada con los elementos de cada consola (icono, canción al hacer clic, etc.) */}
          <NavBarConsolas
            nombre="Master System"
            ruta="/mastersystem"
            icono="/icons/iconoMasterSystem.png"
            sonidoHover="Master System Hover"
            sonidoClick="mastersystem"
            handleSoundPlay={handleSoundPlay}
            sounds={sounds}
            reproducirSonido={reproducirSonido}
            router={router}
          />

          <NavBarConsolas
            nombre="Mega Drive"
            ruta="/megadrive"
            icono="/icons/iconoMegaDrive.png"
            sonidoHover="Mega Drive Hover"
            sonidoClick="megadrive"
            handleSoundPlay={handleSoundPlay}
            sounds={sounds}
            reproducirSonido={reproducirSonido}
            router={router}
          />

          <NavBarConsolas
            nombre="Game Gear"
            ruta="/gamegear"
            icono="/icons/iconoGameGear.png"
            sonidoHover="Game Gear Hover"
            sonidoClick="gamegear"
            handleSoundPlay={handleSoundPlay}
            sounds={sounds}
            reproducirSonido={reproducirSonido}
            router={router}
          />

          <NavBarConsolas
            nombre="Mega CD"
            ruta="/megacd"
            icono="/icons/iconoMegaCd.png"
            sonidoHover="Mega CD Hover"
            sonidoClick="megacd"
            handleSoundPlay={handleSoundPlay}
            sounds={sounds}
            reproducirSonido={reproducirSonido}
            router={router}
          />

          <NavBarConsolas
            nombre="Saturn"
            ruta="/saturn"
            icono="/icons/iconoSaturn.png"
            sonidoHover="Saturn Hover"
            sonidoClick="saturn"
            handleSoundPlay={handleSoundPlay}
            sounds={sounds}
            reproducirSonido={reproducirSonido}
            router={router}
          />

          <NavBarConsolas
            nombre="Dreamcast"
            ruta="/dreamcast"
            icono="/icons/iconoDreamcast.png"
            sonidoHover="Dreamcast Hover"
            sonidoClick="dreamcast"
            handleSoundPlay={handleSoundPlay}
            sounds={sounds}
            reproducirSonido={reproducirSonido}
            router={router}
          />

        </ul>
      </nav >
    </>
  );
};
