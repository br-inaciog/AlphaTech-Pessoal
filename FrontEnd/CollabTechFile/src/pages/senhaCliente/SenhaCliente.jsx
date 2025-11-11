import "./SenhaCliente.css";
import Botao from "../../components/botao/Botao";
import User from "../../assets/img/UserModoClaro.png";
import Logo from "../../assets/img/Logo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function SenhaCliente() {
  const [email, setEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
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

    const emailTrim = email.trim();

    if (!emailTrim || !novaSenha || !confirmarSenha) {
      toast("warning", "Preencha todos os campos.");
      return;
    }

    if (novaSenha.length < 6 || novaSenha.length > 8) {
      toast("warning", "A senha deve ter entre 6 e 8 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      toast("error", "As senhas não coincidem.");
      return;
    }

    setLoading(true);

    
    setTimeout(() => {
      toast("success", "Senha redefinida com sucesso!");
      setLoading(false);
      navigate("/");
    }, 1500);
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
                disabled={loading}
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
                disabled={loading}
                required
              />
              <label>Confirmar Senha</label>
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} style={{ all: "unset" }}>
          <Botao nomeBotao={loading ? "Salvando..." : "Redefinir Senha"} />
        </button>
      </div>

      <img className="imgLogo" src={Logo} alt="Logo CollabTechFile" />
    </form>
  );
}