import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Account from "../../interfaces/Account";
import ConfirmModal from "../../components/ConfirmModal";


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
                let data: Account[] = await invoke('find_all_accounts', {});
                setResposta(data);
                feedback(false, "Contas encontradas com sucesso.");
            } catch {
                feedback(true, "Erro ao encontrar contas.");
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
                <><div className=" justify-end p-2 flex bg-slate-950 ">
                    <Link to={'/contas/novo'}><button className=" transition-all hover:bg-transparent hover:text-cyan-300 border border-cyan-300  bg-cyan-300 text-cyan-900 font-semibold px-4 py-2 rounded text-lg">Criar nova conta</button></Link>
                </div>
                    <div className=" p-4 flex flex-wrap justify-between">
                        {resposta.map((c, i) => {
                            return (
                                <div key={i} className=" text-slate-300 mb-2 mx-1 shadow-lg rounded bg-slate-800 w-52 p-2">
                                    <h3 className=" text-2xl ">{c.user_id}</h3>
                                    <p className=" text-sm text-slate-400 mt-2 text">Dívida: <span className=" text-red-400">R${Number(c.account_total - c.paid_amount).toFixed(2)}</span></p>
                                    <p className=" text-sm text-slate-400 mt-2 text">Valor pago: <span className=" text-emerald-400">R${Number(c.paid_amount).toFixed(2)}</span></p>
                                    <Link to={`/contas/payments/${c.user_id}`}><button className=" my-2 transition-all hover:bg-transparent hover:text-emerald-300 border border-emerald-300  bg-emerald-300 text-emerald-900 font-semibold px-2 py-1 rounded text-sm ">Pagamentos</button></Link>
                                    <Link to={`/contas/items/${c.user_id}`}><button className=" ml-2 my-2 transition-all hover:bg-transparent hover:text-blue-300 border border-blue-300  bg-blue-300 text-blue-900 font-semibold px-2 py-1 rounded text-sm ">Ver Itens</button></Link>
                                </div>
                            )
                        })}

                    </div>
                </>
            }

        </>

    )
}