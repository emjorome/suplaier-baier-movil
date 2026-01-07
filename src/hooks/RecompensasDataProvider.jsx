import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiUrl } from "../../apiUrl";
import { AuthContext } from "../auth/context/AuthContext.jsx";

const RecompensasContext = createContext(null);

export function useRecompensas() {
  return useContext(RecompensasContext);
}

export default function RecompensasDataProvider({ children }) {
  const { authState } = useContext(AuthContext);
  const userId = authState?.user?.IdUsuario;

  const [balance, setBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(false);

  const refreshBalance = useCallback(async () => {
    if (!userId) return;
    setLoadingBalance(true);
    try {
      const res = await fetch(`${apiUrl}/recompensas/saldo/${userId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || `Error ${res.status}`);
      setBalance(Number(data?.balance ?? 0));
    } catch (e) {
      // si falla no revientes toda la app
      console.log("[recompensas] saldo error:", e.message);
    } finally {
      setLoadingBalance(false);
    }
  }, [userId]);

  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

  return (
    <RecompensasContext.Provider
      value={{
        balance,
        loadingBalance,
        refreshBalance,
      }}
    >
      {children}
    </RecompensasContext.Provider>
  );
}
