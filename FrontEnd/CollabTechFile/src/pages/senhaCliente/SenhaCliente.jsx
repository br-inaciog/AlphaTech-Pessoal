import "./SenhaCliente.css";
import Botao from "../../components/botao/Botao";
import User from "../../assets/img/UserModoClaro.png";
import Logo from "../../assets/img/Logo.png";

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

export default function SenhaCliente() {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // Pegando o ID enviado pela tela anterior
  const location = useLocation();
  const idUsuario = location.state?.id; 

  const navigate = useNavigate();

  function toast(icon, title) {
    const T = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });
    T.fire({ icon, title });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (novaSenha.length < 6 || novaSenha.length > 8) {
      toast("warning", "A senha deve ter entre 6 e 8 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      toast("error", "As senhas não coincidem.");
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
        toast("error", "Erro ao redefinir senha.");
        return;
      }

      toast("success", "Senha redefinida com sucesso!");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error) {
      toast("error", "Erro de conexão com o servidor.");
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
                type="password"
                minLength={6}
                maxLength={8}
                autoComplete="new-password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                required
              />
              <label>Nova Senha</label>
            </div>

            <div className="grupoSenha">
              <input
                type="password"
                minLength={6}
                maxLength={8}
                autoComplete="new-password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
              />
              <label>Confirmar Senha</label>
            </div>
          </div>
        </div>

        <Botao nomeBotao={"Trocar Senha"} />
      </div>

      <img className="imgLogo" src={Logo} alt="Logo CollabTechFile" />
    </form>
  );
}
