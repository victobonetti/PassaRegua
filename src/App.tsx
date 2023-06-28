import { useEffect, useState } from "react";
import logo from './assets/fiadopro-white.png'
import { Outlet, Link, useLocation } from "react-router-dom";
import "./loading.css"
import { invoke } from "@tauri-apps/api";
import { User } from "./interfaces/User";
import Product from "./interfaces/Product";

function App({ load }: { load: boolean }) {

  const [currentPage, setCurrentPage] = useState('');
  const location = useLocation();

  useEffect(() => {
    setCurrentPage(window.location.pathname);
  }, [location]);

  const [status, setStatus] = useState(false)

  const fetch = async () => {
    let data:boolean = await invoke('get_database_content_status', {});
    setStatus(data);
  }

  useEffect(() => {
    fetch()
  }, [location])


  return (
    <main className=" overflow-hidden w-full h-screen flex bg-slate-950 text-slate-200 p-2">
      <aside className="mr-2 w-48 test-sm bg-slate-900 h-full">
        <img className=" p-4" src={logo} alt="logomarca" />
        <nav className="">
          <Link to={'/'}><li className={` ${currentPage === '/' ? 'border-l-4 border-emerald-500 bg-slate-800 pl-3' : 'pl-4'} cursor-pointer flex items-center list-none hover:bg-slate-700 h-12 font-semibold`}>Visão geral</li></Link>
          {status == true && <Link to={'/contas'}><li className={` ${currentPage === '/contas' ? 'border-l-4 border-emerald-500 bg-slate-800 pl-3' : 'pl-4'} cursor-pointer flex items-center list-none hover:bg-slate-700 h-12`}>Acessar contas</li></Link>}
          <Link to={'/usuarios'}><li className={` ${currentPage === '/usuarios' ? 'border-l-4 border-emerald-500 bg-slate-800 pl-3' : 'pl-4'} cursor-pointer flex items-center list-none hover:bg-slate-700 h-12`}>Gerenciar clientes</li></Link>
          <Link to={'/produtos'}><li className={` ${currentPage === '/produtos' ? 'border-l-4 border-emerald-500 bg-slate-800 pl-3' : 'pl-4'} cursor-pointer flex items-center list-none hover:bg-slate-700 h-12`}>Gerenciar produtos</li></Link>
        </nav>
      </aside>
      <div className=" overflow-hidden flex justify-center w-full ">
        {load && <div className=' h-full w-full z-10 flex items-center justify-center bg-slate-900'>
          <div className='w-32  p-4'>
            <div className='load-bar h-2'></div>
          </div>
        </div>}
        <div className={`${load ? ' hidden ' : ' '} overflow-y-scroll shadow-inner bg-slate-900 w-full mr-2 h-full`}>
          <Outlet />
        </div>
      </div>
    </main>
  );
}

export default App;
