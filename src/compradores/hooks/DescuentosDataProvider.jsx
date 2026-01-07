import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiUrl } from "../../../apiUrl";
import { AuthContext } from "../../auth/context/AuthContext.jsx";

const DescuentosContext = createContext(null);

export function useDescuentos() {
  return useContext(DescuentosContext);
}

function construirOpcionesDescuento(estrellasDisponibles) {
  const estrellas = Number(estrellasDisponibles ?? 0) || 0;

  const catalogo = [
    { 
      IdOpcion: 1, 
      Nombre: "Bronce 🥉", 
      codigo: "BRONCE", 
      CostoEstrellas: 100, 
      PorcentajeDescuento: 5,
      descripcion: "5% de descuento"
    },
    { 
      IdOpcion: 2, 
      Nombre: "Plata 🥈", 
      codigo: "PLATA", 
      CostoEstrellas: 250, 
      PorcentajeDescuento: 10,
      descripcion: "10% de descuento"
    },
    { 
      IdOpcion: 3, 
      Nombre: "Oro 🥇", 
      codigo: "ORO", 
      CostoEstrellas: 500, 
      PorcentajeDescuento: 20,
      descripcion: "20% de descuento"
    },
  ];

  // ✅ IMPORTANTE: Retornar TODOS los descuentos, no solo los que puede pagar
  // El componente SelectorDescuento ya maneja la validación
  return catalogo.map((d) => ({
    ...d,
    Porcentaje: d.PorcentajeDescuento, // Compatibilidad
    estado: "ACTIVO",
    usado: false,
    tipo: "ESTRELLAS",
    // ✅ Agregar flag para saber si puede usarlo
    puedeUsar: estrellas >= d.CostoEstrellas,
  }));
}

export default function DescuentosDataProvider({ children }) {
  const { authState } = useContext(AuthContext);
  const userId = authState?.user?.IdUsuario;

  const [estrellasDisponibles, setEstrellasDisponibles] = useState(0);
  const [loadingDescuentos, setLoadingDescuentos] = useState(false);

  const refreshDescuentos = useCallback(async () => {
    if (!userId) return;

    setLoadingDescuentos(true);
    try {
      const res = await fetch(`${apiUrl}/recompensas/saldo/${userId}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || `Error ${res.status}`);

      // Soporta varias formas de respuesta
      const saldo =
        data?.balance ??
        data?.saldo ??
        data?.estrellas ??
        data?.rows?.[0]?.Saldo ??
        data?.rows?.[0]?.saldo ??
        data?.rows?.[0]?.Estrellas ??
        data?.rows?.[0]?.estrellas ??
        0;

      console.log("💰 Saldo de estrellas cargado:", saldo); // Debug
      setEstrellasDisponibles(Number(saldo) || 0);
    } catch (e) {
      console.log("[descuentos] error al cargar saldo:", e?.message);
      setEstrellasDisponibles(0);
    } finally {
      setLoadingDescuentos(false);
    }
  }, [userId]);

  useEffect(() => {
    refreshDescuentos();
  }, [refreshDescuentos]);

  const descuentos = useMemo(() => {
    const opciones = construirOpcionesDescuento(estrellasDisponibles);
    console.log("🎟️ Descuentos disponibles:", opciones); // Debug
    return opciones;
  }, [estrellasDisponibles]);

  return (
    <DescuentosContext.Provider
      value={{
        descuentos,
        loadingDescuentos,
        refreshDescuentos,
        estrellasDisponibles,
      }}
    >
      {children}
    </DescuentosContext.Provider>
  );
}