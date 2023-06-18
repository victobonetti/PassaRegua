import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import { User } from "../interfaces/User";
import { Link } from "react-router-dom";

async function getUsers() {
    try {
        return await invoke("find_all_users", {});
    } catch (error) {
        // Tratar o erro de solicitação de usuários
        console.error("Erro ao buscar os usuários:", error);
        return [];
    }
}

export default function PaginaUsuarios() {

    const [resposta, setResposta] = useState<User[]>([]);

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                const data: User[] = await invoke('find_all_users', {});
                setResposta(data);
            } catch (error) {
                console.error("Erro ao buscar os usuários:", error);
            }
        };
        fetchData();
    }, []);



    return (
        <>
        <tbody className=" text-slate-300  w-full table-auto flex flex-col ">
            <thead className="  font-semibold  bg-slate-900 text-center py-4 flex w-full justify-evenly text-lg">
                <td className="text-center w-1/4 ">Nome</td>
                <td className="text-center w-1/4 ">Senha</td>
                <td className="text-center w-1/4 ">Conta status</td>
                <td className="text-center w-1/4 "></td>
            </thead>

            {resposta?.length < 1  && <h1 className=" w-full bg-slate-800 p-4 text-2xl">Não foram encontrados registros.</h1>}

            {resposta?.map((data) => {
                return (
                    <tr className=" w-full flex justify-evenly bg-slate-800  odd:bg-slate-700">
                        <td className=" font-semibold text-center w-1/4 p-5 text-sm whitespace-nowrap ">
                            {data.username}
                        </td>
                        <td className=" font-semibold text-center w-1/4 p-5 text-sm whitespace-nowrap">
                            {data.password}
                        </td>
                        <td className=" font-semibold text-center w-1/4 p-5  text-sm whitespace-nowrap">
                            {data.account_id ? 'Tem conta em aberto' : 'Não tem conta em aberto.'}
                        </td>
                        <td className=" text-center w-1/4 p-4  text-sm whitespace-nowrap">
                            <button className=" transition-all hover:bg-transparent hover:text-neutral-300 border border-neutral-300  bg-neutral-300 text-neutral-700 font-semibold px-2 py-1 rounded">Editar</button>
                            <button className="ml-2 transition-all hover:bg-transparent hover:text-red-300 border border-red-300  bg-red-300 text-red-900 font-semibold px-2 py-1 rounded">Excluir</button>
                        </td>
                    </tr>
                );
            })}
        </tbody>
            <div className=" justify-center p-2 flex ">
                <Link to={'/usuarios/novo'}><button className=" transition-all hover:bg-transparent hover:text-cyan-300 border border-cyan-300  bg-cyan-300 text-cyan-900 font-semibold px-4 py-2 rounded text-lg">Criar novo usuário</button></Link>
            </div></>
    )
}