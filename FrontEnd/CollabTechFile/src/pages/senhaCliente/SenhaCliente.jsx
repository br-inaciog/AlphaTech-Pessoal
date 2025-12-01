import "./SenhaCliente.css";
import Botao from "../../components/botao/Botao";
import User from "../../assets/img/UserModoClaro.png";
import Logo from "../../assets/img/Logo.png";

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";

export default function SenhaCliente() {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [isShow, setIsShow] = useState(false);

  const handlePassword = (e) => {
    e.preventDefault();
    setIsShow(!isShow);
  };

  // Pegando o ID enviado pela tela anterior
  const location = useLocation();
  const idUsuario = location.state?.id;

  const navigate = useNavigate();

  function alertar(icone, mensagem) {
    const Toast = Swal.mixin({
      theme: 'dark',
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: icone,
      title: mensagem,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (novaSenha.length < 6 || novaSenha.length > 8) {
      alertar("warning", "A senha deve ter entre 6 e 8 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      alertar("error", "As senhas não coincidem.");
      return;
    }

    try {
      const response = await fetch(`https://localhost:7142/api/Usuario/RedefinirSenha/${idUsuario}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          novaSenha: novaSenha
        }),
      });

      if (!response.ok) {
        alertar("error", "Erro ao redefinir senha.");
        return;
      }

      toast("success", "Senha redefinida com sucesso!");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error) {
      alertar("error", "Erro de conexão com o servidor.");
    }
  }

  return (
    <form className="mainSenhaCliente" onSubmit={handleSubmit}>
      <div className="campoSenhaCliente">
        <div className="userTitulo">
          <img src={User} alt="Ícone usuário" />
          <h1>Redefinir Senha</h1>
          <p style={{ color: "#666", fontSize: "14px", textAlign: "center", marginTop: "10px" }}>
            Crie uma nova senha.
          </p>
        </div>

        <div className="campoInput">
          <div className="inputSenhaCliente">
            <div className="grupoSenha">
              <input
                type={isShow ? "text" : "password"}
                placeholder=" "
                minLength={6}
                maxLength={8}
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                required
              />
              <label>Nova Senha</label>
              <button
                type="button"
                className="btn-mostrar-senha"
                onClick={handlePassword}
              >
                {isShow ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>

            <div className="grupoSenha">
              <input
                type={isShow ? "text" : "password"}
                placeholder=" "
                minLength={6}
                maxLength={8}
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
              />
              <label>Confirmar Senha</label>
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

        <Botao nomeBotao={"Trocar Senha"} />
      </div>

      <img className="imgLogo" src={Logo} alt="Logo CollabTechFile" />
    </form>
  );
}
