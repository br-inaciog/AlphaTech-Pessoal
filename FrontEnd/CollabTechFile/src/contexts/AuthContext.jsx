import { createContext, useState, useContext, useEffect } from "react";
import secureLocalStorage from "react-secure-storage";
import { userDecodeToken } from "../auth/Auth";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(undefined);
  const [usuario, setUsuario] = useState(undefined);

  // 🔹 Inicializa token e usuário a partir do secureLocalStorage
  useEffect(() => {
    const savedToken = secureLocalStorage.getItem("tokenLogin");
    if (savedToken && typeof savedToken === "string") {
      setToken(savedToken);
      setUsuario(userDecodeToken(savedToken));
    }
  }, []);

  // 🔹 Atualiza usuário sempre que o token mudar
  useEffect(() => {
    if (token && typeof token === "string") {
      setUsuario(userDecodeToken(token));
    } else {
      setUsuario(undefined);
    }
  }, [token]);

  // Atualiza token (login ou refresh)
  const atualizarToken = (novoToken) => {
    if (!novoToken) return;

    setToken(novoToken);
    secureLocalStorage.setItem("tokenLogin", novoToken);
  };

  //  Logout robusto: remove qualquer token e limpa estado
  const logout = () => {
    //  Limpa todos os tokens do secureLocalStorage
    secureLocalStorage.clear();

    //  Limpa estados React
    setToken(undefined);
    setUsuario(undefined);

    //  Redireciona para login
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        usuario,
        atualizarToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 🔹 Hook personalizado
export const useAuth = () => useContext(AuthContext);
