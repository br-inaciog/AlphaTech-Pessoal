import "./Botao.css"
import { Link } from 'react-router';

export default function Botao(props) {
    return (
        <>
            <button className="botaoLogin">
                {props.nomeBotao}
            </button>
        </>
    )
}