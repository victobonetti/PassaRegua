import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Account from "../interfaces/Account";
import ConfirmModal from "../components/ConfirmModal";


export default function PaginaContas({ feedback }: FeedbackProps) {

    const [resposta, setResposta] = useState<Account[]>([]);
    const [toDelete, setToDelete] = useState<Account>();
    const [modalExcluirAberto, setModalExcluirAberto] = useState(false);

    const abrirModalExcluir = (account: Account) => {
        setToDelete(account);
        setModalExcluirAberto(true);
    }

    const excluirConta = async () => {
        let id = toDelete?.id
        try {

            feedback(false, "Usuário excluído com sucesso.")
            fecharModalExcluir();
        }
        catch {
            feedback(true, "Erro ao excluir usuário.")
        }

    }

    const fecharModalExcluir = () => {
        setToDelete(undefined);
        setModalExcluirAberto(false);
    }


    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                let data: Account[] = await invoke('find_all_accounts', {})
                setResposta(data);
                feedback(false, "Contas encontradas com sucesso.")
            } catch {
                feedback(true, "Erro ao encontrar contas.")
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
                callbackConfirm={() => excluirConta()}
                callbackCancel={() => fecharModalExcluir()}
            />
            }

            {!modalExcluirAberto &&
                <><tbody className="  text-slate-300  w-full table-auto flex flex-col ">

                    <thead className=" select-none bg-slate-400 font-semibold py-4 flex w-full text-sm ">
                        <tr className="flex w-full">
                            <td className="pl-5 text-slate-600 w-1/4 ">ITEMS NA CONTA</td>
                            <td className="pl-5 text-slate-600 w-1/4 ">TOTAL PAGO</td>
                            <td className="pl-5 text-slate-600 w-1/4 ">NÚMERO DE PAGAMENTOS</td>
                            <td className="pl-5 text-slate-600 w-1/4 "></td>
                        </tr>
                    </thead>
                    {resposta?.length < 1 && <h1 className=" w-full bg-slate-800 p-4 text-2xl">Não foram encontrados registros.</h1>}
                    {resposta.map((data, i) => {
                        return (
                            <tr key={i} className="  w-full flex justify-evenly bg-slate-800  odd:bg-slate-700">
                                <td className=" font-semibold w-1/4 p-5 text-sm whitespace-nowrap ">
                                    {data.items.length}
                                </td>
                                <td className=" font-semibold w-1/4 p-5 text-sm whitespace-nowrap">
                                    R${data.paidAmount.toFixed(2)}
                                </td>
                                <td className=" font-semibold w-1/4 p-5  text-sm whitespace-nowrap">
                                    {data.payments.length ? 'Tem conta em aberto' : 'Não tem conta em aberto.'}
                                </td>
                                <td className=" w-1/4 p-4  text-sm whitespace-nowrap">
                                    <button onClick={() => abrirModalExcluir(data)} className="ml-2 transition-all hover:bg-transparent hover:text-red-300 border border-red-300  bg-red-300 text-red-900 font-semibold px-2 py-1 rounded">Excluir</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody><div className=" justify-center p-2 flex ">
                        <button className=" transition-all hover:bg-transparent hover:text-cyan-300 border border-cyan-300  bg-cyan-300 text-cyan-900 font-semibold px-4 py-2 rounded text-lg">Criar nova conta</button>
                    </div></>
            }

        </>

    )
}