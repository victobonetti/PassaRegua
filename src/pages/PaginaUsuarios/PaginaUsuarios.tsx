import { invoke } from "@tauri-apps/api/tauri";
import { Dispatch, SetStateAction, useContext, useEffect, useLayoutEffect, useState } from "react";
import { User } from "../../interfaces/User";
import { Link } from "react-router-dom";
import ConfirmModal from "../../components/confirmModal/ConfirmModal";
import { FeedbackContext } from "../../routes/appRouter";

export default function PaginaUsuarios({ data, setData }: { data: User[], setData: Dispatch<SetStateAction<User[]>> }) {

    const { createFeedback, manageLoading } = useContext(FeedbackContext);
    const [toDelete, setToDelete] = useState<User>();
    const [modalExcluirAberto, setModalExcluirAberto] = useState(false);

    const abrirModalExcluir = (user: User) => {
        setToDelete(user);
        setModalExcluirAberto(true);
    }

    const excluirUsuario = async () => {

        manageLoading(true);
        let id = toDelete?.id

        try {
            await invoke('delete_user_by_id', { id })
            let newData = data;
            newData = newData.filter((r) =>
                r.id != id
            )
            setData(newData)
            fecharModalExcluir();
            createFeedback(false, "Usuário excluído.")
        }
        catch (e) {
            createFeedback(true, String(e))
        } finally {
            manageLoading(false);
        }

    }


    const fecharModalExcluir = () => {
        setToDelete(undefined);
        setModalExcluirAberto(false);
    }


    const fetchData = async (): Promise<void> => {
        try {
            const all: User[] = await invoke('find_all_users', {});
            if (all !== data) {
                setData(all);
            }
        } catch (e) {
            createFeedback(true, String(e))
        } finally {
            manageLoading(false)
        }
    };

    useLayoutEffect(() => {
        manageLoading(true)
    }, [])

    useEffect(() => {
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
                <><table className="w-full "><tbody className="  text-slate-300  w-full table-auto flex flex-col ">
                    <thead className=" select-none bg-slate-400 font-semibold py-4 flex w-full text-sm ">
                        <tr className="flex w-full">
                            <td className="pl-5 text-slate-600 w-1/6 ">CRIADO EM</td>
                            <td className="pl-5 text-slate-600 w-1/6 ">NOME</td>
                            <td className="pl-5 text-slate-600 w-1/6 ">CPF</td>
                            <td className="pl-5 text-slate-600 w-1/6 ">TELEFONE</td>
                            <td className="pl-5 text-slate-600 w-1/6 ">STATUS</td>
                            <td className="pl-5 text-slate-600 w-1/6 "></td>
                        </tr>
                    </thead>
                    {data.map((u) => {
                        return (
                            <tr key={String(u.id)} className="  w-full flex justify-evenly bg-slate-800  odd:bg-slate-700">
                                <td className=" font-semibold w-1/6 p-5 text-sm whitespace-nowrap ">
                                    {u.created_at.replaceAll("-", "/")}
                                </td>
                                <td className=" font-semibold w-1/6 p-5 text-sm whitespace-nowrap ">
                                    {u.username}
                                </td>
                                <td className=" font-semibold w-1/6 p-5 text-sm whitespace-nowrap">
                                    {u.cpf}
                                </td>
                                <td className=" font-semibold w-1/6 p-5 text-sm whitespace-nowrap">
                                    {u.phone}
                                </td>
                                <td className=" font-semibold w-1/6 p-5  text-sm whitespace-nowrap">
                                    {u.account_id ? 'Tem conta em aberto' : 'Não tem conta em aberto.'}
                                </td>
                                <td className=" w-1/6 p-4  text-sm whitespace-nowrap">
                                    <Link to={`/usuarios/editar/${u.id}/${u.username}/${u.cpf}/${u.phone}`}><button className=" transition-all hover:bg-transparent hover:text-neutral-300 border border-neutral-300  bg-neutral-300 text-neutral-700 font-semibold px-2 py-1 rounded">Editar</button></Link>
                                    <button onClick={() => abrirModalExcluir(u)} className="ml-2 transition-all hover:bg-transparent hover:text-red-300 border border-red-300  bg-red-300 text-red-900 font-semibold px-2 py-1 rounded">Excluir</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody></table><div className=" justify-center p-2 flex ">
                        <Link to={'/usuarios/novo'}><button className=" transition-all hover:bg-transparent hover:text-cyan-300 border border-cyan-300  bg-cyan-300 text-cyan-900 font-semibold px-4 py-2 rounded text-lg">Criar novo usuário</button></Link>
                    </div></>
            }

        </>

    )
}