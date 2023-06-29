import { useEffect, useState } from "react";
import logo from './assets/fiadopro-white.png'
import { Outlet, Link, useLocation } from "react-router-dom";
import "./loading.css"
import { invoke } from "@tauri-apps/api";
import { User } from "./interfaces/User";
import Product from "./interfaces/Product";
import Account from "./interfaces/Account";

function App({ load, dataStorage }: { load: boolean, dataStorage: { users: User[], accounts: Account[], products: Product[] } }) {

  const [currentPage, setCurrentPage] = useState('');
  const location = useLocation();

  useEffect(() => {
    console.log(dataStorage);
    console.log(dataStorage.users.length);
    console.log(dataStorage.users.length == 0);
  },[])

  useEffect(() => {
    setCurrentPage(window.location.pathname);
  }, [location]);

  const [status, setStatus] = useState(false)

  return (
    <main className=" overflow-hidden w-full h-screen flex bg-slate-950 text-slate-200 p-2">
      <aside className="mr-2 w-48 test-sm bg-slate-900 h-full">
        <img className=" p-4" src={logo} alt="logomarca" />
        <nav className="">
          <Link to={'/'}><li className={` ${currentPage === '/' ? 'border-l-4 border-emerald-500 bg-slate-800 pl-2' : 'pl-3'}                 cursor-pointer flex items-center list-none hover:bg-slate-700 h-12 font-semibold   text-sm`}>Visão geral</li></Link>
          <Link to={'/contas'}><li className={` ${currentPage === '/contas' ? 'border-l-4 border-emerald-500 bg-slate-800 pl-2' : 'pl-3'}     ${dataStorage.users.length == 0 ? ' opacity-30 ': ' '} cursor-pointer flex items-center list-none hover:bg-slate-700 h-12     text-sm`}>Acessar contas</li></Link>
          <Link to={'/usuarios'}><li className={` ${currentPage === '/usuarios' ? 'border-l-4 border-emerald-500 bg-slate-800 pl-2' : 'pl-3'} cursor-pointer flex items-center list-none hover:bg-slate-700 h-12 text-sm`}>Gerenciar clientes</li></Link>
          <Link to={'/produtos'}><li className={` ${currentPage === '/produtos' ? 'border-l-4 border-emerald-500 bg-slate-800 pl-2' : 'pl-3'} cursor-pointer flex items-center list-none hover:bg-slate-700 h-12 text-sm`}>Gerenciar produtos</li></Link>
        </nav>
      </aside>
      <div className=" overflow-hidden flex justify-center w-full ">
        <div className={`${load ? 'load_anim' : 'close_anim'} load-bar  h-1`}></div>
        <div className={` overflow-y-scroll shadow-inner bg-slate-900 w-full mr-2 h-full`}>
          <Outlet />
        </div>
      </div>
    </main>
  );
}

export default App;
