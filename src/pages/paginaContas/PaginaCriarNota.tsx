import { invoke } from "@tauri-apps/api";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FeedbackContext } from "../../routes/appRouter";
import { validaTexto } from "../../interfaces/ZodInputs";
import TextInput from "../../components/inputs/TextInput";

export default function PaginaCriarNota() {

    // <Route path='/contas/items/note/:id/:itemId/:noteText'

    const { createFeedback, manageLoading } = useContext(FeedbackContext);
    const [err, setErr] = useState('');


    useEffect(() => {
        if (noteText) {
            setNote(noteText);
        }
    }, [])

    const { id, itemId, noteText } = useParams();
    const [note, setNote] = useState('');
    const createNote = async () => {
        
        let valida = validaTexto(note)
        console.log(valida)

        if (valida.success) {
            try {
                manageLoading(true);
                await invoke('edit_item_note', { id: itemId, notes: note.trim() })
                window.location.href = `/contas/items/${id}`
                createFeedback(false, "Anotação criada.");
            } catch (e) {
                createFeedback(true, String(e));
            } finally {
                manageLoading(false);
            }
        } else {
            setErr("Texto inválido. Deve conter até 42 caracteres, e, ao menos, 6 caracteres.")
        }
    }

    return (
        <div className=" h-full w-full flex items-center justify-center">
            <div className=" w-1/3 flex flex-col">
                <TextInput name={"note"} id={"note"} set={setNote} err={err} label={"Editar anotação do produto"} />
                <button onClick={() => createNote()} className=" transition-all hover:bg-transparent hover:text-cyan-300 border border-cyan-300  bg-cyan-300 text-cyan-900 font-semibold px-4 py-2 rounded text-lg">Editar anotação.</button>
                <Link to={`/contas/items/${id}`}><p className=" text-slate-400 underline cursor-pointer text-center">Voltar</p></Link>
            </div>
        </div>
    )
}