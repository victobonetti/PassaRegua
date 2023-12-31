import { invoke } from "@tauri-apps/api/tauri";
import { Dispatch, SetStateAction, useContext, useEffect, useLayoutEffect, useState } from "react";
import { User } from "../../interfaces/User";
import { Link } from "react-router-dom";
import ConfirmModal from "../../components/confirmModal/ConfirmModal";
import { FeedbackContext } from "../../routes/appRouter";
import ButtonComponentLink from "../../components/buttons/ButtonComponentLink";
import TableComponent from "../../components/table/tableComponent";
import { useNavigate } from "react-router-dom";
import fetchService from "../../services/fetchService";

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
            fetchData();
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
        try{
            setData(await fetchService.fetchUsers());
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
        // useNavigate()(0)
        fetchData();
    }, []);


    const navigate = useNavigate();

    const editUser = (u: User) => {
        navigate(`/usuarios/editar/${u.id}/${u.username}/${u.cpf}/${u.phone}`);
    }

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
                <>
                    <TableComponent<User>
                        otherMethods={[editUser]}
                        otherMethodsText={['Editar']}
                        data={data}
                        dataKeys={['created_at', 'username', 'cpf', 'phone']}
                        header={['Criado em', 'Nome', 'CPF', 'Telefone', 'Ações']}
                        deleteMethod={abrirModalExcluir} />

                    <div className=" justify-center p-2 flex ">
                        <ButtonComponentLink text={"Criar nova pessoa"} color={0} path={"/usuarios/novo"} />
                    </div></>
            }

        </>

    )
}