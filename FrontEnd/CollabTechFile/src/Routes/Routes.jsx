import { Route, Routes } from "react-router";
import Login from "../pages/login/Login";
import Inicio from "../pages/inicio/Inicio";
import ListagemDoc from "../pages/listagemDoc/listagemDoc";
import CadastroCliente from "../pages/CadastroCliente/CadastroCliente";
import CadastroEmpresa from "../pages/cadastroEmpresa/CadastroEmpresa";
import CadastroFuncionario from "../pages/cadastroFuncionario/CadastroFuncionario";
import TelaCliente from "../pages/telaCliente/telaCliente";
import Lixeira from "../pages/lixeira/Lixeira";
import DocAndamentoFunc from "../pages/docAndamentoFunc/DocAndamentoFunc";
import DocAndamentoClie from "../pages/docAndamentoClie/DocAndamentoClie";
import InicioCliente from "../pages/inicioCliente/InicioCliente";
import FaleConosco from "../pages/faleConosco/FaleConosco";
import VisualizarDoc from "../pages/visualizarDoc/Visualizar";
import DocFinalizadoClie from "../pages/docFinalizadoClie/docFinalizadoClie";
import DocFinalizadoFunc from "../pages/docFinalizadoFunc/DocFinalizadoFunc";
import ListagemFuncionario from "../pages/listagemFuncionario/listagemFuncionario";

const Rotas = () => {
  return (<Routes> <Route element={<Login />} path="/" exact />
    <Route element={<Inicio />} path="/Inicio" />
    <Route element={<ListagemDoc />} path="/Listagem" />
    <Route element={<ListagemFuncionario />} path="/ListagemFuncionarios" />
    <Route element={<CadastroCliente />} path="/CadastroCliente" />
    <Route element={<CadastroEmpresa />} path="/CadastroEmpresa" />
    <Route element={<CadastroFuncionario />} path="/CadastroFuncionario" />
    <Route element={<TelaCliente />} path="/TelaCliente" />
    <Route element={<Lixeira />} path="/Lixeira" />
    <Route element={<FaleConosco />} path="/FaleConosco" />
    <Route element={<InicioCliente />} path="/InicioCliente" />
    <Route element={<DocFinalizadoClie />} path="/docFinalizadoClie" />
    <Route element={<DocFinalizadoFunc />} path="/docFinalizadoFunc" />
    <Route element={<VisualizarDoc />} path="/VisualizarDoc" />
    <Route element={<DocAndamentoFunc />} path="/docAndamentoFunc/:nomeDocumento/:idDocumento" />
    <Route element={<DocAndamentoClie />} path="/DocAndamentoClie/:nomeDocumento/:idDocumento" />
  </Routes>);
};

export default Rotas;