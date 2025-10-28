import "./MenuLateral.css";
import LogoMenu from '../../assets/img/logoMenu.png';
import Casinha from '../../assets/img/Casinha.png';
import Documents from '../../assets/img/Documents.png';
import Cliente from '../../assets/img/Cliente.png';
import Cadastrar from '../../assets/img/Cadastrar.png';
import FeedBack from '../../assets/img/Feedback.png'
import Logout from '../../assets/img/Logout.png';

import { Link } from 'react-router';

export default function MenuLateral() {
    return (
        <header className="menuLateral">
            <img src={LogoMenu} alt="Logo CollabTech Menu" className="logoMenu" />

            <div className="linksLateral">
                <Link to="/Inicio" className="links">
                    <img src={Casinha} alt="Casinha" />
                    Início
                </Link>

                <Link to="/CadastroCliente" className="links">
                    <img src={Cadastrar} alt="Usuário" />
                    Cadastrar Clientes
                </Link>

                <Link to="/Listagem" className="links">
                    <img src={Documents} alt="Documentos"/>
                    Documentos
                </Link>

                <Link to="/TelaCliente" className="links">
                    <img src={Cliente} alt="Clientes" />
                    Clientes
                </Link>

                <Link to="/FeedBacks" className="links">
                    <img src={FeedBack} alt="FeedBacks" />
                    Comentários
                </Link>
            </div>

            <Link to="/" className="logout">
                <img src={Logout} alt="" />
                Sair
            </Link>
        </header>
    )
}