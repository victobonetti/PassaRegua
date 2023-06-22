import { invoke } from "@tauri-apps/api";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { User } from "../../interfaces/User";

export default function FormularioEditaUsuario() {

    const [username, setInputUsername] = useState('');
    const [password, setInputPassword] = useState('');
    const { id, usernameParam, passwordParam } = useParams();
  
    useEffect(() => {
      if (usernameParam && passwordParam) {
        setInputUsername(usernameParam);
        setInputPassword(passwordParam);
      }
    }, [usernameParam, passwordParam]);


    const editaUsuario = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try{
            await invoke("edit_user", {id, username, password });
        } catch {
        }
       
        window.location.href = '/usuarios';
    }

    return (
        <div className=" h-full flex flex-col items-center justify-center">
            <h1 className=" text-3xl mb-4">Editar usuário</h1>
            <form onSubmit={e => editaUsuario(e)} className="flex flex-col w-96">
                <label className=" border-none text-xs font-semibold text-slate-400" htmlFor="username">NOME</label>
                <input value={username} onChange={e => setInputUsername(e.target.value)} className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="" id="username" />
                <label className="text-xs font-semibold text-slate-400" htmlFor="">SENHA</label>
                <input value={password} onChange={e => setInputPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="" id="password" />
                <div className=" mt-4 flex items-center w-full justify-between">
                    <Link to={'/usuarios'}><p className=" text-slate-400 underline cursor-pointer ml-2">Voltar</p></Link>
                    <button type="submit" className=" text-xl w-36 transition-all hover:bg-transparent hover:text-emerald-300 border border-emerald-300  bg-emerald-300 text-emerald-700 font-semibold p-2 rounded">Confirmar</button>
                </div>
            </form>
        </div>
    )
}