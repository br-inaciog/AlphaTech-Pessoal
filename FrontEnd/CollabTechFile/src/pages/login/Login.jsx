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
import { Eye, EyeOff } from "lucide-react";
import { IMaskInput } from 'react-imask';

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();
  const { atualizarToken } = useAuth();

  const [isShow, setIsShow] = useState(false);

  const handlePassword = (e) => {
    e.preventDefault();
    setIsShow(!isShow);
  };

  async function realizarAutenticacao(e) {
    e.preventDefault();

    if (senha.trim() !== "" && email.trim() !== "") {
      try {
        const usuario = { email, senha };
        const resposta = await api.post("Login", usuario);

        const token = resposta.data.token;
        const primeiraSenha = resposta.data.primeiraSenha; // ✅ veio do backend

        if (token) {
          const tokenDecodificado = userDecodeToken(token);
          // ✅ Se for senha padrão → encaminha para troca de senha
          if (primeiraSenha === true) {

            // guarda o token temporário para pegar o ID depois
            secureLocalStorage.setItem("token", token);

            await Swal.fire({
              title: "Atenção!",
              text: "Você está usando a senha padrão. Por favor, redefina sua senha.",
              icon: "warning",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "OK"
            });

            navigate("/alterar-senha", { state: { id: tokenDecodificado.idUsuario } });

            return; // ✅ evita continuar o login normal
          }

          // Atualiza o token no contexto
          atualizarToken(token);

          // Salva no storage
          secureLocalStorage.setItem("token", token);

          await Swal.fire({
            title: "Login realizado!",
            text: "Redirecionando...",
            icon: "success",
            showConfirmButton: false,
            timer: 800,
          });

          // ✅ Redirecionamento conforme o tipo
          if (tokenDecodificado.tipoUsuario === "Funcionario") {
            navigate("/Inicio", { replace: true });
          } else if (tokenDecodificado.tipoUsuario === "Cliente") {
            navigate("/InicioCliente", { replace: true });
          } else {
            navigate("/Inicio", { replace: true });
          }
        }
      } catch (error) {
        console.error(error);

        if (error.response?.status === 401) {
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
    } else {
      Swal.fire({
        title: "Campos vazios!",
        text: "Preencha todos os campos para realizar o login.",
        icon: "info",
        confirmButtonColor: "#3085d6",
      });
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
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label>Email</label>
            </div>

            <div className="grupoSenha"> 
              <input
                type={isShow ? "text" : "password"}
                placeholder=" "
                minLength={6}
                maxLength={8}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <label>Senha</label>
              <button
                type="button" 
                className="btn-mostrar-senha"
                onClick={handlePassword}
              >
                {isShow ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>
        </div>

        <Botao nomeBotao="Login" />
      </div>

      <img className="imgLogo" src={Logo} alt="Logo CollabTechFile" />
    </form>
  );
}