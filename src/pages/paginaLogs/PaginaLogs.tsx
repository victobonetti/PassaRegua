import { useContext, useEffect, useState } from "react";
import TableComponent from "../../components/table/tableComponent";
import { invoke } from "@tauri-apps/api";
import Log from "../../interfaces/Log";
import { FeedbackContext } from "../../routes/appRouter";

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
            console.log(data)
            setLogs(data);
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
        <>
            {logs &&
                <TableComponent< Log > data={logs} dataKeys={["target_id", "operation_type", "action", "description", "created_at"]} header={["Coluna alterada", "Tipo de operação", "Ação", "Descrição", "Data de criação."]} />
            }
        </>
    )
}