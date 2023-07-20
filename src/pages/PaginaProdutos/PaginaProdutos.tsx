import { invoke } from "@tauri-apps/api/tauri";
import { Dispatch, SetStateAction, useContext, useEffect, useLayoutEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Product from "../../interfaces/Product";
import ConfirmModal from "../../components/confirmModal/ConfirmModal";
import { FeedbackContext } from "../../routes/appRouter";
import ButtonComponentLink from "../../components/buttons/ButtonComponentLink";
import TableComponent from "../../components/table/tableComponent";

export default function PaginaProdutos({ data, setData }: { data: Product[], setData: Dispatch<SetStateAction<Product[]>> }) {

    const { createFeedback, manageLoading, fetchData } = useContext(FeedbackContext);
    const [toDelete, setToDelete] = useState<Product>();
    const [modalExcluirAberto, setModalExcluirAberto] = useState(false);

    const abrirModalExcluir = (prod: Product) => {
        setToDelete(prod);
        setModalExcluirAberto(true);
    }

    const fecharModalExcluir = () => {
        setToDelete(undefined);
        setModalExcluirAberto(false);
    }

    useLayoutEffect(() => {
        manageLoading(true)
    }, [])

    const fetch = async (): Promise<void> => {
        try {
            fetchData("product")
        } catch (e) {
            createFeedback(true, String(e))
        } finally {
            manageLoading(false);
        }

    };

    useEffect(() => {
        fetch();
    }, []);

    const excluirProduto = async () => {
        let id = toDelete?.id
        try {
            await invoke('delete_product_by_id', { id })
            let newData = data;
            newData = newData.filter((r) =>
                r.id != id
            )
            fecharModalExcluir();
            createFeedback(false, "Produto excluído.")
        }
        catch (e) {
            createFeedback(true, String(e))
        }
    }

    let navigate = useNavigate();

    const editarProduto = (p: Product) => {
        navigate(`/produtos/editar/${p.id}/${p.name}/${Number(String(p.price).replace("R$", ""))}`);
    }

    return (
        <>
            {modalExcluirAberto && <ConfirmModal
                titulo="Tem certeza?"
                texto="Por favor, confirme que deseja prosseguir com a exclusão do produto clicando no botão abaixo."
                botaotexto="Sim, excluir."
                callbackConfirm={() => excluirProduto()}
                callbackCancel={() => fecharModalExcluir()}
            />
            }
            {!modalExcluirAberto &&
                <>
                    <TableComponent<Product>
                        data={data}
                        formatDataMethod={(data) => {
                            return data.map((d) => ({
                                ...d,
                                price: `R$${Number(d.price).toFixed(2)}`
                            }))
                        }}
                        dataKeys={['created_at', 'name', 'price']}
                        header={['CRIADO EM', 'Produto', 'Preço', 'Ações']}
                        otherMethods={[editarProduto]}
                        otherMethodsText={['Editar']}
                        deleteMethod={abrirModalExcluir}
                    />
                    <div className=" justify-center p-2 flex ">
                        <ButtonComponentLink text={"Criar novo produto"} color={0} path={'/produtos/novo'} />
                    </div>
                </>
            }
        </>
    )
}