import { useContext, useEffect, useState } from "react";
import TableComponent from "../../components/table/tableComponent";
import { invoke } from "@tauri-apps/api";
import Log from "../../interfaces/Log";
import { FeedbackContext } from "../../routes/appRouter";
import { P } from "@tauri-apps/api/event-41a9edf5";

// export default interface Log {
//     id: string,
//     target_id: string,
//     operation_type: string,
//     action: string,
//     description: string,
//     created_at: string,
// }

export default function PaginaLogs() {

    const [logs, setLogs] = useState<Log[]>([])

    const { createFeedback, manageLoading } = useContext(FeedbackContext);

    const fetch = async () => {
        try {
            let data: Log[] = await invoke("get_logs", {})
            setLogs(data.reverse());
        } catch {
            createFeedback(true, "Erro ao encontrar logs.")
        } finally {
            manageLoading(false)
        }

    }

    useEffect(() => {
        manageLoading(true)
        fetch()
    }, [])

    return (
        <div className=" p-4">
            {logs.length > 0 &&
                logs?.map((log, i) => {
                    return (
                        <div className=" mb-2 h-fit w-full p-1 border rounded bg-slate-200">
                            <div className=" w-fit p-1 text-sm rounded-full bg-slate-400 text-slate-100">{log.operation_type}</div>
                                <p className=" my-1 text-xs text-slate-500">{log.description}</p> <p>{log.created_at}</p>
                        </div>
                    )
                })
            }
        </div>
    )
}