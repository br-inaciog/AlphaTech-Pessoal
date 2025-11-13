import "./Cabecalho.css"

import User from "../../assets/img/User.png"

import Seta from "../../assets/img/Seta.png"
import { Link } from "react-router-dom"

export default function Cabecalho() {
    return (
        <header>
            <nav className="cabecalho">
                <Link to="/Inicio">
                    <img className="setaImg" src={Seta} alt="Seta" />
                </Link>
            </nav>

        </header>
    )
}