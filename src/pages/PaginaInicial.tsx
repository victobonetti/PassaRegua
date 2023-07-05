import { useContext, useEffect, useState } from "react";
import { FeedbackContext } from "../routes/appRouter";
import { relaunch } from '@tauri-apps/api/process';
import ButtonComponentLink from "../components/buttons/ButtonComponentLink";
import {
    checkUpdate,
    installUpdate
} from '@tauri-apps/api/updater'

export default function PaginaInicial() {
    const { createFeedback, manageLoading } = useContext(FeedbackContext);

    useEffect(() => {
        manageLoading(true);
    }, [])


    return (
        <div>
            <h1 className="text-4xl m-4">Bem-vindo de volta!</h1>
        </div>
    );
}

