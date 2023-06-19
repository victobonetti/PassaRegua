import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import { User } from "../../interfaces/User";
import { Link } from "react-router-dom";
import ConfirmModal from "../../components/ConfirmModal";
import { Feedback } from "../../components/feedback/Feedback";

export default function PaginaUsuarios({ feedback }: FeedbackProps) {

    const [resposta, setResposta] = useState<User[]>([]);
    const [toDelete, setToDelete] = useState<User>();
    const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
    const [handleMessage, setHandleMessage] = useState(false);

    const abrirModalExcluir = (user: User) => {
        setToDelete(user);
        setModalExcluirAberto(true);
    }

    const excluirUsuario = async () => {
        let id = toDelete?.id
        invoke('delete_user_by_id', { id }).then(() => {
            fecharModalExcluir();
            feedback(false, "Usuário excluído com sucesso.")
        });

        feedback(true, "Erro ao excluir usuário.")
    }

    const fecharModalExcluir = () => {
        setToDelete(undefined);
        setModalExcluirAberto(false);
    }


    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                const data: User[] = await invoke('find_all_users', {});
                setResposta(data);
            } catch {
                feedback(true, "Erro ao encontrar usuários.")
            }
        };
        fetchData();
    }, []);

    return (
        <>

            {modalExcluirAberto && <ConfirmModal
                titulo="Tem certeza?"
                texto="Por favor, confirme que deseja prosseguir com a exclusão do usuário clicando no botão abaixo."
                botaotexto="Sim, excluir."
                callbackConfirm={() => excluirUsuario()}
                callbackCancel={() => fecharModalExcluir()}
            />
            }

            {!modalExcluirAberto &&
                <tbody className="  text-slate-300  w-full table-auto flex flex-col ">

                    <thead className=" select-none bg-slate-400 font-semibold py-4 flex w-full text-sm ">
                        <tr className="flex w-full">
                            <td className="pl-5 text-slate-600 w-1/4 ">NOME</td>
                            <td className="pl-5 text-slate-600 w-1/4 ">SENHA</td>
                            <td className="pl-5 text-slate-600 w-1/4 ">STATUS</td>
                            <td className="pl-5 text-slate-600 w-1/4 "></td>
                        </tr>
                    </thead>
                    {resposta?.length < 1 && <h1 className=" w-full bg-slate-800 p-4 text-2xl">Não foram encontrados registros.</h1>}
                    {resposta.map((data, i) => {
                        return (
                            <tr key={i} className="  w-full flex justify-evenly bg-slate-800  odd:bg-slate-700">
                                <td className=" font-semibold w-1/4 p-5 text-sm whitespace-nowrap ">
                                    {data.username}
                                </td>
                                <td className=" font-semibold w-1/4 p-5 text-sm whitespace-nowrap">
                                    {"*".repeat(data.password.length)}
                                </td>
                                <td className=" font-semibold w-1/4 p-5  text-sm whitespace-nowrap">
                                    {data.account_id ? 'Tem conta em aberto' : 'Não tem conta em aberto.'}
                                </td>
                                <td className=" w-1/4 p-4  text-sm whitespace-nowrap">
                                    <Link to={`/usuarios/editar/${data.id}/${data.username}/${data.password}`}><button className=" transition-all hover:bg-transparent hover:text-neutral-300 border border-neutral-300  bg-neutral-300 text-neutral-700 font-semibold px-2 py-1 rounded">Editar</button></Link>
                                    <button onClick={() => abrirModalExcluir(data)} className="ml-2 transition-all hover:bg-transparent hover:text-red-300 border border-red-300  bg-red-300 text-red-900 font-semibold px-2 py-1 rounded">Excluir</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            }
            {!modalExcluirAberto &&
                <div className=" justify-center p-2 flex ">
                    <Link to={'/usuarios/novo'}><button className=" transition-all hover:bg-transparent hover:text-cyan-300 border border-cyan-300  bg-cyan-300 text-cyan-900 font-semibold px-4 py-2 rounded text-lg">Criar novo usuário</button></Link>
                </div>
            }
        </>

    )
}