import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../auth/context/AuthContext";
import { apiUrl } from "../../../apiUrl";

const useOrdenes = () => {
  const { authState } = useContext(AuthContext);
  const { user } = authState;
  const [ordenesComp, setOrdenesComp] = useState([]);

  const getOrdenesComp = async () => {
    const resp = await globalThis.fetch(
      `${apiUrl}/compras?idComprador=${user.IdUsuario}`
    );
    const data = await resp.json();
    const { rows: ordenes } = !!data && data;
    setOrdenesComp(ordenes);
  };
  useEffect(() => {
    getOrdenesComp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState]);
  return {ordenesComp}
}
export default useOrdenes