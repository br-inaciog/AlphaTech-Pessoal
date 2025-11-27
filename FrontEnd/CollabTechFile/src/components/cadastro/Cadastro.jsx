import "./Cadastro.css";
import { IMaskInput } from 'react-imask';

export default function Cadastro(props) {
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

                <button type="submit" className="cadastrar">
                    Cadastrar
                </button>
            </form>
        </section >
    );
}
