import "./Cabecalho.css"
import user from "../../assets/img/User.png"
import Seta from "../../assets/img/Seta.png"
// Importamos 'useNavigate' em vez de 'Link'
import { useNavigate } from "react-router-dom" 
import { useEffect, useState } from "react";
import { userDecodeToken } from "../../auth/Auth";
import secureLocalStorage from "react-secure-storage";

export default function Cabecalho() {
    const [usuario, setUsuario] = useState(null);
    
    const navigate = useNavigate(); 

    const handleVoltar = () => {
        navigate(-1); 
    };

    useEffect(() => {
        const token = secureLocalStorage.getItem("token");

        if (token) {
            const dadosUsuario = userDecodeToken(token);
            setUsuario(dadosUsuario);
        }
    }, []);

    return (
        <header>
            <nav className="cabecalho">
                <div 
                    onClick={handleVoltar}
                    className="seta-voltar-container" 
                    style={{ cursor: 'pointer' }} 
                >
                    <img className="setaImg" src={Seta} alt="Voltar" />
                </div>

                <div className="campoTipoUsuario">
                    <img src={user} alt="user" />

                    {usuario ? (
                        <div className="infos-usuario">
                            <p className="usuario-nome">{usuario.nome} - {usuario.tipoUsuario}</p>
                        </div>
                    ) : (
                        <p>Usuário não encontrado.</p>
                    )}
                </div>
            </nav>
        </header>
    )
}