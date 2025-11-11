import "./MenuLateralCliente.css"

import LogoMenu from '../../assets/img/logoMenu.png';
import Casinha from '../../assets/img/Casinha.png';
import FaleConosco from "../../assets/img/FaleConosco.png"
import Logout from '../../assets/img/Logout.png';

import { Link } from 'react-router';

export default function MenuLateralCliente() {
    return (
        <header className="menuLateral">
            <img src={LogoMenu} alt="Logo CollabTech Menu" className="logoMenu" />

            <div className="linksLateral">
                <Link to="/InicioCliente" className="links">
                    <img src={Casinha} alt="Casinha" />
                    Início
                </Link>

                <Link to="/FaleConosco" className="links">
                    <img src={FaleConosco} alt="FaleConosco" />
                    Deixe Seu FeedBack
                </Link>
            </div>

            <Link to="/" className="logout">
                <img src={Logout} alt="" />
                Sair
            </Link>
        </header>
    )
}