import { useReducer, useMemo } from "react";
import PropTypes from "prop-types";
import { types } from "../types/types";
import { AuthContext } from "./AuthContext";
import { authReducer } from "./authReducer";

// init NO puede ser async para useReducer, corregido
const init = () => ({
  logged: false,
});

// aquí también debería haber contexto para las ofertasActivas del usuario

export const AuthProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, {}, init);

  const login = (user) => {
    dispatch({
      type: types.login,
      payload: user,
    });
  };

  const logout = () => {
    dispatch({
      type: types.logout,
    });
  };

  // 🔥 SonarQube fix: memorizar el objeto para no recrearlo cada render
  const value = useMemo(
    () => ({
      authState,
      login,
      logout,
    }),
    [authState] // solo cambia cuando cambia el state
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 🔥 SonarQube fix: validar props
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

