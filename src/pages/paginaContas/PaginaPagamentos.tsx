import { useContext, useEffect, useLayoutEffect, useState } from "react";
import Payment from "../../interfaces/Payment";
import { FeedbackContext } from "../../routes/appRouter";
import { invoke } from "@tauri-apps/api";
import ConfirmModal from "../../components/ConfirmModal";
import { Link, useParams } from "react-router-dom";

export default function PaginaPagamentos() {
    const { createFeedback, manageLoading } = useContext(FeedbackContext);
    const [data, setData] = useState<Payment[]>([]);
    const [toDelete, setToDelete] = useState<Payment>();
    const [modalExcluirAberto, setModalExcluirAberto] = useState(false);

    const {id, total, paid} = useParams();

    const abrirModalExcluir = (paym: Payment) => {
        setToDelete(paym);
        setModalExcluirAberto(true);
    }

    const fecharModalExcluir = () => {
        setToDelete(undefined);
        setModalExcluirAberto(false);
    }

    useLayoutEffect(() => {
        manageLoading(true)
    }, [])

    const fetchData = async (): Promise<void> => {

        try {
            let accountId = id;
            const p: Payment[] = await invoke('find_payments_by_id', {accountId});
            setData(p);
        } catch (e) {
            createFeedback(true, String(e))
        } finally {
            manageLoading(false);
        }

    };

    useEffect(() => {
        fetchData();
    }, []);

    const excluirPagamento = async () => {
        let id = toDelete?.id
        try {
            await invoke('delete_payment_by_id', { id })
            let newData = data;
            newData = newData.filter((r) =>
                r.id != id
            )
            setData(newData)
            fecharModalExcluir();
            createFeedback(false, "Pagamento excluído.")
        }
        catch (e) {
            createFeedback(true, String(e))
        }
    }

    return (
        <>
            {modalExcluirAberto && <ConfirmModal
                titulo="Tem certeza?"
                texto="Por favor, confirme que deseja prosseguir com a exclusão do pagamento clicando no botão abaixo."
                botaotexto="Sim, excluir."
                callbackConfirm={() => excluirPagamento()}
                callbackCancel={() => fecharModalExcluir()}
            />
            }
            {!modalExcluirAberto &&
                <>
                    <table className=" w-full ">
                        <thead className=" select-none bg-slate-400 font-semibold py-4 flex w-full text-sm ">
                            <tr className="flex w-full">
                                <td className="pl-5 text-slate-600 w-1/4 ">CRIADO EM</td>
                                <td className="pl-5 text-slate-600 w-1/4 ">VALOR</td>
                                <td className="pl-5 text-slate-600 w-1/4 ">TIPO</td>
                                <td className="pl-5 text-slate-600 w-1/4 "></td>
                            </tr>
                        </thead>
                        <tbody className=" text-slate-300  w-full table-auto flex flex-col ">

                            {data?.length < 1 && <tr className=" w-full bg-slate-800 p-4 text-2xl"><td colSpan={5}>Não foram encontrados registros.</td></tr>}

                            {data?.map((p) => {
                                return (
                                    <tr key={String(p.id)} className=" w-full flex justify-evenly bg-slate-800  odd:bg-slate-700">
                                        <td className=" font-semibold w-1/4 p-5 text-sm whitespace-nowrap ">
                                            {p.created_at.replaceAll("-", "/")}
                                        </td>
                                        <td className=" font-semibold w-1/4 p-5 text-sm whitespace-nowrap ">
                                            {`R$${p.amount.toFixed(2)}`}
                                        </td>
                                        <td className=" font-semibold w-1/4 p-5 text-sm whitespace-nowrap">
                                            {p.paymentType}
                                        </td>
                                        <td className=" text-center w-1/4 p-4  text-sm whitespace-nowrap">
                                            <button onClick={() => abrirModalExcluir(p)} className="ml-2 transition-all hover:bg-transparent hover:text-red-300 border border-red-300  bg-red-300 text-red-900 font-semibold px-2 py-1 rounded">Excluir</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody></table><div className=" justify-center p-2 flex ">
                        <Link to={`/contas/pagamentos/add/${id}/${total}/${paid}`}><button className=" transition-all hover:bg-transparent hover:text-cyan-300 border border-cyan-300  bg-cyan-300 text-cyan-900 font-semibold px-4 py-2 rounded text-lg">Criar novo produto</button></Link>
                    </div>
                </>
            }
        </>
    )
}