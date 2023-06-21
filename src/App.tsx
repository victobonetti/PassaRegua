import { useEffect, useState } from "react";
import logo from './assets/fiadopro-white.png'
import { Outlet, Link, useLocation } from "react-router-dom";

function App() {

  const [paginaInicial, setPaginaInicial] = useState(false);
  const [paginaUsuarios, setPaginaUsuarios] = useState(false);
  const [paginaContas, setPaginaContas] = useState(false);
  const [paginaProdutos, setPaginaProdutos] = useState(false);

  const location = useLocation();

  useEffect(() => {

    setPaginaInicial(false);
    setPaginaUsuarios(false);
    setPaginaContas(false);
    setPaginaProdutos(false);

    const currentPath = window.location.pathname;

    if (currentPath === '/') {
      setPaginaInicial(true);
    }

    if (currentPath === '/usuarios') {
      setPaginaUsuarios(true);
    }

    if (currentPath === '/contas') {
      setPaginaContas(true);
    }

    if (currentPath === '/produtos') {
      setPaginaProdutos(true);
    }

  }, [location]);

  // async function criar() {
  //   // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  //   setResposta(await invoke("create_user", { username, password }));
  // }

  return (
    <main className=" overflow-hidden w-full h-screen flex bg-slate-950 text-slate-200 p-2">
      <aside className="mr-2 w-48 test-sm bg-slate-900 h-full">
        <img className=" p-4" src={logo} alt="logomarca" />
        <nav className="">
          <Link to={'/'}><li className={` ${paginaInicial ? 'border-l-4 border-emerald-500 bg-slate-800 pl-3' : '         pl-4  '}  cursor-pointer flex items-center list-none hover:bg-slate-700 h-12 font-semibold`}>Visão geral</li></Link>
          <Link to={'/contas'}><li className={` ${paginaContas ? 'border-l-4 border-emerald-500 bg-slate-800 pl-3' : '   pl-4  '}  cursor-pointer flex items-center list-none hover:bg-slate-700 h-12`}>Acessar contas</li></Link>
          <Link to={'/usuarios'}><li className={` ${paginaUsuarios ? 'border-l-4 border-emerald-500 bg-slate-800 pl-3' : '  pl-4 '}  cursor-pointer flex items-center list-none hover:bg-slate-700 h-12`}>Gerenciar usuários</li></Link>
          <Link to={'/produtos'}><li className={` ${paginaProdutos ? 'border-l-4 border-emerald-500 bg-slate-800 pl-3' : ' pl-4  '}   cursor-pointer flex items-center list-none hover:bg-slate-700 h-12`}>Gerenciar produtos</li></Link>
        </nav>
      </aside>
      <div className=" overflow-hidden flex justify-center w-full ">
        <div className=" overflow-y-scroll shadow-inner bg-slate-900 w-full mr-2 h-full">
          <Outlet />
        </div>
      </div>
    </main>
  );
}

export default App;
