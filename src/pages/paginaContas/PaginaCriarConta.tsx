import { invoke } from "@tauri-apps/api";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User } from "../../interfaces/User";
import { FeedbackContext } from "../../routes/appRouter";

export default function PaginaCriarConta() {

    const { createFeedback, manageLoading } = useContext(FeedbackContext);

    const [id, setId] = useState('')
    const [usuarios, setUsuarios] = useState<User[]>([]);

    useLayoutEffect(() => {
        manageLoading(true);
    }, [])

    const criaConta = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        manageLoading(true);
        try {
            let userId = id;
            await invoke("create_account", { userId });
            window.location.href = '/contas';
        } catch (e) {
            manageLoading(false);
            createFeedback(true, String(e))
        }
    }

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            manageLoading(true);
            try {
                const data: User[] = await invoke('find_all_users', {});
                setUsuarios(data);
            } catch (e) {
                createFeedback(true, String(e));
            } finally {
                manageLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <form className=" p-4 h-full flex flex-col items-center justify-center" onSubmit={e => criaConta(e)}>
            <h1 className=" text-3xl mb-4">Criar nova conta fiado</h1>
            <div className=" w-2/3 flex">
                <select id="countries" onChange={e => setId(e.target.value)} className=" text-lg w-3/4 bg-slate-50 border border-slate-300 text-slate-900 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500">
                    <option selected>Selecione um usuário</option>
                    {usuarios.map((u) => {
                        if (u.account_id == undefined) {
                            return (
                                <option key={String(u.id)} value={String(u.id)}>{u.username}</option>
                            )
                        }
                    })
                    }

                </select>
                <button type="submit" className=" ml-2 transition-all hover:bg-transparent hover:text-cyan-300 border border-cyan-300  bg-cyan-300 text-cyan-900 font-semibold px-4 py-2 rounded text-lg">Criar nova conta</button>
            </div>
            <Link to={'/contas'}><p className=" mt-2 text-slate-400 underline cursor-pointer ml-2">Voltar</p></Link>
        </form>
    )

}