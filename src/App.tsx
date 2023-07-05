import { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import "./loading.css"
import { invoke } from "@tauri-apps/api";
import { User } from "./interfaces/User";
import Product from "./interfaces/Product";
import Account from "./interfaces/Account";
import { checkUpdate, installUpdate } from "@tauri-apps/api/updater";
import { relaunch } from "@tauri-apps/api/process";

function App({ load, firstLoad, dataStorage }: { load: boolean, firstLoad: boolean, dataStorage: { users: User[], accounts: Account[], products: Product[] } }) {

  const [currentPage, setCurrentPage] = useState('');
  const location = useLocation();

  const findUpdates = async () => {
    const update = await checkUpdate();
    if (update.shouldUpdate && update.manifest) {
      console.log(`Installing update ${update.manifest?.version}, ${update.manifest?.date}, ${update.manifest.body}`);
      await installUpdate().then(relaunch);
    }
  }

  useEffect(() => {
    setCurrentPage(window.location.pathname);
  }, [location]);

  useEffect(() => {
    findUpdates()
  }, [])

  const [status, setStatus] = useState(false);
  const [darkmode, setDarkmode] = useState(false);

  return (

    <main className={`${darkmode ? ' dark text-slate-300' : ' text-slate-800 '}`}>
      <div className="dark:bg-slate-950 bg-slate-200 dark:text-slate-200 overflow-hidden w-full h-screen flex  p-2">
        {!firstLoad &&
          <><aside className="flex flex-col bg-slate-100 dark:bg-slate-900  mr-2 w-48 test-sm h-full justify-between">

            <div>
              <h2 className="  dark:text-slate-50 select-none  my-2 text-4xl text-center" >Frila<span className="font-black">Hub</span></h2>
              <nav className=" flex flex-col">
                <Link to={'/'}><li className={` ${currentPage === '/' ? 'border-l-4                 dark:border-emerald-500 border-emerald-300 text-slate-800 dark:text-slate-200 dark:bg-slate-800 pl-2' : 'pl-3'}                 cursor-pointer flex items-center list-none                                             hover:bg-slate-200 dark:hover:bg-slate-700 h-12 font-semibold   text-sm`}>Visão geral</li></Link>
                <Link to={'/contas'}><li className={` ${currentPage === '/contas' ? 'border-l-4     dark:border-emerald-500 border-emerald-300 text-slate-800 dark:text-slate-200 dark:bg-slate-800 pl-2' : 'pl-3'}     ${dataStorage.users.length == 0 ? ' opacity-30 ' : ' '} cursor-pointer flex items-center list-none hover:bg-slate-200 dark:hover:bg-slate-700 h-12     text-sm`}>Acessar contas</li></Link>
                <Link to={'/usuarios'}><li className={` ${currentPage === '/usuarios' ? 'border-l-4 dark:border-emerald-500 border-emerald-300 text-slate-800 dark:text-slate-200 dark:bg-slate-800 pl-2' : 'pl-3'} cursor-pointer flex items-center list-none                                                             hover:bg-slate-200 dark:hover:bg-slate-700 h-12 text-sm`}>Gerenciar clientes</li></Link>
                <Link to={'/produtos'}><li className={` ${currentPage === '/produtos' ? 'border-l-4 dark:border-emerald-500 border-emerald-300 text-slate-800 dark:text-slate-200 dark:bg-slate-800 pl-2' : 'pl-3'} cursor-pointer flex items-center list-none                                                             hover:bg-slate-200 dark:hover:bg-slate-700 h-12 text-sm`}>Gerenciar produtos</li></Link>
              </nav>
            </div>

            <button onClick={() => setDarkmode(!darkmode)} className=" p-1 m-2 text-xs self-start mb-2 bg-slate-700 dark:bg-slate-300 dark:text-slate-900 rounded text-slate-100">{darkmode ?' Lightmode' : 'Darkmode'}</button>
         
          </aside><div className=" overflow-hidden flex justify-center w-full ">
              <div className={`${load ? 'load_anim' : 'close_anim'} load-bar  h-1`}></div>
              <div className={`  overflow-y-scroll shadow-inner bg-slate-100 dark:bg-slate-900 w-full mr-2 h-full`}>
                <Outlet />
              </div>
            </div></>
        }
      </div>
    </main>

  );
}

export default App;
