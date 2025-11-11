import { useState } from "react";
import { Link } from "react-router";
import "./MenuLateral.css";
import LogoMenu from "../../assets/img/logoMenu.png";
import Casinha from "../../assets/img/Casinha.png";
import Documents from "../../assets/img/Documents.png";
import Cliente from "../../assets/img/Cliente.png";
import Cadastrar from "../../assets/img/Cadastrar.png";
import FeedBack from "../../assets/img/Feedback.png";
import Logout from "../../assets/img/Logout.png";
import MenuHb from "../../assets/img/Menu.png";
import fonezinho from "../../assets/img/fone.png";

const acesso = "funcionario"; // ou "cliente", se quiser trocar

export default function MenuLateral() {
  const [menuAberto, setMenuAberto] = useState(false);

  const handleLogout = () => {
    console.log("Usuário deslogado"); // aqui tu coloca tua função real de logout
  };

  return (
    <>
      {/* Botão hamburguer (mobile) */}
      <button className="menuHb" onClick={() => setMenuAberto(!menuAberto)}>
        <img src={MenuHb} alt="Abrir menu" />
      </button>

      {/* Sidebar */}
      <header className={`menuLateral ${menuAberto ? "ativo" : ""}`}>
        <img src={LogoMenu} alt="Logo CollabTech Menu" className="logoMenu" />

        {/* Se for funcionário */}
        {acesso === "funcionario" ? (
          <div className="linksLateral">
            <Link
              to="/Inicio"
              className="links"
              onClick={() => setMenuAberto(false)}
            >
              <img src={Casinha} alt="Casinha" />
              Início
            </Link>

            <Link
              to="/CadastroCliente"
              className="links"
              onClick={() => setMenuAberto(false)}
            >
              <img src={Cadastrar} alt="Usuário" />
              Cadastrar Clientes
            </Link>

            <Link
              to="/Listagem"
              className="links"
              onClick={() => setMenuAberto(false)}
            >
              <img src={Documents} alt="Documentos" />
              Documentos
            </Link>

            <Link
              to="/TelaCliente"
              className="links"
              onClick={() => setMenuAberto(false)}
            >
              <img src={Cliente} alt="Clientes" />
              Clientes
            </Link>
          </div>
        ) : (
          // Se for cliente
          <div className="linksLateral">
            <Link
              to="/InicioCliente"
              className="links"
              onClick={() => setMenuAberto(false)}
            >
              <img src={Casinha} alt="Casinha" />
              Início
            </Link>

            <Link
              to="/FaleConosco"
              className="links"
              onClick={() => setMenuAberto(false)}
            >
              <img src={fonezinho} alt="fonezinho" />
              Fale Conosco
            </Link>
          </div>
        )}

        {/* Botão de logout */}
        <Link to="/" className="logout" onClick={handleLogout}>
          <img src={Logout} alt="Logout" />
          Sair
        </Link>
      </header>

      {/* Fundo escuro pra fechar o menu ao clicar fora */}
      {menuAberto && (
        <div className="overlay" onClick={() => setMenuAberto(false)} />
      )}
    </>
  );
}
