import { createContext, useState, useContext, useEffect } from "react";
import secureLocalStorage from "react-secure-storage";
import { userDecodeToken } from "../auth/Auth"; // ajuste o caminho se necessário

// Cria o contexto de autenticação
const AuthContext = createContext();

// Provider que envolve toda a aplicação
export const AuthProvider = ({ children }) => {
  // Estado para armazenar o token JWT
  const [token, setToken] = useState(() => {
    const savedToken = secureLocalStorage.getItem("tokenLogin");
    return typeof savedToken === "string" ? savedToken : undefined;
  });

  // Estado para armazenar o usuário decodificado
  const [usuario, setUsuario] = useState(() => {
    if (token && typeof token === "string") {
      return userDecodeToken(token);
    }
    return undefined;
  });

  // Atualiza o usuário quando o token muda
  useEffect(() => {
    if (token && typeof token === "string") {
      const decoded = userDecodeToken(token);
      setUsuario(decoded);
    } else {
      setUsuario(undefined);
    }
  }, [token]);

  // Função para atualizar token e salvar no storage
  const atualizarToken = (novoToken) => {
    setToken(novoToken);
    if (novoToken && typeof novoToken === "string") {
      secureLocalStorage.setItem("tokenLogin", novoToken);
    } else {
      secureLocalStorage.removeItem("tokenLogin");
    }
  };

  return (
    <AuthContext.Provider value={{ token, usuario, setUsuario: atualizarToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para acessar o contexto
export const useAuth = () => useContext(AuthContext);
