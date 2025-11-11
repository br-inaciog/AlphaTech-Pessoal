import "./CadastroFuncionario.css";

//Importar o seu SweetAlert
import Swal from 'sweetalert2';
import user from "../../assets/img/user.png"
import Cadastro from "../../components/cadastro/Cadastro";
import MenuLateral from "../../components/menuLateral/MenuLateral";
import { useEffect, useState } from "react";
import api from "../../services/Service";

export default function CadastroFuncionario() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaVerificacao, setSenhaVerficacao] = useState("");

  const [tipoUsuario, setTipoUsuario] = useState("");
  const [listaTipoUsuario, setListaTipoUsuario] = useState([]);

  const [empresa, setEmpresa] = useState("");
  const [listaEmpresa, setListaEmpresa] = useState([]);

  const [loading, setLoading] = useState(false);

  function alertar(icone, mensagem) {
    const Toast = Swal.mixin({
      theme: 'dark',
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: icone,
      title: mensagem,
    });
  }

  async function listarTipoUsuario() {
    try {
      const resposta = await api.get("tipoUsuario");
      setListaTipoUsuario(resposta.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function listarEmpresa() {
    try {
      const resposta = await api.get("empresa");
      setListaEmpresa(resposta.data);
    } catch (error) {
      console.log(error);
    }
  }

  function validarSenha(senha) { // Pelo menos 8 caracteres, incluindo números e símbolos
    const regexSenha = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return regexSenha.test(senha);
  }

  async function cadFuncionario(e) {
    e.preventDefault();

    if (!nome.trim() || !email.trim() || !empresa || !tipoUsuario || !senha || !senhaVerificacao) {
      alertar("warning", "Preencha todos os campos.");
      return;
    }

    if (!validarSenha(senha)) {
      alertar("warning", "A senha deve ter mínimo 8 caracteres, com números e símbolos.");
      return;
    }

    if (senha !== senhaVerificacao) {
      alertar("error", "As senhas não coincidem.");
      return;
    }

    const payload = {
      nome: nome.trim(),
      email: email.trim(),
      idTipoUsuario: tipoUsuario,
      idEmpresa: empresa,
      senha: senha,
    };

    setLoading(true);
    try {
      const response = await api.post("usuario", payload);

      if (response.status === 201 || response.status === 200) {
        alertar("success", "Funcionário cadastrado com sucesso!");
        setNome("");
        setEmail("");
        setEmpresa("");
        setTipoUsuario("");
        setSenha("");
        setSenhaVerficacao("");
      } else {
        alertar("error", `Erro ${response.status}`);
      }
    } catch (error) {
      console.error("Erro completo:", error.response);
      const mensagemErro =
        error.response?.data?.message ||
        error.response?.data?.errors ||
        error.response?.data ||
        "Erro ao cadastrar funcionário";
      alertar("error", JSON.stringify(mensagemErro));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    listarEmpresa();
    listarTipoUsuario();
  }, [listaEmpresa]);

  return (
    <main className="containerGeral">
      <MenuLateral />
      <div className="conteudoPrincipal">
        <header className="header">
          <div className="usuario">
            <img src={user} alt="user" />
            <p>Admin</p>
          </div>
        </header>
        <section className="areaTrabalho">
          <div className="conteudo">
            <Cadastro
              titulo="Cadastro Funcionário"
              visibilidade_campoCNPJ="none"
              funcCadastro={cadFuncionario}

              // Nome
              campo1="Nome"
              valorInput1={nome}
              setValorInput1={setNome}

              // Email
              campo2="Email"
              tpInput="email"
              valorInput2={email}
              setValorInput2={setEmail}

              // Tipo usuário
              campo3="Tipo Usuário"
              listaTpUsuario={listaTipoUsuario}
              valorTipoUsuario={tipoUsuario}
              setValorTipoUsuario={setTipoUsuario}

              // Empresa
              campo4="Empresa"
              listaEmpresa={listaEmpresa}
              valorEmpresa={empresa}
              setValorEmpresa={setEmpresa}

              // Senha
              campo5="Senha"
              valorInput3={senha}
              setValorInput3={setSenha}

              // Confirmar senha
              campo6="Confirmar Senha"
              valorInput4={senhaVerificacao}
              setValorInput4={setSenhaVerficacao}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
