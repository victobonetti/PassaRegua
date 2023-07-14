import { Dispatch, SetStateAction, useContext, useEffect, useLayoutEffect, useState } from "react";
import { FeedbackContext } from "../routes/appRouter";
import { relaunch } from '@tauri-apps/api/process';
import ButtonComponentLink from "../components/buttons/ButtonComponentLink";
import {
    checkUpdate,
    installUpdate
} from '@tauri-apps/api/updater'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { User } from "../interfaces/User";
import Account from "../interfaces/Account";
import { invoke } from "@tauri-apps/api";




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
        <div className="p-4">
            <h1 className="text-4xl w-full border-b p-2">Bem-vindo de volta!</h1>
            <div className=" h-72 ml-6 mt-4">
                <Pie
                    data={{
                        labels: ['Dividas', 'Valores pagos'],
                        datasets: [
                            {
                                label: 'Total: R$',
                                data: [paidValue, unpaidValue],
                                backgroundColor: ['#f87171', '#34d399']
                            },
                        ],
                    }}
                />
            </div>
        </div>
    );
}

