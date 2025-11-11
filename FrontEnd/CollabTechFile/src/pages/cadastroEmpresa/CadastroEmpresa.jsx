import MenuLateral from "../../components/menuLateral/MenuLateral";
import { useState } from "react";
import Swal from "sweetalert2";
import api from "../../Services/service";
import "./CadastroEmpresa.css";
import user from "../../assets/img/user.png";
import Cadastro from "../../components/cadastro/Cadastro";

export default function CadastroEmpresa() {
  const [empresa, setEmpresa] = useState("");
  const [CNPJ, setCNPJ] = useState("");

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

  async function cadEmpresa(e) {
    e.preventDefault();

    console.log(empresa);
    console.log(CNPJ);

    if (empresa.trim() != "") {
      try {
        await api.post("Empresa", {
          nome: empresa,
          CNPJ: CNPJ
        });

        alertar("success", "Cadastro Realizado!");
        setEmpresa("");
        setCNPJ("");
      } catch (error) {
        alertar("error", "Erro. Entre em contato com o suporte!");
        console.log(error);

        console.log({
          nome: empresa,
          cnpj: CNPJ
        });
      }
    } else {
      alertar("warning", "O campo precisa estar Preenchido")
    }
  }

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
              titulo="Cadastro Empresa"
              campo1="Empresa"
              tpInput="text"
              visibilidade_campo2="none"
              visibilidade_campo3="none"
              visibilidade_campo4="none"
              visibilidade_campo5="none"
              visibilidade_campo6="none"

              funcCadastro={cadEmpresa}
              valorInput1={empresa}
              setValorInput1={setEmpresa}
              valorInputCNPJ={CNPJ}
              setValorInputCNPJ={setCNPJ}
            />
          </div>
        </section>
      </div>
    </main>
  );
}