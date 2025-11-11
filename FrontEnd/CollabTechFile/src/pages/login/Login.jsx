import "./Login.css";
import Botao from "../../components/botao/Botao";
import User from "../../assets/img/UserModoClaro.png";
import Logo from "../../assets/img/Logo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/Service";
import { userDecodeToken } from "../../auth/Auth";
import secureLocalStorage from "react-secure-storage";
import { useAuth } from "../../contexts/AuthContext";
import Swal from "sweetalert2";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();
  const { atualizarToken } = useAuth();

  async function realizarAutenticacao(e) {
    e.preventDefault();

    if (senha.trim() === "" || email.trim() === "") {
      Swal.fire({
        title: "Campos vazios!",
        text: "Preencha todos os campos para realizar o login.",
        icon: "info",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    try {
      const usuario = { email, senha };
      const resposta = await api.post("Login", usuario);

      const token = resposta.data.token;
      const primeiraSenha = resposta.data.primeiraSenha;

      if (!token) {
        Swal.fire({
          title: "Erro!",
          text: "Token não recebido do servidor.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
        return;
      }

      // Se a senha for padrão, redireciona pra alterar senha
      if (primeiraSenha === true) {
        secureLocalStorage.setItem("tokenLogin", token);

        await Swal.fire({
          title: "Atenção!",
          text: "Você está usando a senha padrão. Por favor, redefina sua senha.",
          icon: "warning",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });

        navigate("/alterar-senha");
        return;
      }

      // Login normal
      const tokenDecodificado = userDecodeToken(token);

      atualizarToken(token);
      secureLocalStorage.setItem("tokenLogin", token);

      await Swal.fire({
        title: "Login realizado!",
        text: "Redirecionando...",
        icon: "success",
        showConfirmButton: false,
        timer: 800,
      });

      // Redirecionamento conforme tipo
      if (tokenDecodificado.tipoUsuario === "Funcionario") {
        navigate("/Inicio", { replace: true });
      } else if (tokenDecodificado.tipoUsuario === "Cliente") {
        navigate("/InicioCliente", { replace: true });
      } else {
        navigate("/cadastrofuncionario", { replace: true });
      }
    } catch (error) {
      console.error(error);

      if (error.response?.status === 400) {
        Swal.fire({
          title: "Erro no servidor!",
          text: "O banco de dados não está acessível. Verifique se o SQL Server está rodando.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
      } else if (error.response?.status === 401) {
        Swal.fire({
          title: "Email ou senha inválidos!",
          text: "Verifique suas credenciais e tente novamente.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
      } else {
        Swal.fire({
          title: "Erro no servidor!",
          text: "Tente novamente mais tarde.",
          icon: "warning",
          confirmButtonColor: "#3085d6",
        });
      }
    }
  }

  return (
    <form className="mainLogin" onSubmit={realizarAutenticacao}>
      <div className="campoLogin">
        <div className="userTitulo">
          <img src={User} alt="Imagem usuário" />
          <h1>Seja Bem-Vindo</h1>
        </div>

        <div className="campoInput">
          <div className="inputLogin">
            <div className="grupoEmail">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label>Email</label>
            </div>

            <div className="grupoSenha">
              <input
                type="password"
                minLength={6}
                maxLength={8}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <label>Senha</label>
            </div>
          </div>
        </div>

        <Botao nomeBotao="Login" />
      </div>

      <img className="imgLogo" src={Logo} alt="Logo CollabTechFile" />
    </form>
  );
}
