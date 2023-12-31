import { invoke } from "@tauri-apps/api";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FeedbackContext } from "../../routes/appRouter";
import { validaNome, validaPreco } from "../../interfaces/ZodInputs";
import NumberInput from "../../components/numberInput.tsx/NumberInput";
import ButtonComponentLink from "../../components/buttons/ButtonComponentLink";

export default function FormularioEditaPreco() {

    const { createFeedback, manageLoading } = useContext(FeedbackContext);

    const { id, itemId, priceParam, quantityParam } = useParams();


    const [getPrice, setPrice] = useState('0.00');
    const [priceErr, setPriceErr] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(false);
    // <Route path='/contas/items/price/:id/:itemId/:priceParam/:quantityParam' element={< FormularioEditaPreco />} />


    const editaPreco = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        if (getPrice) {

            let validar_preco = validaPreco(getPrice);

            if (validar_preco.success) {

                setButtonDisabled(true);
                manageLoading(true);
                let price = Number(getPrice)
                try {
                    await invoke("edit_item_price", { id: itemId, price: price });
                    createFeedback(false, "Preço editado.");
                    navigate(`/contas/items/${id}`);

                } catch (e) {
                    manageLoading(false);
                    createFeedback(true, String(e));
                }
            }
        }

    }

    let navigate = useNavigate();

    useEffect(() => {
        if (priceParam) {
            setPrice(priceParam);
        } else {
            navigate(`/contas/items/${id}`);
            createFeedback(true, "Ocorreu um erro.");
        }
    }, []);


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
            <h1 className=" text-3xl mb-4">Editar preço</h1>
            <form onSubmit={e => editaPreco(e)} className="flex flex-col w-96">
                <label className="text-xs font-semibold text-slate-400" htmlFor="">PREÇO</label>
                <div  className=" border border-slate-300  rounded mt-2 items-center p-4  dark:bg-slate-400 text-4xl">R${getPrice}</div>
                <span className=" mb-2 text-xs text-red-500">{priceErr}</span>
                <NumberInput updateVal={updatePrice} clearVal={clearPrice} />
                <div className=" mt-4 flex items-center w-full justify-between">
                    <Link to={`/contas/items/${id}`}><p className=" text-slate-400 underline cursor-pointer ml-2">Voltar</p></Link>
                    {!buttonDisabled && <ButtonComponentLink text={"Editar preço"} color={1} />}
                </div>
            </form>
        </div>
    )
}