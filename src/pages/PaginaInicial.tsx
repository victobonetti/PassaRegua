import { Dispatch, SetStateAction, useContext, useEffect, useLayoutEffect, useState } from "react";
import { FeedbackContext } from "../routes/appRouter";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import Account from "../interfaces/Account";
import { invoke } from "@tauri-apps/api";
import { Link } from "react-router-dom";



export default function PaginaInicial({ data, setData }: { data: Account[], setData: Dispatch<SetStateAction<Account[]>> }) {
    const { createFeedback, manageLoading } = useContext(FeedbackContext);
    const [paidValue, setPaidValue] = useState(0)
    const [unpaidValue, setUnpaidValue] = useState(0)

    const fetchData = async (): Promise<void> => {
        try {
            let all: Account[] = await invoke('find_all_accounts', {});
            if (all !== data) {
                setData(all);
            }
        } catch (e) {
            createFeedback(true, String(e))
        } finally {
            manageLoading(false);
        }
    };



    useLayoutEffect(() => {
        manageLoading(true);
        fetchData()
    }, [])

    useEffect(() => {
        let totalPayments = 0;
        let totalUnpaid = 0;
        data.map((ac) => {
            totalPayments += Number(ac.paid_amount);
            totalUnpaid += Number(ac.account_total - ac.paid_amount);
        });
        setPaidValue(totalPayments);
        setUnpaidValue(totalUnpaid);
    }, data)



    ChartJS.register(ArcElement, Tooltip, Legend);

    return (
        <div className=" p-4 ">
            {paidValue != 0 || unpaidValue != 0 &&
                <><h1 className="  text-4xl w-full border-b border-slate-300 dark:border-slate-700 p-2">Bem-vindo de volta!</h1><h2 className="font-bold m-4 dark:text-slate-400 text-slate-600">Dashboard</h2><div className=" h-80 flex justify-evenly items-center">
                    <div className=" h-72 ml-6 mt-4">
                        <Pie
                            data={{
                                labels: ['Dividas', 'Valores pagos'],
                                datasets: [
                                    {
                                        label: " R$",
                                        data: [unpaidValue, paidValue],
                                        borderWidth: 0,
                                        backgroundColor: ['#f87171', '#34d399'],
                                    },
                                ],
                            }}

                            options={{
                                plugins: {
                                    legend: {
                                        labels: {
                                            color: '#94a3b8'
                                        }
                                    },
                                }
                            }} />
                    </div>
                    <div className=" shadow-lg flex items-center justify-evenly h-72 w-2/3 bg-slate-200 border dark:bg-slate-700 dark:border-slate-800 border-slate-300 rounded">
                        <div className="  w-1/3 h-4/5 border-r dark:border-slate-800 border-slate-300">
                            <div className=" h-full w-full flex flex-col justify-center items-center">
                                <h3>Total de dívidas em aberto</h3>
                                <span className=" mb-4 text-4xl text-red-400">R${unpaidValue.toFixed(2)}</span>
                                <h3>Total de pagamentos recebidos</h3>
                                <span className=" mb-4 text-4xl text-emerald-400">R${paidValue.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="  w-1/3 h-4/5 border-r dark:border-slate-800 border-slate-300"></div>
                        <div className="  w-1/3 h-4/5          dark:border-slate-800 border-slate-300"></div>
                    </div>
                </div></>
            }
            {paidValue === 0 && unpaidValue === 0 &&

                <>
                    <div className="w-full  flex "><div className=" flex-col w-1/2">
                        <h1 className="text-3xl font-bold mb-8">Descubra o Frila<span className=" font-bold">Hub</span> - Simplificando o gerenciamento de colaboradores, contas fiado e pagamentos!</h1>
                        <p className="text-lg mb-4">Com apenas alguns cliques, você pode criar colaboradores e suas contas fiado. Essas contas fiado consistem em itens que representam produtos pré-registrados. Além disso, o FrilaHub permite que você faça pagamentos para reduzir o saldo pendente nas contas.</p>
                        <ul className="text-lg list-disc ml-8 mb-4">
                            <li>Crie facilmente um novo colaborador e atribua uma conta fiado.</li>
                            <li>Adicione itens à conta fiado, representando os produtos escolhidos.</li>
                            <li>Faça pagamentos na conta fiado para deduzir o saldo pendente.</li>
                            <li>Mantenha o controle e a transparência das transações.</li>
                        </ul>
                        <Link to={'/usuarios'} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Registrar meu primeiro colaborador</Link>
                    </div><div className=" flex-col w-1/2">
                        </div></div></>
            }
        </div>
    );
}

