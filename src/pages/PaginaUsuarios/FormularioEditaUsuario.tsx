import { invoke } from "@tauri-apps/api";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { User } from "../../interfaces/User";
import { FeedbackContext } from "../../routes/appRouter";
import { ZodError, z } from 'zod'
import { validaCpf, validaNome, validaPhone } from "../../interfaces/ZodInputs";
import TextInput from "../../components/inputs/TextInput";
import ButtonComponentLink from "../../components/buttons/ButtonComponentLink";

export default function FormularioEditaUsuario() {

    const [username, setUsername] = useState('');
    const [cpf, setCpf] = useState('');
    const [phone, setPhone] = useState('');
    const [usernameErr, setInputUsernameErr] = useState('');
    const [cpfErr, setInputCpfErr] = useState('');
    const [phoneErr, setInputPhoneErr] = useState('');
    const { id, usernameParam, cpfParam, phoneParam } = useParams();
    const { createFeedback, manageLoading } = useContext(FeedbackContext);

    useEffect(() => {
        if (id && usernameParam && cpfParam && phoneParam) {
            setUsername(usernameParam);
            setCpf(cpfParam);
            setPhone(phoneParam);
        }
    }, [usernameParam, cpfParam, phoneParam]);


    const editaUsuario = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let validar_nome = validaNome(username);
        let validar_cpf = validaCpf(cpf);
        let validar_telefone = validaPhone(phone);

        if (validar_nome.success && validar_cpf.success && validar_telefone.success) {
            manageLoading(true);
            try {
                await invoke("edit_user", { id, username, cpf, phone });
                createFeedback(false, "Usuário editado.")
                window.location.href = '/usuarios';
            } catch (e) {
                createFeedback(true, String(e))
            } finally {
                manageLoading(false);
            }
        } else {
            if (!validar_nome.success) {
                setInputUsernameErr("Nome deve conter, ao menos, 3 caracteres.");
            }
            if (!validar_cpf.success) {
                setInputCpfErr("CPF precisa conter 11 caracteres.");
            }
            if (!validar_telefone.success) {
                setInputPhoneErr("Telefone precisa conter 10 - 11 caracteres, incluindo o prefixo. Exemplo: 19991233210.");
            }

        }

    }

    return (
        <div className=" h-full flex flex-col items-center justify-center">
            <h1 className=" text-3xl mb-4">Editar novo usuário</h1>
            <form onSubmit={e => editaUsuario(e)} className="flex flex-col w-96">
                <TextInput value={username} set={setUsername} name={"username"} id={"username"} label={"Nome do usuário"} err={usernameErr} />
                <TextInput value={cpf} set={setCpf} name={"cpf"} id={"cpf"} label={"Cadastro de pessoa física (CPF)"} err={cpfErr} />
                <TextInput value={phone} set={setPhone} name={"phone"} id={"phone"} label={"Telefone celular"} err={phoneErr} />
                <div className=" mt-4 flex items-center w-full justify-between">
                    <Link to={'/usuarios'}><p className=" dark:text-slate-400 underline cursor-pointer ml-2">Voltar</p></Link>
                    <ButtonComponentLink text={"Editar cliente"} color={0} />                </div>
            </form>
        </div>
    )
}