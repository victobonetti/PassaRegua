import { Dispatch, SetStateAction, useContext, useEffect, useLayoutEffect, useState } from "react";
import { FeedbackContext } from "../routes/appRouter";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import Account from "../interfaces/Account";
import { invoke } from "@tauri-apps/api";
import { Link } from "react-router-dom";
import regua from "../../src-tauri/icons/icon.ico"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";

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

    const incrementPayments = (p = 0, u = 0) => {

        let paid = p;
        let unpaid = u;

        data.map((ac) => {
            paid += Number(ac.paid_amount);
            unpaid += Number(ac.account_total - ac.paid_amount);
        });
        return {
            totalPayments: paid,
            totalUnpaid: unpaid
        }
    }

    useEffect(() => {
        let iterator = incrementPayments()
        setPaidValue(iterator.totalPayments);
        setUnpaidValue(iterator.totalUnpaid);
    }, [data])



    ChartJS.register(ArcElement, Tooltip, Legend);

    return (
        <div className=" p-4 bg-slate-800">
            { data.length > 0 &&
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
                        <div className="  w-1/2 h-4/5 border-r dark:border-slate-800 border-slate-300">
                            <div className=" h-full w-full flex flex-col justify-center items-center">
                                <h3>Total de dívidas em aberto</h3>
                                <span className=" mb-4 text-4xl text-red-400">R${unpaidValue.toFixed(2)}</span>
                                <h3>Total de pagamentos recebidos</h3>
                                <span className=" mb-4 text-4xl text-emerald-400">R${paidValue.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className=" flex flex-col items-center justify-center w-1/2 h-4/5 border-r dark:border-slate-800 border-slate-300">
                            <p className=" text-center text-6xl">{data.length}</p>
                            <p>Contas em aberto</p>
                            {
                                data.length == 1 && <FontAwesomeIcon className=" text-6xl mt-6 mx-1" icon={faUser} />
                            }

                            {
                                data.length == 2 && <div className=" flex"><FontAwesomeIcon className=" text-6xl mt-6 mx-1" icon={faUser} /><FontAwesomeIcon className=" text-6xl mt-6 mx-1" icon={faUser} /></div>
                            }

{
                                data.length > 2 && <div className=" flex "><FontAwesomeIcon className=" text-6xl mt-6 mx-1" icon={faUser} /><FontAwesomeIcon className=" text-6xl mt-6 mx-1" icon={faUser} /><FontAwesomeIcon className=" text-6xl mt-6 mx-1" icon={faUser} /></div>
                            }

                        </div>
                    </div>
                </div></>
            }
            {paidValue === 0 && unpaidValue === 0 && data.length === 0 &&
                <>
                    <div className="w-full  flex "><div className=" flex-col w-1/2">
                        <h1 className="text-3xl mb-8">Descubra o Passa<span className=" font-bold">Régua</span>:</h1>
                        <p className=" text-sm mb-4">Com apenas alguns cliques, você pode cadastrar pessoas e suas contas fiado. Essas contas fiado consistem em itens que representam produtos pré-registrados. Além disso, o PassaRégua permite que você faça pagamentos para reduzir o saldo pendente nas contas.</p>
                        <ul className=" text-sm list-disc ml-8 mb-8">
                            <li>Crie facilmente uma nova pessoa e atribua uma conta fiado.</li>
                            <li>Adicione itens à conta fiado, representando os produtos escolhidos.</li>
                            <li>Faça pagamentos na conta fiado para deduzir o saldo pendente.</li>
                            <li>Mantenha o controle e a transparência das transações.</li>
                        </ul>
                        <Link to={'/usuarios'} className="bg-emerald-500 hover:bg-emerald-600 text-emerald-50 font-bold py-2 px-4 rounded">Cadastrar pessoas</Link>
                    </div>

                        <div className=" flex flex-col w-1/2 items-center justify-center">
                            <img className="w-80 mt-12" src={regua} alt="regua" />
                        </div>

                    </div></>
            }
        </div>
    );
}

