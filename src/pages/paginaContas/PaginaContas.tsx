import { invoke } from "@tauri-apps/api/tauri";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";
import Account from "../../interfaces/Account";
import ConfirmModal from "../../components/ConfirmModal";
import { FeedbackContext } from "../../routes/appRouter";


export default function PaginaContas() {

    const { createFeedback, manageLoading } = useContext(FeedbackContext);

    const [resposta, setResposta] = useState<Account[]>([]);
    const [toDelete, setToDelete] = useState('');
    const [modalExcluirAberto, setModalExcluirAberto] = useState(false);

    const abrirModalExcluir = (id: string) => {
        setToDelete(id);
        setModalExcluirAberto(true);
    }

    const excluirConta = async () => {
        let accountId = toDelete;
        manageLoading(true);
        try {
            await invoke("delete_account_by_id", { accountId });
            fecharModalExcluir();
            createFeedback(false, "Conta excluída com sucesso.");
            setResposta(resposta.filter((c) => c.id !== accountId));
        }
        catch (e) {
            createFeedback(true, String(e));
        } finally {
            manageLoading(false);
        }

    }

    const fecharModalExcluir = () => {
        setToDelete('');
        setModalExcluirAberto(false);
    }

    useLayoutEffect(() => {
        manageLoading(true);
    }, [])


    const fetchData = async (): Promise<void> => {
        try {
            let data: Account[] = await invoke('find_all_accounts', {});
            setResposta(data);

        } catch (e) {
            createFeedback(true, String(e))
        } finally {
            manageLoading(false);
        }
    };

    useEffect(() => {
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
                <><div className=" justify-end p-2 flex bg-slate-950 ">
                    <Link to={'/contas/novo'}><button className=" transition-all hover:bg-transparent hover:text-cyan-300 border border-cyan-300  bg-cyan-300 text-cyan-900 font-semibold px-4 py-2 rounded text-lg">Criar nova conta</button></Link>
                </div>
                    <div className=" p-4 flex flex-wrap">
                        {resposta.map((c) => {
                            return (
                                <div key={String(c.id)} className=" text-slate-300 mb-2 mx-1 shadow-lg rounded bg-slate-800 w-1/5 p-2">
                                    <div className=" flex justify-between border-b border-slate-700 pb-1 mb-1">
                                        <h3 className=" text-slate-200 font-semibold ">{c.owner.toUpperCase()}</h3>
                                        {c.account_total - c.paid_amount < 0 && <h4 className=" bg-green-200 rounded-full text-xs text-green-600 font-bold flex items-center justify-center px-1">Saldo</h4>}
                                        {c.account_total - c.paid_amount == 0 && <h4 className=" bg-neutral-200 rounded-full text-xs text-neutral-600 font-bold flex items-center justify-center px-1">Quitado</h4>}
                                        {c.account_total - c.paid_amount > 0 && <h4 className=" bg-yellow-400 rounded-full text-xs text-yellow-900 font-bold flex items-center justify-center px-1">Em aberto</h4>}
                                    </div>
                                    <p className=" text-slate-300 text-xs">Dívida: <span className=" text-red-400">R${Number(c.account_total - c.paid_amount).toFixed(2)}</span></p>
                                    <p className=" text-slate-300 mt-1 text-xs">Valor pago: <span className=" text-emerald-400">R${Number(c.paid_amount).toFixed(2)}</span></p>
                                    <div className=" py-2 flex flex-col ">
                                        <div className=" text-xs font-bold mb-1 text-slate-500">GERENCIAR</div>
                                        <Link to={`/contas/payments/${c.id}/${c.account_total}`}>
                                            <button className=" transition-all hover:bg-transparent hover:text-emerald-300 border border-emerald-300  bg-emerald-300 text-emerald-900 font-semibold px-2 py-1 rounded text-xs w-24 ">Pagamentos</button></Link>
                                        <Link to={`/contas/items/${c.id}`}><button className=" mt-1 transition-all hover:bg-transparent hover:text-blue-300 border border-blue-300  bg-blue-300 text-center text-blue-900 font-semibold px-2 py-1 rounded  text-xs w-24 ">Lançar itens</button></Link>
                                        {c.account_total - c.paid_amount <= 0 && <button onClick={() => abrirModalExcluir(String(c.id))} className=" mt-1 transition-all hover:bg-transparent hover:text-red-300 text-center border border-red-300 bg-red-300 w-24 text-red-900 font-semibold px-2 py-1 rounded text-xs ">Excluir conta</button>}
                                        {c.account_total - c.paid_amount > 0 && <button disabled className=" opacity-50 mt-1 transition-all border border-red-300  bg-red-300 text-red-900 font-semibold text-center px-2 py-1 rounded text-xs w-24">Excluir conta</button>}
                                    </div>
                                </div>
                            )
                        })}

                    </div>
                </>
            }

        </>

    )
}