import { invoke } from "@tauri-apps/api";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FeedbackContext } from "../../routes/appRouter";
import { validaNome, validaPreco } from "../../interfaces/ZodInputs";
import NumberInput from "../../components/numberInput.tsx/NumberInput";
import TextInput from "../../components/inputs/TextInput";
import ButtonComponentLink from "../../components/buttons/ButtonComponentLink";

export default function FormularioEditaProduto() {

    const { createFeedback, manageLoading } = useContext(FeedbackContext);
    const [buttonDisabled, setButtonDisabled] = useState(false);


    const [name, setName] = useState('');
    const [getPrice, setPrice] = useState('0.00');
    const [nameErr, setNameErr] = useState('');
    const [priceErr, setPriceErr] = useState('');

    const { id, nameParam, priceParam } = useParams();

    useEffect(() => {
        console.log(nameParam)
        if (nameParam && priceParam) {
            setName(nameParam);
            setPrice(priceParam);
        }
    }, [nameParam, priceParam]);

    const history = useNavigate()


    const editaProduto = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        let validar_nome = validaNome(name);

        let validar_preco = validaPreco(getPrice);

        if (validar_nome.success && validar_preco.success) {

            setButtonDisabled(true);
            let newPrice = Number(getPrice);

            manageLoading(true);

            try {
                let newName = name;
                await invoke("edit_product_price", { id, newPrice });
                await invoke("edit_product_name", { id, newName });
                history('/');
                createFeedback(false, "Produto editado.");
            } catch (e) {
                manageLoading(false);
                createFeedback(true, String(e));
            }

        } else {

            if (!validar_nome.success) {
                setNameErr('Entrada inválida: Nome deve haver até, no máximo, 24 caractéres.');
            }

            if (!validar_preco.success) {
                setPriceErr('Número inválido.');
            }

        }

    }

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
            <form onSubmit={e => editaProduto(e)} className="flex flex-col w-96">
                <TextInput name={"Name"} id={"Name"} set={setName} err={nameErr} label={"Nome do produto"} />
                <label className="text-xs font-semibold dark:text-slate-400" htmlFor="">PREÇO</label>
                <div className=" rounded mt-2 items-center p-4  dark:bg-slate-600  text-4xl">R${getPrice}</div>
                <span className=" mb-2 text-xs text-red-500">{priceErr}</span>
                <NumberInput updateVal={updatePrice} clearVal={clearPrice} />
                <div className=" mt-4 flex items-center w-full justify-between">
                    <Link to={'/produtos'}><p className=" text-slate-400 underline cursor-pointer ml-2">Voltar</p></Link>
                    {!buttonDisabled && <ButtonComponentLink text={"Editar produto"} color={0} />}
                </div>
            </form>
        </div>
    )
}