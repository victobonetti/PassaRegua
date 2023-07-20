import { invoke } from "@tauri-apps/api";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FeedbackContext } from "../../routes/appRouter";
import { validaCpf, validaNome, validaPhone } from "../../interfaces/ZodInputs";
import TextInput from "../../components/inputs/TextInput";
import ButtonComponentLink from "../../components/buttons/ButtonComponentLink";

export default function FormularioCriaUsuario() {

    const [username, setUsername] = useState('');
    const [cpf, setCpf] = useState('');
    const [phone, setPhone] = useState('');
    const [usernameErr, setInputUsernameErr] = useState('');
    const [cpfErr, setInputCpfErr] = useState('');
    const [phoneErr, setInputPhoneErr] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const { createFeedback, manageLoading, fetchData } = useContext(FeedbackContext);

    const history = useNavigate()

    const criaUsuario = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();



        let validar_nome = validaNome(username);
        let validar_cpf = validaCpf(cpf);
        let validar_telefone = validaPhone(phone);

        if (validar_nome.success && validar_cpf.success && validar_telefone.success) {
            manageLoading(true);
            setButtonDisabled(true);
            try {
                await invoke("create_user", { username, cpf, phone });
                fetchData("user")
                history('/usuarios');
                createFeedback(false, "Usuário criado.")
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
            <h1 className=" text-3xl mb-4">Criar nova pessoa</h1>
            <form onSubmit={e => criaUsuario(e)} className="flex flex-col w-96">
                <TextInput value={username} set={setUsername} name={"username"} id={"username"} label={"Nome da pessoa"} err={usernameErr} />
                <TextInput value={cpf} set={setCpf} name={"cpf"} id={"cpf"} label={"Cadastro de pessoa física - CPF (Sem caracteres especiais, apenas números)"} err={cpfErr} />
                <TextInput value={phone} set={setPhone} name={"phone"} id={"phone"} label={"Telefone celular (Sem caracteres especiais, apenas números)"} err={phoneErr} />
                <div className=" mt-4 flex items-center w-full justify-between">
                    <Link to={'/usuarios'}><p className=" dark:text-slate-400 underline cursor-pointer ml-2">Voltar</p></Link>
                    {!buttonDisabled && <ButtonComponentLink text={"Criar pessoa"} color={0} />}
                </div>
            </form>
        </div>
    )
}