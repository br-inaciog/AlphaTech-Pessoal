import MenuLateral from '../../components/menuLateral/MenuLateral';
import Cabecalho from '../../components/cabecalho/Cabecalho';
import Editar from '../../assets/img/Editar.png';
import Toggle from '../../components/toogle/toogle';
import ModalFiltroFuncionario from '../../components/filtroFuncionario/ModalFiltroFuncionario';
import './listagemFuncionario.css';
import { useEffect, useState } from 'react';
import api from '../../services/Service';
import Swal from 'sweetalert2';

export default function ListagemFuncionario() {
    const [funcionarios, setFuncionarios] = useState([]);
    const [funcionariosFiltrados, setFuncionariosFiltrados] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalFiltroAberto, setModalFiltroAberto] = useState(false);
    const [filtrosAtivos, setFiltrosAtivos] = useState({ empresa: '', cliente: '', nome: '' });

    async function buscarEmpresas() {
        try {
            const response = await api.get("empresa");
            setEmpresas(response.data);
        } catch (error) {
            alertar("error", "Erro ao carregar lista de empresas");
        }
    }

    async function buscarFuncionarios() {
        setLoading(true);
        try {
            const response = await api.get("usuario");
            const funcionariosFiltrados = response.data.filter(u => u.idTipoUsuario === 5);
            setFuncionarios(funcionariosFiltrados);
            setFuncionariosFiltrados(funcionariosFiltrados);
        } catch (error) {
            alertar("error", "Erro ao carregar lista de funcionários");
        } finally {
            setLoading(false);
        }
    }

    function obterNomeEmpresa(idEmpresa) {
        if (!idEmpresa) return 'Não informado';
        const empresa = empresas.find(e => e.idEmpresa === idEmpresa);
        return empresa ? empresa.nome : 'Não informado';
    }

    function alertar(icone, mensagem) {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });
        Toast.fire({ icon: icone, title: mensagem });
    }

    async function alterarStatus(funcionario) {
        try {
            const novoStatus = !funcionario.ativo;
            const funcionarioId = funcionario.id || funcionario.idUsuario;
            await api.put(`usuario/${funcionarioId}`, { ...funcionario, ativo: novoStatus });
            setFuncionarios(funcionarios.map(f => (f.id || f.idUsuario) === funcionarioId ? { ...f, ativo: novoStatus } : f));
            alertar("success", `Funcionário ${novoStatus ? 'ativado' : 'inativado'} com sucesso!`);
        } catch {
            alertar("error", "Erro ao alterar status do funcionário");
        }
    }

    function aplicarFiltros(filtros) {
        setFiltrosAtivos(filtros);
        let filtrados = [...funcionarios];

        if (filtros.empresa) {
            filtrados = filtrados.filter(f => obterNomeEmpresa(f.idEmpresa).toLowerCase().includes(filtros.empresa.toLowerCase()));
        }
        if (filtros.nome) {
            filtrados = filtrados.filter(f => f.nome.toLowerCase().includes(filtros.nome.toLowerCase()));
        }

        setFuncionariosFiltrados(filtrados);
        setModalFiltroAberto(false); // fecha o modal depois de aplicar
    }

    function limparFiltros() {
        setFiltrosAtivos({ empresa: '', cliente: '', nome: '' });
        setFuncionariosFiltrados(funcionarios);
    }

    useEffect(() => {
        async function carregarDados() {
            await buscarEmpresas();
            await buscarFuncionarios();
        }
        carregarDados();
    }, []);

    return (
        <div className="containerGeral">
            <MenuLateral />
            <main className="conteudoPrincipal funcionarioPrincipal">
                <section className="areaTrabalho">
                    <Cabecalho />
                    <div className="titulo">
                        <h1>Listagem de Funcionários</h1>
                        <div className="controles">
                            <button 
                                className="btnFiltros"
                                onClick={() => setModalFiltroAberto(true)}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#001f3f',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    marginRight: '10px',
                                    marginBottom: '15px',
                                    marginTop: '15px',
                                    width: '100%'   
                                }}
                            >
                                Filtrar
                            </button>

                            {(filtrosAtivos.empresa || filtrosAtivos.nome) && (
                                <button 
                                    className="btnLimparFiltros"
                                    onClick={limparFiltros}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Limpar Filtros
                                </button>
                            )}
                        </div>

                        {loading && <p>Carregando...</p>}
                    </div>

                    <div className="tabelaFuncionarioContainer">
                        <table className="tabelaFuncionario">
                            <thead>
                                <tr>
                                    <th>Funcionário</th>
                                    <th>Email</th>
                                    <th>Empresa</th>
                                    <th>Status</th>
                                    <th>Editar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(funcionariosFiltrados.length === 0 && !loading) || empresas.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center' }}>
                                            {empresas.length === 0 ? 'Carregando empresas...' : 'Nenhum funcionário encontrado'}
                                        </td>
                                    </tr>
                                ) : (
                                    funcionariosFiltrados.map((funcionario, index) => (
                                        <tr key={`funcionario-${funcionario.id}-${index}`}>
                                            <td>{funcionario.nome}</td>
                                            <td>{funcionario.email}</td>
                                            <td>{obterNomeEmpresa(funcionario.idEmpresa)}</td>
                                            <td style={{ textAlign: 'left' }}>
                                                <Toggle 
                                                    presenca={funcionario.ativo !== false}
                                                    manipular={() => alterarStatus(funcionario)}
                                                />
                                            </td>
                                            <td>
                                                <button
                                                    className="btnEditar"
                                                    onClick={() => editarFuncionario(funcionario)}
                                                >
                                                    <img src={Editar} alt="Editar" className="iconEditar" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>

            <ModalFiltroFuncionario
                aberto={modalFiltroAberto}
                onClose={() => setModalFiltroAberto(false)}
                empresas={empresas}
                onAplicarFiltros={aplicarFiltros}
            />
        </div>
    );
}
