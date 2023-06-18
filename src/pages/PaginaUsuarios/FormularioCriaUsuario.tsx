import { invoke } from "@tauri-apps/api";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function FormularioCriaUsuario({ feedback }: FeedbackProps) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const criaUsuario = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await invoke("create_user", {username, password});
        window.location.href = '/usuarios';
    }

    return (
        <div className=" h-full flex flex-col items-center justify-center">
            <h1 className=" text-3xl mb-4">Criar novo usuário</h1>
            <form onSubmit={e => criaUsuario(e)} className="flex flex-col w-96">
                <label className=" border-none text-xs font-semibold text-slate-400" htmlFor="username">NOME</label>
                <input onChange={e => setUsername(e.target.value)} className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="" id="username" />
                <label className="text-xs font-semibold text-slate-400" htmlFor="">SENHA</label>
                <input onChange={e => setPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="" id="password" />
                <div className=" mt-4 flex items-center w-full justify-between">
                    <Link to={'/usuarios'}><p className=" text-slate-400 underline cursor-pointer ml-2">Voltar</p></Link>
                    <button type="submit" className=" text-xl w-36 transition-all hover:bg-transparent hover:text-emerald-300 border border-emerald-300  bg-emerald-300 text-emerald-700 font-semibold p-2 rounded">Confirmar</button>
                </div>
            </form>
        </div>
    )
}