import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../auth/context/AuthContext";
import { apiUrl } from "../../../apiUrl";

const useOrdenes = () => {
  const { authState } = useContext(AuthContext);
  const { user } = authState;
  const [ordenesProv, setOrdenesProv] = useState([]);

  const getOrdenesProv = async () => {
    const resp = await globalThis.fetch(
      `${apiUrl}/compras?idProveedor=${user.IdUsuario}`
    );
    const data = await resp.json();
    const { rows: ordenes } = !!data && data;
    setOrdenesProv(ordenes);
  };
  useEffect(() => {
    getOrdenesProv();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState]);
  return {ordenesProv}
}
export default useOrdenes