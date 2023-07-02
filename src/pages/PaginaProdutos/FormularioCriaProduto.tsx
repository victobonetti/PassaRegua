import { invoke } from "@tauri-apps/api";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FeedbackContext } from "../../routes/appRouter";
import { validaNome, validaPreco } from "../../interfaces/ZodInputs";
import NumberInput from "../../components/numberInput.tsx/NumberInput";
import TextInput from "../../components/inputs/TextInput";
import ButtonComponentLink from "../../components/buttons/ButtonComponentLink";

export default function FormularioCriaProduto() {

    const { createFeedback, manageLoading } = useContext(FeedbackContext);


    const [name, setName] = useState('');
    const [getPrice, setPrice] = useState('0.00');
    const [nameErr, setNameErr] = useState('');
    const [priceErr, setPriceErr] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(false);


    const criaProduto = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        let validar_nome = validaNome(name);

        let validar_preco = validaPreco(getPrice);

        if (validar_nome.success && validar_preco.success) {

            setButtonDisabled(true);
            manageLoading(true);
            let price = Number(getPrice)
            try {
                await invoke("create_product", { name, price });
                window.location.href = '/produtos';
                createFeedback(false, "Produto criado.");
            } catch (e) {
                manageLoading(false);
                createFeedback(true, String(e));
            }
        }
        else {

            if (!validar_nome.success) {
                setNameErr('Entrada inválida: Nome deve haver até, no máximo, 24 caractéres.');
            }

        }


    }

    useEffect(() => {
        if (getPrice.length > 6) {
            setButtonDisabled(true);
            setPriceErr('Número inválido.')
        } else {
            setButtonDisabled(false);
            setPriceErr('')
        }
    }, [getPrice])

    const updatePrice = (n: number) => {


        let splitedPrice = getPrice.split('');
        splitedPrice.splice(getPrice.indexOf('.'), 1);

        let newPrice = splitedPrice.map((value, index) => {
            if (index == 0 && value == '0') {
                return;
            } else {
                return value;
            }
        });

        newPrice.push(String(n));

        newPrice.splice(newPrice.length - 2, 0, '.');

        if (newPrice) {
            setPrice(newPrice.join(''));
        }

    }

    const clearPrice = () => {
        setPrice('0.00');
    }

    return (
        <div className=" h-full flex flex-col items-center justify-center">
            <h1 className=" text-3xl mb-4">Criar novo produto</h1>
            <form onSubmit={e => criaProduto(e)} className="flex flex-col w-96">
                <TextInput name={"Name"} id={"Name"} set={setName} err={nameErr} label={"Nome do produto"} />
                <label className="text-xs font-semibold text-slate-400" htmlFor="">PREÇO</label>
                <div className=" rounded mt-2 items-center p-4  bg-slate-600  text-4xl">R${getPrice}</div>
                <span className=" mb-2 text-xs text-red-500">{priceErr}</span>
                <NumberInput updateVal={updatePrice} clearVal={clearPrice} />
                <div className=" mt-4 flex items-center w-full justify-between">
                    <Link to={'/produtos'}><p className=" text-slate-400 underline cursor-pointer ml-2">Voltar</p></Link>
                    {!buttonDisabled && <ButtonComponentLink text={"Criar produto"} color={0} />}

                </div>
            </form>
        </div>
    )
}