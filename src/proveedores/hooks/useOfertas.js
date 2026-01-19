import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../auth/context/AuthContext";
import { apiUrl } from "../../../apiUrl";

const useOfertas = () => {
  const { authState } = useContext(AuthContext);
  const { user } = authState;
  const [ofertasProv, setOfertasProv] = useState([]);

  const getOfertasProv = async () => {
    const resp = await globalThis.fetch(
      `${apiUrl}/ofertas?idProveedor=${user.IdUsuario}`
    );
    const data = await resp.json();
    const { rows: ofertas } = !!data && data;
    setOfertasProv(ofertas);
  };
  useEffect(() => {
    getOfertasProv();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState]);
  return {ofertasProv}
}
export default useOfertas