import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import "./MenuLateral.css";
import LogoMenu from "../../assets/img/logoMenu.png";
import Casinha from "../../assets/img/Casinha.png";
import Documents from "../../assets/img/Documents.png";
import Cliente from "../../assets/img/Cliente.png"; 
import Cadastrar from "../../assets/img/Cadastrar.png"; 
import Logout from "../../assets/img/Logout.png";
import MenuHb from "../../assets/img/Menu.png";
import fonezinho from "../../assets/img/fone.png";
import { useAuth } from "../../contexts/AuthContext";
import secureLocalStorage from "react-secure-storage";
import { userDecodeToken } from "../../auth/Auth";

export default function MenuLateral() {
    const [menuAberto, setMenuAberto] = useState(false);
    const [cadastrosAbertos, setCadastrosAbertos] = useState(false);
    const [listagensAbertas, setListagensAbertas] = useState(false); 

    const { logout } = useAuth();
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const token = secureLocalStorage.getItem("token");
        const dadosUsuario = userDecodeToken(token);
        setUsuario(dadosUsuario);
    }, []);

    const handleLogout = () => {
        logout();
        setMenuAberto(false);
        setCadastrosAbertos(false);
        setListagensAbertas(false); 
    };

    const handleLinkClick = () => {
        setMenuAberto(false);
    };
    
    const closeMenu = () => {
        setMenuAberto(false);
        setCadastrosAbertos(false);
        setListagensAbertas(false); 
    };

    const linksDeNavegacao = useMemo(() => {
        const linksCliente = [
            { to: "/InicioCliente", icon: Casinha, alt: "Início", text: "Início" },
            { to: "/FaleConosco", icon: fonezinho, alt: "Fale Conosco", text: "Fale Conosco" },
        ];

        const linksFuncionario = [
            { to: "/Inicio", icon: Casinha, alt: "Início", text: "Início" },
            { to: "/Listagem", icon: Documents, alt: "Documentos", text: "Documentos" },
        ];

        const subLinksCadastros = [
            { to: "/CadastroEmpresa", icon: Cadastrar, alt: "Cadastrar Empresa", text: "Cadastrar Empresa" },
            { to: "/CadastroFuncionario", icon: Cadastrar, alt: "Cadastrar Funcionário", text: "Cadastrar Funcionários" },
            { to: "/CadastroCliente", icon: Cadastrar, alt: "Cadastrar Cliente", text: "Cadastrar Clientes" },
        ];

        const subLinksListagens = [
            { to: "/listagemFuncionario", icon: Cliente, alt: "Listar Funcionários", text: "Listar Funcionários" },
            { to: "/TelaCliente", icon: Cliente, alt: "Clientes", text: "Clientes" },
        ];


        const linksAdministrador = [
            { type: "submenu", text: "Cadastros", icon: Cadastrar, sublinks: subLinksCadastros, state: cadastrosAbertos, setState: setCadastrosAbertos },
            
            { type: "submenu", text: "Listagens", icon: Documents, sublinks: subLinksListagens, state: listagensAbertas, setState: setListagensAbertas },
        ];

        return { linksCliente, linksFuncionario, linksAdministrador };
    }, [cadastrosAbertos, listagensAbertas]); 

    const tipoUsuario = usuario?.tipoUsuario;

    let linksParaExibir = [];

    if (tipoUsuario === "Cliente") {
        linksParaExibir = linksDeNavegacao.linksCliente;
    } else if (tipoUsuario === "Funcionario") {
        linksParaExibir = linksDeNavegacao.linksFuncionario;
    } else if (tipoUsuario === "Administrador") {
        linksParaExibir = [
            ...linksDeNavegacao.linksFuncionario, 
            ...linksDeNavegacao.linksAdministrador
        ];
    }

    const renderSubmenu = (link, index) => (
        <div key={index} className="submenuContainer">
            <button 
                className={`links ${link.state ? "ativo" : ""}`}
                onClick={() => link.setState(!link.state)}
            >
                <img src={link.icon} alt={link.alt || link.text} />
                {link.text}
            </button>
            
            {link.state && (
                <div className="sublinks">
                    {link.sublinks.map((sublink, subIndex) => (
                        <Link
                            key={subIndex}
                            to={sublink.to}
                            className="sublinkItem"
                            onClick={handleLinkClick}
                        >
                            <img src={sublink.icon} alt={sublink.alt} />
                            {sublink.text}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <>
            <button className="menuHb" onClick={() => setMenuAberto(!menuAberto)}>
                <img src={MenuHb} alt="Abrir menu" />
            </button>

            <header className={`menuLateral ${menuAberto ? "ativo" : ""}`}>
                <img src={LogoMenu} alt="Logo CollabTech Menu" className="logoMenu" />

                <div className="linksLateral">
                    {linksParaExibir.map((link, index) => {
                        if (link.type === "submenu") {
                            return renderSubmenu(link, index);
                        }

                        return (
                            <Link
                                key={index}
                                to={link.to}
                                className="links"
                                onClick={handleLinkClick}
                            >
                                <img src={link.icon} alt={link.alt} />
                                {link.text}
                            </Link>
                        );
                    })}

                    {linksParaExibir.length === 0 && tipoUsuario && (
                        <p className="alertaMenu">Menu não configurado para o tipo "{tipoUsuario}"</p>
                    )}

                </div>

                <button className="logout" onClick={handleLogout}>
                    <img src={Logout} alt="Logout" />
                    Sair
                </button>
            </header>

            {menuAberto && (
                <div className="overlay" onClick={closeMenu} />
            )}
        </>
    );
}