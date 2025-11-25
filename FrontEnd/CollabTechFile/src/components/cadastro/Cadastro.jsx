import "./Cadastro.css";
import { Eye, EyeOff } from "lucide-react";
import { IMaskInput } from 'react-imask';
import { useState } from "react";

export default function Cadastro(props) {
    const [isShow, setIsShow] = useState(false);

    const handlePassword = (e) => {
        e.preventDefault();
        setIsShow(!isShow);
    };

    return (
        <section className="conteudo">
            <div className="titulo">
                <h1>{props.titulo}</h1>
            </div>

            <form onSubmit={props.funcCadastro} className="formulario">
                <div className="campo">
                    <label>{props.campo1}</label>
                    <input
                        type="text"
                        value={props.valorInput1}
                        onChange={(e) => props.setValorInput1(e.target.value)} />
                </div>

                <div className="campo" style={{ display: props.visibilidade_campoCNPJ }}>
                    <label>CNPJ</label>
                    <IMaskInput
                        mask="00.000.000/0000-00"
                        value={props.valorInputCNPJ}
                        onChange={(e) => props.setValorInputCNPJ(e.target.value)}
                    />
                </div>

                <div className="campo" style={{ display: props.visibilidade_campo2 }}>
                    <label>{props.campo2}</label>
                    <input
                        type={props.tpInput}
                        value={props.valorInput2}
                        onChange={(e) => props.setValorInput2(e.target.value)}
                    />
                </div>

                <div className="campo" style={{ display: props.visibilidade_campo3 }}>
                    <label>{props.campo3}</label>
                    <select
                        name="Tipo Usuário"
                        value={props.valorTipoUsuario}
                        onChange={(e) => props.setValorTipoUsuario(e.target.value)}
                    >
                        <option selected disabled value="">
                            Selecionar Tipo Usuário
                        </option>
                        {props.listaTpUsuario &&
                            props.listaTpUsuario.length > 0 &&
                            props.listaTpUsuario.map((item) =>
                                <option value={item.idTipoUsuario}>{item.tituloTipoUsuario}</option>
                            )}
                    </select>
                </div>

                <div className="campo" style={{ display: props.visibilidade_campo4 }}>
                    <label>{props.campo4}</label>
                    <select
                        name="Empresa"
                        value={props.valorEmpresa}
                        onChange={(e) => props.setValorEmpresa(e.target.value)}
                    >
                        <option disabled value="">
                            Selecionar Empresa
                        </option>
                        {props.listaEmpresa &&
                            props.listaEmpresa.length > 0 &&
                            props.listaEmpresa.map((item) =>
                                <option value={item.idEmpresa}>{item.nome}</option>
                            )}
                    </select>
                </div>

                <div className="campo" style={{ display: props.visibilidade_campo5 }}>
                    <label>{props.campo5}</label>
                    <label className="areaSenha">
                        <input
                            type={isShow ? "text" : "password"}
                            placeholder="Mínimo de 8 caracteres com números e símbolos"
                            value={props.valorInput3}
                            onChange={(e) => props.setValorInput3(e.target.value)}
                        />
                        <button onClick={handlePassword}>
                            {isShow && <Eye size={18} />}
                            {!isShow && <EyeOff size={18} />}
                        </button>
                    </label>
                </div>

                <div className="campo" style={{ display: props.visibilidade_campo6 }}>
                    <label>{props.campo6}</label>
                    <label className="areaSenha">
                        <input
                            type={isShow ? "text" : "password"}
                            value={props.valorInput4}
                            onChange={(e) => props.setValorInput4(e.target.value)}
                        />
                        <button onClick={handlePassword}>
                            {isShow && <Eye size={18} />}
                            {!isShow && <EyeOff size={18} />}
                        </button>
                    </label>
                </div>

                <button type="submit" className="cadastrar">
                    Cadastrar
                </button>
            </form>
        </section >
    );
}
