import { useContext } from "react";
import { FeedbackContext } from "../routes/appRouter";

export default function PaginaInicial() {
    const { createFeedback, manageLoading } = useContext(FeedbackContext);

    const handleGoodFeedback = () => {
        createFeedback(false, "Good feedback");
    };

    const handleBadFeedback = () => {
        createFeedback(true, "Bad feedback");
    };

    const handleLoading = () => {
        manageLoading(true);
        setTimeout(() => {
            manageLoading(false);
        }, 1000)
    }

    return (
        <div>
            <h1 className="text-4xl m-4">Bem-vindo de volta!</h1>
            <button onClick={handleGoodFeedback}>Good feedback</button>
            <button onClick={handleBadFeedback}>Bad feedback</button>
            <button onClick={handleLoading}>Loading </button>
        </div>
    );
}
