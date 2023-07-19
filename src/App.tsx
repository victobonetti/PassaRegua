import { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import "./loading.css"
import { User } from "./interfaces/User";
import Product from "./interfaces/Product";
import Account from "./interfaces/Account";
import { checkUpdate, installUpdate } from "@tauri-apps/api/updater";
import { relaunch } from "@tauri-apps/api/process";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faFileText, faBarChart, faLemon, faNewspaper, faCircleQuestion, faLightbulb as face } from "@fortawesome/free-regular-svg-icons";
import ButtonComponentLink from "./components/buttons/ButtonComponentLink";

function App({ load, firstLoad, dataStorage }: { load: boolean, firstLoad: boolean, dataStorage: { users: User[], accounts: Account[], products: Product[] } }) {

  const [currentPage, setCurrentPage] = useState('');
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [updaterActive, setUpdaterActive] = useState(false);
  const [updateNotes, setUpdateNotes] = useState('');
  const [updateVersion, setUpdateVersion] = useState('');
  const [installingUpdate, setInstallingUpdate] = useState(false);
  const [updateErr, setUpdateErr] = useState('')
  const location = useLocation();

  interface updateProps {
    shouldUpdate: boolean
    manifest?: manifestProps
  }

  interface manifestProps {
    body: string,
    version: string
  }

  const findUpdates = async () => {
    try {
      const update: updateProps = await checkUpdate();
      console.log(update)
      if (update.shouldUpdate) {
        setUpdaterActive(true)
      }
      if (update.manifest?.body) {
        setUpdateNotes(update.manifest?.body)
      }

      if (update.manifest?.version) {
        setUpdateVersion(update.manifest?.version)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const update = () => {
    setInstallingUpdate(true)
    installUpdate().then((data) => {
      console.log(data)
      relaunch()
    }).catch((e) => {
      setInstallingUpdate(false)
      setUpdateErr(`Updatin stoped due an error: ${e}`)
      console.log('UpdatingError :')
      console.log(e)
    })
  }

  useEffect(() => {
    setCurrentPage(window.location.pathname);
  }, [location]);

  useEffect(() => {
    findUpdates()
  }, [])

  const [status, setStatus] = useState(false);
  const [darkmode, setDarkmode] = useState(true);

  const getRouteTitle = (c: string) => {
    if (c.includes("logs")) {
      return ("Logs")
    } else
      if (c.includes("usuario")) {
        return ("Pessoas")
      } else
        if (c.includes("produtos")) {
          return ("Produtos")
        } else
          if (c.includes("contas") && !c.includes("pagamento") && !c.includes("item")) {
            return ("Contas")
          } else
            if (c.includes("contas") && c.includes("pagament")) {
              return ("Pagamentos")
            } else if (c.includes("contas") && c.includes("item")) {
              return ("Itens")
            } else {
              return ("Dashboard")
            }

  }

  return (

    <main className={`${darkmode ? ' dark text-slate-300' : ' text-slate-800 '}`}>

      {/* updater */}
      {updaterActive &&
        <div className=" absolute w-screen h-screen text-slate-200 bg-slate-800 flex flex-col items-center justify-center">
          <h2 className="  dark:text-slate-50 select-none  mb-2 text-3xl text-center" >Passa<span className="font-black">Régua</span></h2>

          {
            installingUpdate &&
            <h2 className="  animate-pulse text-xl">Updating...</h2>
          }


          {!installingUpdate &&
            <><h1 className=" text-lg mb-4">New version available: {updateVersion}</h1><div className="w-1/2">
              <p className="text-sm opacity-60"> Release notes</p>
              <div className=" p-4 h-64 overflow-y-scroll text-xs bg-slate-900 text-slate-200 ">
                {updateNotes}
              </div>
              <p className=" text-red-500 ">{updateErr}</p>
            </div><div className=" w-1/2 flex py-4 justify-end items-center">
                <p onClick={() => setUpdaterActive(false)} className=" mr-4 cursor-pointer text-slate-600 text-sm underline">Remind me later</p>
                <ButtonComponentLink method={update} text={"Install"} color={1} />
              </div></>
          }
        </div>
      }

      {preferencesOpen &&
        <div className=" bg-slate-500 h-screen w-screen z-60 absolute flex items-center justify-center">
          <div className=" absolute flex flex-col items-center p-4 w-96 h-96 border dark:border-slate-600 rounded dark:bg-slate-700 bg-slate-200 shadow">

            <h2 className=" text-xl">Darkmode</h2>
            <div className=" w-4/5 justify-center p-2 flex border-b dark:border-slate-600 border-slate-300">
              <input
                onClick={() => setDarkmode(!darkmode)}
                className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-emerald-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-emerald-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-emerald-600 dark:after:bg-emerald-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckDefault" />
              <label
                className="inline-block pl-[0.15rem] hover:cursor-pointer"
                htmlFor="flexSwitchCheckDefault"
              >Darkmode</label>
            </div>
            <div className=" flex-col w-4/5 justify-center p-2 flex border-b dark:border-slate-600 border-slate-300">
              <h2 className=" text-center text-xl mb-1">Linguagem</h2>
              <div className=" w-full flex justify-center">
                <label
                  className="inline-block pr-[0.50rem] hover:cursor-pointer"
                  htmlFor="flexSwitchCheckDefault"
                >PT-BR</label>
                <input
                  disabled
                  className=" opacity-30 mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-emerald-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-emerald-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-emerald-600 dark:after:bg-emerald-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault" />
                <label
                  className="inline-block pl-[0.15rem] hover:cursor-pointer"
                  htmlFor="flexSwitchCheckDefault"
                >EN-US</label>
              </div>
            </div>
            <button onClick={() => setPreferencesOpen(false)} className=" border dark:border-red-500 dark:bg-red-400 border-red-400 rounded mt-8 bg-red-300 text-red-50 py-2 px-4 text-xl">Fechar janela de preferências</button>
          </div>

        </div>
      }

      {/* app */}
      <div className="dark:bg-slate-950 bg-slate-200 dark:text-slate-200 overflow-hidden w-full h-screen flex  p-2">
        {!firstLoad && !updaterActive &&
          <><aside className="flex flex-col bg-slate-100 dark:bg-slate-900  mr-2 w-48 test-sm h-full justify-between">
            <div>
              <h2 className="  dark:text-slate-50 select-none  mt-2 text-2xl text-center" >Passa<span className="font-black">Régua</span></h2>
              <h3 className=" font-bold mb-2 select-none text-xs dark:text-slate-100 text-slate-700 text-center ">Gestor de contas fiado</h3>
              <nav className=" flex flex-col">
                <p className=" text-xs text-slate-400 dark:text-slate-500 ml-2 mt-4 mb-2">Informações</p>
                <Link to={'/'}><li className={` ${currentPage === '/' ? 'border-l-4                 dark:border-emerald-500 border-emerald-300 text-slate-800 dark:text-slate-200 dark:bg-slate-800 pl-2' : 'pl-3'}                 cursor-pointer flex items-center list-none                                             hover:bg-slate-200 dark:hover:bg-slate-700 h-12 font-semibold   text-sm`}><FontAwesomeIcon className="mr-1.5 w-3" icon={faBarChart} />Dashboard</li></Link>
                <p className=" text-xs text-slate-400 dark:text-slate-500 ml-2 mt-4 mb-2">Contas fiado</p>
                <Link to={dataStorage.users.length == 0 ? currentPage : '/contas'}><li className={` ${currentPage === '/contas' ? 'border-l-4     dark:border-emerald-500 border-emerald-300 text-slate-800 dark:text-slate-200 dark:bg-slate-800 pl-2' : 'pl-3'}     ${dataStorage.users.length == 0 ? ' opacity-30 cursor-default hover:bg-transparent ' : ' '} cursor-pointer flex items-center list-none hover:bg-slate-200 dark:hover:bg-slate-700 h-12     text-sm`}><FontAwesomeIcon className="mr-1.5 w-3" icon={faFileText} />Contas</li></Link>
                <Link to={'/usuarios'}><li className={` ${currentPage === '/usuarios' ? 'border-l-4 dark:border-emerald-500 border-emerald-300 text-slate-800 dark:text-slate-200 dark:bg-slate-800 pl-2' : 'pl-3'} cursor-pointer flex items-center list-none                                                             hover:bg-slate-200 dark:hover:bg-slate-700 h-12 text-sm`}><FontAwesomeIcon className="mr-1.5 w-3" icon={faUser} />Pessoas</li></Link>
                <Link to={'/produtos'}><li className={` ${currentPage === '/produtos' ? 'border-l-4 dark:border-emerald-500 border-emerald-300 text-slate-800 dark:text-slate-200 dark:bg-slate-800 pl-2' : 'pl-3'} cursor-pointer flex items-center list-none                                                             hover:bg-slate-200 dark:hover:bg-slate-700 h-12 text-sm`}><FontAwesomeIcon className="mr-1.5 w-3" icon={faLemon} />Produtos</li></Link>
                <p className=" text-xs text-slate-400 dark:text-slate-500 ml-2 mt-4 mb-2">Logs</p>
                <Link to={'/logs'}><li className={` ${currentPage === '/logs' ? 'border-l-4 dark:border-emerald-500 border-emerald-300 text-slate-800 dark:text-slate-200 dark:bg-slate-800 pl-2' : 'pl-3'} cursor-pointer flex items-center list-none                                                             hover:bg-slate-200 dark:hover:bg-slate-700 h-12 text-sm`}><FontAwesomeIcon className="mr-1.5 w-3" icon={faNewspaper} />Checar logs</li></Link>
                <p className=" text-xs text-slate-400 dark:text-slate-500 ml-2 mt-4 mb-2">Configurações</p>
                <li onClick={() => setPreferencesOpen(!preferencesOpen)} className={` ${preferencesOpen ? 'border-l-4 dark:border-orange-500 border-orange-300 text-slate-800 dark:text-slate-200 dark:bg-slate-800 pl-2' : 'pl-3'} cursor-pointer flex items-center list-none                                                             hover:bg-slate-200 dark:hover:bg-slate-700 h-12 text-sm`}><FontAwesomeIcon className="mr-1.5 w-3" icon={faCircleQuestion} />Preferências</li>
              </nav>
            </div>


          </aside><div className=" overflow-hidden flex justify-center w-full ">
              <div className={`${load ? 'load_anim' : 'close_anim'} load-bar  h-1`}></div>
              <div className={`  overflow-y-scroll shadow-inner bg-slate-100 dark:bg-slate-900 w-full mr-2 h-full`}>

                {!preferencesOpen &&
                  <><div className=" w-full h-12 dark:bg-slate-800 bg-slate-200 text-slate-600 dark:text-slate-300 flex items-center justify-center text-2xl">{getRouteTitle(currentPage)}</div><Outlet /></>}
              </div>
            </div></>
        }
      </div>
    </main>

  );
}

export default App;
