import { useContext, useEffect, useLayoutEffect, useState } from "react";
import Payment, { getType } from "../../interfaces/Payment";
import { FeedbackContext } from "../../routes/appRouter";
import { invoke } from "@tauri-apps/api";
import ConfirmModal from "../../components/confirmModal/ConfirmModal";
import { Link, useParams } from "react-router-dom";
import ButtonComponentLink from "../../components/buttons/ButtonComponentLink";
import TableComponent from "../../components/table/tableComponent";

export default function PaginaPagamentos() {
    const { createFeedback, manageLoading } = useContext(FeedbackContext);
    const [data, setData] = useState<Payment[]>([]);
    const [toDelete, setToDelete] = useState<Payment>();
    const [modalExcluirAberto, setModalExcluirAberto] = useState(false);

    const { id, total, paid } = useParams();

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
            const p: Payment[] = await invoke('find_payments_by_id', { accountId });
            console.log(p)
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
                    {data.length > 0 && <TableComponent<Payment>
                        data={data.map((d) => ({
                            ...d,
                            amount: `R$${Number(d.amount).toFixed(2)}`,
                            type: `${getType(Number(d.type))}`
                        }))}
                        dataKeys={['created_at', 'amount', 'type']}
                        header={['CRIADO EM', 'VALOR', 'Tipo', 'Ações']}
                        deleteMethod={abrirModalExcluir}
                    />}

                    <div className=" justify-center p-2 flex ">
                        <ButtonComponentLink text={"Criar novo pagamento"} color={1} path={`/contas/pagamentos/add/${id}/${total}/${paid}`} />
                    </div>
                </>
            }
        </>
    )
}