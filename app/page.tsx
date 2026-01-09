"use client";

import { NavBar } from "../components/NavBar";
import { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// Interfaz para definir la estructura de una canción
interface Track {
  title: string;
  src: string;
}

export default function HomePage() {

  // Estado para la canción actual que se está reproduciendo
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  // Referencia al elemento de audio para controlar la reproducción
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Estado que indica si la canción se está reproduciendo o está pausada
  const [isPlaying, setIsPlaying] = useState(false);
  // Estado para llevar el control del tiempo actual de la canción
  const [currentTime, setCurrentTime] = useState(0);
  // Estado para almacenar la duración total de la canción
  const [duration, setDuration] = useState(0);
  // Estado para el volumen del reproductor
  const [volume, setVolume] = useState(0.1);

  // Referencia a la lista de canciones para manipular el scroll
  const listaRef = useRef<HTMLUListElement | null>(null);
  // Referencia al "thumb" (manija) del scrollbar personalizado
  const thumbRef = useRef<HTMLDivElement | null>(null);
  // Referencia para controlar si se está arrastrando el thumb del scrollbar
  const draggingRef = useRef(false);
  // Referencia para almacenar la posición Y inicial cuando se empieza a arrastrar
  const startYRef = useRef(0);
  // Referencia para almacenar la posición de desplazamiento (scroll) inicial
  const startScrollRef = useRef(0);


  // Lista de canciones
  const tracks = [
    { title: "Alien Soldier - Step up", src: "/sounds/songs/alien_soldier_slap_up.mp3" },
    { title: "Columns - Clotho", src: "/sounds/songs/columns_clotho.mp3" },
    { title: "Dragon Ball Z Buu Yuu Retsuden - BGM 1", src: "/sounds/songs/dragon_ball_z_bu_yuu_retsuden_bgm_1.mp3" },
    { title: "Golden Axe - Battlefield", src: "/sounds/songs/golden_axe_battle_field.mp3" },
    { title: "Gunstar Heroes - Theme of Seven Force", src: "/sounds/songs/gunstar_heroes_theme_of_seven_force.mp3" },
    { title: "Home Alone - McCallister Mansion", src: "/sounds/songs/home_alone_mccallister_mansion.mp3" },
    { title: "Last Battle - Chapter 1 Levels", src: "/sounds/songs/last_battle_chapter_1_levels.mp3" },
    { title: "Light Crusader - Main Screen", src: "/sounds/songs/light_crusader_main_screen.mp3" },
    { title: "Mickey Mouse: The Timeless Adventure - EOL Boss 1", src: "/sounds/songs/mickey_mania_the_timeless_adventure_eol_boss_1.mp3" },
    { title: "Probotector - Spirit of Bushi", src: "/sounds/songs/probotector_spirit_of_bushi.mp3" },
    { title: "Revenge of Shinobi - Terrible Beat", src: "/sounds/songs/revenge_of_shinobi_terrible_beat.mp3" },
    { title: "Soleil - Leviathan", src: "/sounds/songs/soleil_leviathan.mp3" },
    { title: "Sonic The Hedgehog - Green Hill Zone", src: "/sounds/songs/sonic_green_hill_zone.mp3" },
    { title: "Sonic The Hedgehog 2 - Emerald Hill Zone Act 1", src: "/sounds/songs/sonic_2_emerald_hill_zone_act_1.mp3" },
    { title: "Sonic The Hedgehog 3 - Ice Cap Zone Act 1", src: "/sounds/songs/sonic_3_Ice_cap_zone_act_1.mp3" },
    { title: "Sonic & Knuckles - Flying Battery Zone Act 1", src: "/sounds/songs/sonic_&_knuckles_flying_battery_zone_act_1.mp3" },
    { title: "Sonic Spinball - Boss Theme", src: "/sounds/songs/sonic_spinball_boss_theme.mp3" },
    { title: "Street Fighter II - Player Select", src: "/sounds/songs/street_fighter_II_player_select.mp3" },
    { title: "Street of Rage - Big Boss", src: "/sounds/songs/streets_of_rage_big_boss.mp3" },
    { title: "Street of Rage 2 - Go Straight", src: "/sounds/songs/street_of_rage_2_go_straight.mp3" },
    { title: "Street of Rage 3 - Shinobi Reverse", src: "/sounds/songs/streets_of_rage_3_shinobi_reverse.mp3" },
    { title: "The Adventures of Batman & Robin - Gotham by Night", src: "/sounds/songs/batman_and_robin_gotham_by_night.mp3" },
    { title: "The Jungle Book - Bear Necessities", src: "/sounds/songs/the_jungle_book_bear_necessities.mp3" },
    { title: "The Lost Vikings - Space Craft", src: "/sounds/songs/the_lost_vikings_space_craft.mp3" },
    { title: "The Pagemaster - The Torture Chamber", src: "/sounds/songs/the_pagemaster_the_torture_chamber.mp3" },
    { title: "The Second Samurai - Prehistoric Boss Theme", src: "/sounds/songs/the_second_samura_prehistoric_boss_theme.mp3" },
    { title: "The Story of Thor - The Huge Creature", src: "/sounds/songs/the_story_of_thor_the_huge_creature.mp3" },
    { title: "Toy Story - You've got a Friend in me", src: "/sounds/songs/toy_story_storyline_you_have_got_a_friend_in_me.mp3" },
  ];


  /* FUNCIÓN PARA CUANDO EL TIEMPO DE LA CANCIÓN CAMBIA */
  const handleTimeUpdate = () => {
    // Actualiza el estado con el tiempo actual de la canción
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };



  /* FUNCIÓN QUE SE LLAMA CUANDO SE CARGAN LOS METADATOS DEL AUDIO (incluye la duración total)*/
  const handleLoadedMetadata = () => {
    // Establece la duración total del audio en el estado
    if (audioRef.current) setDuration(audioRef.current.duration);
  };



  /* FUNCIÓN PARA MANEJAR EL CAMBIO DE LA BARRA DE PROGRESO (seek bar) */
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {

    const newTime = parseFloat(e.target.value);

    // Cambia el tiempo actual de la canción
    if (audioRef.current) audioRef.current.currentTime = newTime;

    // Actualiza el estado con el nuevo tiempo
    setCurrentTime(newTime);
  };


  /* FUNCIÓN PARA MANEJAR EL CAMBIO DE VOLUMEN */
  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {

    const newVolume = parseFloat(e.target.value); // Obtene el nuevo valor de volumen

    if (audioRef.current) audioRef.current.volume = newVolume; // Ajusta el volumen del audio

    // Actualiza el estado de volumen
    setVolume(newVolume);
  };



  /* PARA SINCRONIZAR VOLUMEN INICIAL Y CAMBIOS EN EL TRACK */
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [currentTrack, volume]);



  /* FUNCIÓN PARA LA REPRODUCCIÓN DE LA CANCIÓN */
  const handlePlay = (track: Track) => {
    // Si no existe el audio, salir
    if (!audioRef.current) return;

    // Si la canción es distinta a la actual, entonces cambia canción
    if (currentTrack?.src !== track.src) {
      cambiarCancion(track);
      return;
    }

    // Si es la misma canción, entonces alterna entre play y pause
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  


  /* FUNCIÓN PARA QUE AL CAMBIAR LA CANCIÓN SE RESETEE AL INICIO, Y CON EL BOTÓN CON EL ICONO DE "play" */
  const cambiarCancion = (track: Track) => {
    // Si no existe el elemento <audio>, salir
    if (!audioRef.current) return;

    const audio = audioRef.current;

    // Detiene cualquier reproducción actual
    audio.pause();

    // Resetea estados de React relacionados con la reproducción
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);

    // Asigna la nueva canción al elemento audio
    audio.src = track.src;

    // Fuerza al navegador a recargar el recurso de audio
    audio.load();

    // Actualiza el estado con la canción seleccionada
    setCurrentTrack(track);

    // Se ejecuta cuando el navegador indica que el audio ya está listo para reproducirse //
    const playWhenReady = () => {
      audio
        .play()
        .then(() => {
          // Marca el estado como reproduciendo
          setIsPlaying(true);
        })
        .catch(() => {
          // Ignora errores de autoplay o abortos del navegador
        });

      // Elimina el listener para evitar ejecuciones múltiples
      audio.removeEventListener("canplay", playWhenReady);
    };

    // Espera al evento "canplay" antes de iniciar la reproducción
    audio.addEventListener("canplay", playWhenReady);
  };



  /* AL CAMBIAR LA CANCIÓN, QUE SE RESETEE */
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const handleEnded = () => {
      audio.currentTime = 0;
      setIsPlaying(false);
    };

    audio.addEventListener("ended", handleEnded);

    return () => audio.removeEventListener("ended", handleEnded);
  }, []);



  /* PARA SINCRONIZAR EL "thUmb" CON EL SCROLL DE LA LISTA */
  useEffect(() => {

    // Obtener las referencias de la lista y del "thumb" del scrollbar
    const lista = listaRef.current;
    const thumb = thumbRef.current;

    // Si no existen, salir del efecto
    if (!lista || !thumb) return;

    // Función para sincronizar la posición del "thumb" con el scroll de la lista
    const syncThumb = () => {

      console

      // Obtener el contenedor del "thumb"
      const track = thumb.parentElement;

      if (!track) return;

      // Máxima posición que puede alcanzar el "thumb"
      const maxTop = track.clientHeight - thumb.clientHeight;

      // Calcula la relación entre el desplazamiento de la lista y la altura total
      const ratio = lista.scrollTop / (lista.scrollHeight - lista.clientHeight);

      // Actualiza la posición del "thumb" basada en el ratio calculado
      thumb.style.top = `${ratio * maxTop}px`;
    };

    // Añade evento para cuando se haga scroll en la lista
    lista.addEventListener("scroll", syncThumb);

    // Sincroniza el "thumb" al cargar el componente
    syncThumb();

    // Limpia el evento cuando el componente se desmonte
    return () => lista.removeEventListener("scroll", syncThumb);
  }, []);



  /* PARA MANEJAR EL DRAG(arrastre) DEL "thumb" DEL SCROLLBAR */
  useEffect(() => {

    // Obtene las referencias de la lista y del "thumb"
    const thumb = thumbRef.current;
    const lista = listaRef.current;

    // Si no existen, salir del efecto
    if (!thumb || !lista) return;

    // Función para manejar cuando se empieza a arrastrar el "thumb"
    const onMouseDown = (e: MouseEvent) => {

      // Activa el estado de arrastre
      draggingRef.current = true;

      // Guarda la posición Y inicial del ratón
      startYRef.current = e.clientY;

      // Guarda la posición inicial del scroll
      startScrollRef.current = lista.scrollTop;

      // Evita que se seleccione texto al arrastrar
      document.body.style.userSelect = "none";
    };

    // Función para mover el "thumb" cuando se está arrastrando
    const onMouseMove = (e: MouseEvent) => {
      // Si no se está arrastrando, salir de la función
      if (!draggingRef.current) return;

      const track = thumb.parentElement;

      if (!track) return;

      // Máximo desplazamiento del "thumb"
      const maxThumbMove = track.clientHeight - thumb.clientHeight;

      // Diferencia de movimiento en Y
      const deltaY = e.clientY - startYRef.current;

      // Calcular el ratio de desplazamiento
      const ratio = deltaY / maxThumbMove;

      // Total desplazable de la lista
      const scrollable = lista.scrollHeight - lista.clientHeight;

      // Actualiza el scroll de la lista basado en el ratio
      lista.scrollTop = startScrollRef.current + ratio * scrollable;
    };

    // Función para finalizar el arrastre del "thumb"
    const onMouseUp = () => {

      // Desactiva el estado de arrastre
      draggingRef.current = false;

      // Restaura la selección de texto
      document.body.style.userSelect = "";
    };

    // Añade eventos de ratón para arrastrar
    thumb.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Limpia eventos cuando el componente se desmonte
    return () => {
      thumb.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);


  /* CARGAR FUENTE ARCADE */
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);



  return (
    <div className="fondo-animado">
      <div className="titulo">
        EL RINCÓN DE SEGA
      </div>

      <div className="textoConsolas">
        SELECCIONE LA CONSOLA DE SEGA DE LA QUE DESEA BUSCAR VIDEOJUEGOS
      </div>

      <NavBar />

      {/* ZONA OST */}
      <div className="zona-ost container mt-5">
        <h2 className="zona-ost-titulo text-center mb-4">
          🎵 <span>ZONA OST (especial Mega Drive)</span>
        </h2>

        <div className="row justify-content-center">
          <div className="col-md-8 zona-ost-recuadro">
            <div className="reproductor-custom mb-4">
              {/* Audio real */}
              <audio
                ref={audioRef}
                src={currentTrack?.src}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              />

              {/* Controles */}
              <div className="controles-sega">
                {/* Barra de progreso */}
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={handleSeek}
                  className="barra-progreso"
                />

                {/* Volumen */}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolume}
                  className="barra-volumen"
                />
              </div>

              {/* Texto reproduciendo */}
              {currentTrack && (
                <p className="texto-reproduciendo">
                  🎶 Reproduciendo: <span>{currentTrack.title}</span>
                </p>
              )}
            </div>

            {/* Lista de canciones */}
            <div className="ost-wrapper">
              {/* Barra lateral */}
              <div className="ost-scrollbar">
                <div className="ost-track">
                  <div className="ost-thumb" ref={thumbRef} />
                </div>
              </div>

              {/* Lista */}
              <ul className="list-group lista-ost" ref={listaRef}>
                {tracks.map((track, index) => (
                  <li
                    key={index}
                    className={`list-group-item cancion-item ${currentTrack?.src === track.src ? "activa" : ""
                      }`}
                    onClick={() => handlePlay(track)}
                  >
                    <i className="bi bi-music-note-beamed me-2"></i>
                    {track.title}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}