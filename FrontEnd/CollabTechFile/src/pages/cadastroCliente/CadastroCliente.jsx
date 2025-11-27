import "./CadastroCliente.css";

//Importar o seu SweetAlert
import Swal from 'sweetalert2';

import user from "../../assets/img/user.png"
import Cadastro from "../../components/cadastro/Cadastro";
import MenuLateral from "../../components/menuLateral/MenuLateral";
import { useEffect, useState } from "react";
import api from "../../services/Service";
import Cabecalho from "../../components/cabecalho/Cabecalho";

export default function CadastroCliente() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  const [empresa, setEmpresa] = useState("");
  const [listaEmpresa, setListaEmpresa] = useState([]);

  const [tipoUsuario, setTipoUsuario] = useState("3")

  const [loading, setLoading] = useState(false);

  async function listarEmpresa() {
    try {
      const resposta = await api.get("empresa");
      setListaEmpresa(resposta.data);
    } catch (error) {
      console.log(error);
    }
  }

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
      }
    });
    Toast.fire({
      icon: icone,
      title: mensagem
    });
  }

  async function cadCliente(e) {
    e.preventDefault();

    // Validações
    if (!nome.trim() || !email.trim() || !empresa.trim() ) {
      alertar("warning", "Preencha todos os campos.");
      return;
    }
    const payload = {
      Nome: nome.trim(),
      Email: email.trim(),
      idEmpresa: empresa.trim(),
      idTipoUsuario: tipoUsuario.trim(),
      Ativo: true,
    };

    console.log("Enviando:", payload);

    setLoading(true);
    try {
      const response = await api.post("usuario", payload);

      if (response.status === 201 || response.status === 200) {
        alertar("success", "Cliente cadastrado com sucesso!");
        // Limpa os campos
        setNome("");
        setEmail("");
        setEmpresa("");
        setTipoUsuario("");
      } else {
        alertar("error", `Erro ${response.status}`);
      }
    } catch (error) {
      console.error("Erro completo:", error.response);
      const mensagemErro = error.response?.data?.message ||
        error.response?.data?.errors ||
        error.response?.data ||
        "Erro ao cadastrar cliente";
      alertar("error", JSON.stringify(mensagemErro));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    listarEmpresa();
  }, [])


  return (
    <main className="containerGeral">
      <MenuLateral />
      <div className="conteudoPrincipal">
        <section className="areaTrabalho">
        <Cabecalho />
          <div className="conteudo">

            <Cadastro
              titulo="Cadastro de Cliente"
              visibilidade_campo3="none"
              visibilidade_campoCNPJ="none"
              visibilidade_campo5="none"
              visibilidade_campo6="none"
              funcCadastro={cadCliente}

              //Nome
              campo1="Nome"
              valorInput1={nome}
              setValorInput1={setNome}

              //Email
              campo2="Email"
              tpInput="email"
              valorInput2={email}
              setValorInput2={setEmail}

              // Tipo usuário
              campo3="Tipo Usuário"
              valorTipoUsuario={tipoUsuario}
              setValorTipoUsuario={setTipoUsuario}

              //Empresa
              campo4="Empresa"
              listaEmpresa={listaEmpresa}
              valorEmpresa={empresa}
              setValorEmpresa={setEmpresa}
            />
          </div>
        </section>
      </div>
    </main>
  );
}