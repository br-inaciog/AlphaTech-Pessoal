import "./Cabecalho.css"
import user from "../../assets/img/User.png"
import Seta from "../../assets/img/Seta.png"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react";
import { userDecodeToken } from "../../auth/Auth"; 

export default function Cabecalho() {
    
    const [usuario, setUsuario] = useState(null); 

    useEffect(() => {
        const dadosUsuario = userDecodeToken(); 
        
        if (dadosUsuario) {
            setUsuario(dadosUsuario); 
        }
    }, []);

    return (
        <header>
            <nav className="cabecalho">
                <Link to="/Inicio">
                    <img className="setaImg" src={Seta} alt="Seta" />
                </Link>

                <div className="campoTipoUsuario">
                    <img src={user} alt="user" />
                    
                    {usuario ? (
                        <div className="infos-usuario">
                            <p className="usuario-nome">{usuario.nome}</p>
                            <p className="usuario-tipo">{usuario.tipoUsuario}</p>
                        </div>
                    ) : (
                        <p>Usuário não encontrado.</p>
                    )}
                </div>
            </nav>
        </header>
    )
}