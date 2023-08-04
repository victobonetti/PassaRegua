import { invoke } from "@tauri-apps/api";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FeedbackContext } from "../../routes/appRouter";
import { validaTexto } from "../../interfaces/ZodInputs";
import TextInput from "../../components/inputs/TextInput";
import ButtonComponentLink from "../../components/buttons/ButtonComponentLink";

export default function PaginaCriarNota() {

    // <Route path='/contas/items/note/:id/:itemId/:noteText'

    const { createFeedback, manageLoading } = useContext(FeedbackContext);
    const [err, setErr] = useState('');



    const { id, itemId, noteText } = useParams();
    const [note, setNote] = useState('');



    useEffect(() => {
        if (noteText) {
            setNote(noteText);
        }
    }, [])

    let navigate = useNavigate();

    const createNote = async () => {

        let valida = validaTexto(note)
        console.log(valida)

        if (valida.success) {
            try {
                manageLoading(true);
                await invoke('edit_item_note', { id: itemId, notes: note.trim() })
                navigate(`/contas/items/${id}`)
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
                <ButtonComponentLink text={"Anotar"} color={0} method={() => createNote()} />
                <Link to={`/contas/items/${id}`}><p className=" dark:text-slate-400 underline cursor-pointer text-center">Voltar</p></Link>
            </div>
        </div>
    )
}