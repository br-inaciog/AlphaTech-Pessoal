import { Route, Routes, Navigate } from "react-router-dom"; // ✅ adicionado Navigate
import { useAuth } from "../contexts/AuthContext"; // ✅ adicionado useAuth — ajuste o caminho conforme sua pasta

import Login from "../pages/login/Login";
import Inicio from "../pages/inicio/Inicio";
import ListagemDoc from "../pages/listagemDoc/listagemDoc";
import CadastroCliente from "../pages/cadastroCliente/CadastroCliente";
import CadastroEmpresa from "../pages/cadastroEmpresa/CadastroEmpresa";
import CadastroFuncionario from "../pages/cadastroFuncionario/CadastroFuncionario";
import TelaCliente from "../pages/telaCliente/telaCliente";
import Lixeira from "../pages/lixeira/Lixeira";
import DocAndamentoFunc from "../pages/docAndamentoFunc/DocAndamentoFunc";
import DocAndamentoClie from "../pages/docAndamentoClie/DocAndamentoClie";
import InicioCliente from "../pages/inicioCliente/InicioCliente";
import Feedback from "../pages/Feedbacks/Feedback";
import FaleConosco from "../pages/faleConosco/FaleConosco";
import DocFinalizadoClie from "../pages/docFinalizadoClie/docFinalizadoClie";
import ModalComentarioCliente from "../pages/cometarioCliente/ModalComentarioCliente";
import DocFinalizadoFunc from "../pages/docFinalizadoFunc/DocFinalizadoFunc";

const Privado = (props) => {
    const { usuario } = useAuth(); // ✅ agora reconhecido corretamente

    // Se não estiver autenticado, redireciona para login
    if (!usuario) {
        return <Navigate to="/" />;
    }

    // Se o tipo de usuário não for o permitido, redireciona
    if (usuario.tipoUsuario !== props.tipoPermitido) {
        return <Navigate to="/" />;
    }

    // Caso contrário, renderiza o componente autorizado
    return <props.Item />;
};

const Rotas = () => {
    return (
        <Routes>
            <Route element={<Login />} path="/" exact />

            {/* <Route element={<Privado tipoPermitido="Funcionario" Item={Inicio} />} path="/Inicio" />
      <Route element={<Privado tipoPermitido="Funcionario" Item={ListagemDoc} />} path="/Listagem" />
      <Route element={<Privado tipoPermitido="Funcionario" Item={CadastroCliente} />} path="/CadastroCliente" />
      <Route element={<Privado tipoPermitido="Funcionario" Item={CadastroEmpresa} />} path="/CadastroEmpresa" />
      <Route element={<Privado tipoPermitido="Admin" Item={CadastroFuncionario} />} path="/CadastroFuncionario" />
      <Route element={<Privado tipoPermitido="Cliente" Item={TelaCliente} />} path="/TelaCliente" />
      <Route element={<Privado tipoPermitido="Funcionario" Item={Lixeira} />} path="/Lixeira" />
      <Route element={<Privado tipoPermitido="Funcionario" Item={DocAndamentoFunc} />} path="/docAndamentoFunc" />
      <Route element={<Privado tipoPermitido="Cliente" Item={DocAndamentoClie} />} path="/docAndamentoClie" />
      <Route element={<Privado tipoPermitido="Cliente" Item={Feedback} />} path="/FeedBacks" />
      <Route element={<Privado tipoPermitido="Cliente" Item={FaleConosco} />} path="/FaleConosco" />
      <Route element={<Privado tipoPermitido="Cliente" Item={InicioCliente} />} path="/InicioCliente" />
      <Route element={<Privado tipoPermitido="Cliente" Item={DocFinalizadoClie} />} path="/docFinalizadoClie" />
      <Route element={<Privado tipoPermitido="Cliente" Item={ModalComentarioCliente} />} path="/ModalComentarioCliente" />
      <Route element={<Privado tipoPermitido="Funcionario" Item={DocFinalizadoFunc} />} path="/docFinalizadoFunc" /> */}

            <Route element={<Inicio />} path="/Inicio" />
            <Route element={<ListagemDoc />} path="/Listagem" />
            <Route element={<CadastroCliente />} path="/CadastroCliente" />
            <Route element={<CadastroEmpresa />} path="/CadastroEmpresa" />
            <Route element={<CadastroFuncionario />} path="/CadastroFuncionario" />
            <Route element={<TelaCliente />} path="/TelaCliente" />
            <Route element={<Lixeira />} path="/Lixeira" />
            <Route element={<DocAndamentoFunc />} path="/docAndamentoFunc" />
            <Route element={<DocAndamentoClie />} path="/docAndamentoClie" />
            <Route element={<Feedback />} path="/FeedBacks" />
            <Route element={<FaleConosco />} path="/FaleConosco" />
            <Route element={<InicioCliente />} path="/InicioCliente" />
            <Route element={<DocFinalizadoClie />} path="/docFinalizadoClie" />
            <Route element={<ModalComentarioCliente />} path="/ModalComentarioCliente" />
            <Route element={<DocFinalizadoFunc />} path="/docFinalizadoFunc" />
            <Route element={<DocAndamentoFunc />} path="/docAndamentoFunc/:idDocumento" />
            <Route element={<DocAndamentoClie />} path="/DocAndamentoClie/:idDocumento" />
        </Routes>
    );
};

export default Rotas;
