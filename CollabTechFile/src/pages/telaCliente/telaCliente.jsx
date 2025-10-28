import MenuLateral from '../../components/menuLateral/MenuLateral';
import Cabecalho from '../../components/cabecalho/Cabecalho';
import Editar from '../../assets/img/Editar.png';
import Toggle from '../../components/toogle/toogle';
import './telaCliente.css';
import { useEffect, useState } from 'react';
import api from '../../services/Service';
import Swal from 'sweetalert2';



export default function TelaCliente() {
    const [clientes, setClientes] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(false);

    async function buscarEmpresas() {
        try {
            const response = await api.get("empresa");
            setEmpresas(response.data);
        } catch (error) {
            console.error("Erro ao buscar empresas:", error);
        }
    }

    async function buscarClientes() {
        setLoading(true);
        try {
            const response = await api.get("usuario");

            // Filtrar apenas usuários com idTipoUsuario = 4 (clientes) - mostrar todos (ativos e inativos)
            const clientesFiltrados = response.data.filter(usuario => usuario.idTipoUsuario === 4);

            setClientes(clientesFiltrados);
        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
            alertar("error", "Erro ao carregar a lista de clientes");
        } finally {
            setLoading(false);
        }
    }

    // Função para obter nome da empresa pelo ID
    function obterNomeEmpresa(idEmpresa) {
        if (!idEmpresa) return 'Não informado';

        const empresa = empresas.find(emp => emp.idEmpresa === idEmpresa);
        return empresa ? empresa.nome : 'Não informado';
    }

    function alertar(icone, mensagem) {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });
        Toast.fire({
            icon: icone,
            title: mensagem
        });
    }

    // Função para alterar status ativo/inativo
    async function alterarStatus(cliente) {
        try {
            const novoStatus = !cliente.ativo;
            
            const dadosAtualizados = {
                ...cliente,
                ativo: novoStatus
            };

            const clienteId = cliente.id || cliente.idUsuario;
            
            await api.put(`usuario/${clienteId}`, dadosAtualizados);
            
            // Atualizar o estado local para refletir a mudança imediatamente
            setClientes(clientes.map(c => 
                (c.id || c.idUsuario) === clienteId 
                    ? { ...c, ativo: novoStatus }
                    : c
            ));
            
            alertar("success", `Cliente ${novoStatus ? 'ativado' : 'inativado'} com sucesso!`);
            
        } catch (error) {
            console.error("Erro ao alterar status:", error);
            alertar("error", "Erro ao alterar status do cliente");
        }
    }

    async function editarCliente(cliente) {
        // Criar opções do select de empresas
        const opcoesEmpresas = empresas.map((empresa, index) =>
            `<option value="${empresa.idEmpresa}" ${empresa.idEmpresa === cliente.idEmpresa ? 'selected' : ''}>${empresa.nome}</option>`
        ).join('');

        const { value: formValues } = await Swal.fire({
            title: 'Editar Cliente',
            html:
                `<input id="swal-input1" class="swal2-input" placeholder="Nome" value="${cliente.nome}">` +
                `<input id="swal-input2" class="swal2-input" placeholder="Email" value="${cliente.email}">` +
                `<select id="swal-input3" class="swal2-input" style="display: flex; text-align: center; text-align-last: center; width: 100%; box-sizing: border-box;">
                    <option value="">Selecione uma empresa</option>
                    ${opcoesEmpresas}
                </select>`,
            focusConfirm: false,
            preConfirm: () => {
                const nome = document.getElementById('swal-input1').value;
                const email = document.getElementById('swal-input2').value;
                const idEmpresa = document.getElementById('swal-input3').value;

                if (!nome || !email) {
                    Swal.showValidationMessage('Nome e email são obrigatórios!');
                    return false;
                }

                // Validação básica de email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    Swal.showValidationMessage('Por favor, insira um email válido!');
                    return false;
                }

                return [nome, email, idEmpresa];
            },
            showCancelButton: true,
            confirmButtonText: 'Salvar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#001f3f',
            cancelButtonColor: 'rgba(71, 4, 4, 1)'
        });

        if (formValues) {
            const [nome, email, idEmpresa] = formValues;

            try {

                const dadosAtualizados = {
                    ...cliente,
                    nome: nome,
                    email: email,
                    idEmpresa: idEmpresa ? parseInt(idEmpresa) : cliente.idEmpresa
                };

                // Usar idUsuario se id não existir
                const clienteId = cliente.id || cliente.idUsuario;

                await api.put(`usuario/${clienteId}`, dadosAtualizados);
                alertar("success", "Cliente atualizado com sucesso!");
                buscarClientes();

            } catch (error) {
                console.error("Erro ao atualizar cliente:", error);
                console.error("Detalhes do erro:", error.response?.data);
                alertar("error", "Erro ao atualizar cliente");
            }
        }
    }


    useEffect(() => {
        async function carregarDados() {
            await buscarEmpresas();
            await buscarClientes();
        }
        carregarDados();
    }, []);

    return (
        <div className="containerGeral">
            <MenuLateral />
            <main className="conteudoPrincipal clientePrincipal">
                <section className="areaTrabalho">
                    <Cabecalho />
                    <div className="titulo">
                        <h1>Tela Clientes</h1>
                        {loading && <p>Carregando...</p>}
                    </div>
                    <div className="tabelaClienteContainer">
                        <table className="tabelaCliente">
                            <thead>
                                <tr>
                                    <th>Cliente</th>
                                    <th>Email</th>
                                    <th>Empresa</th>
                                    <th>Status</th>
                                    <th>Editar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(clientes.length === 0 && !loading) || empresas.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center' }}>
                                            {empresas.length === 0 ? 'Carregando empresas...' : 'Nenhum cliente encontrado'}
                                        </td>
                                    </tr>
                                ) : (
                                    clientes.map((cliente, index) => (
                                        <tr key={`cliente-${cliente.id}-${index}`}>
                                            <td>{cliente.nome}</td>
                                            <td>{cliente.email}</td>
                                            <td>{obterNomeEmpresa(cliente.idEmpresa)}</td>
                                            <td style={{ textAlign: 'left' }}>
                                                <Toggle 
                                                    presenca={cliente.ativo !== false}
                                                    manipular={() => alterarStatus(cliente)}
                                                />
                                            </td>
                                            <td>
                                                <button
                                                    className="btnEditar"
                                                    onClick={() => editarCliente(cliente)}
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
        </div>
    );
}