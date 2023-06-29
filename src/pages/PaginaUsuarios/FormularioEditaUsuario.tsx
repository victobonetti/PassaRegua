import { invoke } from "@tauri-apps/api";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { User } from "../../interfaces/User";
import { FeedbackContext } from "../../routes/appRouter";
import { ZodError, z } from 'zod'
import { validaNome } from "../../interfaces/ZodInputs";

export default function FormularioEditaUsuario() {

    const [username, setUsername] = useState('');
    const [cpf, setCpf] = useState('');
    const [phone, setPhone] = useState('');
    const [usernameErr, setInputUsernameErr] = useState('');
    const [cpfErr, setInputCpfErr] = useState('');
    const [phoneErr, setInputPhoneErr] = useState('');
    const { id, usernameParam, cpfParam, phoneParam } = useParams();
    const { createFeedback, manageLoading } = useContext(FeedbackContext);

    useEffect(() => {
        if (id && usernameParam && cpfParam && phoneParam) {
            setUsername(usernameParam);
            setCpf(cpfParam);
            setPhone(phoneParam);
        }
    }, [usernameParam, cpfParam, phoneParam]);


    const editaUsuario = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let validar_nome = validaNome(username);
        let validar_cpf = validaNome(cpf);
        let validar_telefone = validaNome(phone);

        if (validar_nome.success && validar_cpf.success && validar_telefone.success) {
            manageLoading(true);
            try {
                await invoke("edit_user", { id, username, cpf, phone });
                createFeedback(false, "Usuário editado.")
                window.location.href = '/usuarios';
            } catch (e) {
                createFeedback(true, String(e))
            } finally {
                manageLoading(false);
            }
        } else {
            if (!validar_nome.success) {
                setInputUsernameErr("Nome deve conter, ao menos, 3 caracteres.");
            }
            if (!validar_cpf.success) {
                setInputCpfErr("Senha deve conter, ao menos, 3 caracteres.");
            }
            if (!validar_telefone.success) {
                setInputCpfErr("Senha deve conter, ao menos, 3 caracteres.");
            }


        }

    }

    return (
        <div className=" h-full flex flex-col items-center justify-center">
        <h1 className=" text-3xl mb-4">Editqar novo usuário</h1>
        <form onSubmit={e => editaUsuario(e)} className="flex flex-col w-96">
            <label className=" border-none text-xs font-semibold text-slate-400" htmlFor="username">NOME</label>
            <input autoComplete="none" value={username} onChange={e => setUsername(e.target.value)} className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="" id="username" />
            <span className=" mb-2 text-xs text-red-500">{usernameErr}</span>
            <label className="text-xs font-semibold text-slate-400" htmlFor="">CPF</label>
            <input autoComplete="none" value={cpf} onChange={e => setCpf(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="" id="password" />
            <span className=" mb-2 text-xs text-red-500">{cpfErr}</span>
            <label className="text-xs font-semibold text-slate-400" htmlFor="">TELEFONE</label>
            <input autoComplete="none" value={phone} onChange={e => setPhone(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="" id="password" />
            <span className=" mb-2 text-xs text-red-500">{phoneErr}</span>
            <div className=" mt-4 flex items-center w-full justify-between">
                <Link to={'/usuarios'}><p className=" text-slate-400 underline cursor-pointer ml-2">Voltar</p></Link>
               <button type="submit" className=" text-xl w-36 transition-all hover:bg-transparent hover:text-emerald-300 border border-emerald-300  bg-emerald-300 text-emerald-700 font-semibold p-2 rounded">Confirmar</button>
            </div>
        </form>
    </div>
    )
}