import { useContext, useEffect, useLayoutEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom";
import { invoke } from "@tauri-apps/api";
import Account from "../../interfaces/Account";
import { FeedbackContext } from "../../routes/appRouter";
import ConfirmModal from "../../components/confirmModal/ConfirmModal";
import ButtonComponentLink from "../../components/buttons/ButtonComponentLink";
import TableComponent from "../../components/table/tableComponent";
import Item from "../../interfaces/Item";

export default function PaginaItems() {

    const { createFeedback, manageLoading } = useContext(FeedbackContext);

    const { id } = useParams();

    const [account, setAccount] = useState<Account>();
    const [toDelete, setToDelete] = useState('');
    const [modalExcluirAberto, setModalExcluirAberto] = useState(false);

    useLayoutEffect(() => {
        manageLoading(true);
    }, [])

    const fetchData = async () => {
        let accountId = id;
        try {
            let data: Account = await invoke('find_account_by_id', { accountId })
            setAccount(data);
            console.log(data)
        } catch (e) {
            createFeedback(true, String(e))
        } finally {
            manageLoading(false);

        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    const deleteItem = async () => {
        manageLoading(true);
        try {
            await invoke('delete_item_by_id', { id: toDelete });
            setAccount(prevAccount => {
                if (!prevAccount) return prevAccount;
                const updatedItems = prevAccount.items.filter(item => item.id !== toDelete);
                return { ...prevAccount, items: updatedItems };
            });
            createFeedback(false, "Item deletado com sucesso");
            fecharModalExcluir();
        } catch (error) {
            createFeedback(true, String(error));
        } finally {
            manageLoading(false);
        }
    };

    const abrirModalExcluir = (c: Account | Item) => {
        if ('owner' in c) {
            setToDelete(c.id);
            setModalExcluirAberto(true);
        }

    }

    const fecharModalExcluir = () => {
        setToDelete('');
        setModalExcluirAberto(false);
    }

    const formatNote = (note: string | undefined) => {
        if (!note) {
            return ""
        } else {
            return note
        }
    }

    let navigate = useNavigate();

    const escreveNota = (data: Item | Account) => {
        if ('notes' in data) {
            const item = data as Item;
            navigate(`/contas/items/note/${data.account_id}/${data.id}/${data.notes}`);
        }
    }

    const editaPreco = (data: Item | Account) => {
        if ('notes' in data) {
            const item = data as Item;
            navigate(`/contas/items/price/${data.account_id}/${data.id}/${String(data.price).replace("R$", "")}/${data.quantity}`);
        }
    }


    return (

        <>
            {modalExcluirAberto && <ConfirmModal
                titulo="Tem certeza?"
                texto="Por favor, confirme que deseja prosseguir com a exclusão do item clicando no botão abaixo."
                botaotexto="Sim, excluir."
                callbackConfirm={() => deleteItem()}
                callbackCancel={() => fecharModalExcluir()}
            />
            }

            {!modalExcluirAberto &&
                <div className=" flex w-full h-full">
                    <div className="dark:bg-slate-900 w-3/4 h-full">
                        <h2 className=" my-2 w-full text-center text-xl font-semibold dark:text-slate-300">{account?.owner.toUpperCase()}</h2>
                        {account && <TableComponent<Item, Account>
                            data={account.items}
                            dataKeys={['created_at', 'name', 'quantity', 'price', 'notes']}
                            header={['CRIADO EM', 'produto', 'quantidade', 'preço', 'notas', 'Ações']}
                            deleteMethod={abrirModalExcluir}
                            otherMethods={[escreveNota, editaPreco]}
                            otherMethodsText={['Fazer anotação', 'Editar valor unitário']}
                            formatDataMethod={(data) => {
                                return data.map((i) => ({
                                    ...i,
                                    price: `R$${Number(i.price).toFixed(2)}`,
                                    notes: formatNote(i.notes),
                                }))
                            }}
                        />}

                    </div>
                    <div className=" border-l-8 dark:border-slate-950 dark:bg-slate-700 w-1/4 h-full flex flex-col  p-4">
                        <div className=" shadow-inner dark:bg-slate-800 p-4">
                            <div className=" w-40 flex justify-between mb-4">
                                <div>
                                    <p className=" dark:text-slate-300 text-sm ">Dívida:</p> <span className=" font-semibold text-red-400">R${account && Number(account.account_total - account.paid_amount).toFixed(2)}</span>
                                </div>

                                <div>
                                    <p className=" dark:text-slate-300 text-sm ">Valor pago:</p> <span className=" font-semibold text-emerald-400">R${account && Number(account.paid_amount).toFixed(2)}</span>
                                </div>
                            </div>
                            <p className=" border-t pt-2 dark:border-slate-500 mt-2 dark:text-slate-300 text-sm ">Total da conta:</p> <span className=" text-2xl font-semibold text-slate-400">R${account && Number(account.account_total).toFixed(2)}</span>
                        </div >
                        <div className=" justify-center p-2 flex ">
                            <ButtonComponentLink text={"Adicionar Item"} color={0} path={`/contas/items/add/${account?.id}`} />
                        </div>
                        <Link className=" w-full text-center" to={'/contas'}><p className=" mt-2 dark:text-slate-400 underline cursor-pointer ml-2">Voltar</p></Link>
                    </div >
                </div >
            }
        </>
    )
}