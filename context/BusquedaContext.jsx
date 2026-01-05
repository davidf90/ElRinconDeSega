"use client";

import { createContext, useState } from "react";

//Creamos el provider que proporciona los datos del contexto
export const BusquedaContext = createContext();

export const BusquedaProvider = ({ children }) => {

  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);

  return (
    <BusquedaContext.Provider value={{ terminoBusqueda, setTerminoBusqueda, resultados, setResultados }}>
      {children}
    </BusquedaContext.Provider>
  );
};