import { useContext } from "react";
import { FeedbackContext } from "../routes/appRouter";

export default function PaginaInicial() {
    const { createFeedback, manageLoading } = useContext(FeedbackContext);


    return (
        <div>
            <h1 className="text-4xl m-4">Bem-vindo de volta!</h1>
        </div>
    );
}
