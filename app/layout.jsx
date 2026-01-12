import "./globals.css";
import "../styles/Estilos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BusquedaProvider } from "../context/BusquedaContext";
import { AudioProvider } from "../context/AudioContext";

export const metadata = {
  title: "El Rincón de SEGA",
  description: "Rememora los videojuegos clásicos de SEGA",
};

/* Configuración del viewport para asegurar el escalado adecuado, y se vea de forma correcta en 
  navegadores de pc y dispositivos móviles */
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AudioProvider>
          <BusquedaProvider>{children}</BusquedaProvider>
        </AudioProvider>
      </body>
    </html>
  );
}