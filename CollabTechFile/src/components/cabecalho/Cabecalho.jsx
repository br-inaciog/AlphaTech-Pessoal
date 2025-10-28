import "./Cabecalho.css"

import Lupa from "../../assets/img/Lupa.png"
import User from "../../assets/img/User.png"

import Seta from "../../assets/img/Seta.png"
import { Link } from "react-router-dom"

export default function Cabecalho() {
    return (
        <header>
            <nav className="cabecalho">
                <div className="grupoPesquisa">
                    <input type="search" placeholder="Pesquisar..."/>
                    <img src={Lupa} alt="Imagem Lupa" />
                </div>

                <div className="infCabecalho">
                    <div className="infUser">
                        <img src={User} alt="Usuário Img" />
                        <p>Funcionario</p>
                    </div>
                   
                </div>

            </nav>
            
            <Link to="/Inicio">
                <img className="setaImg" src={Seta} alt="Seta" />
            </Link>
        </header>
    )
}