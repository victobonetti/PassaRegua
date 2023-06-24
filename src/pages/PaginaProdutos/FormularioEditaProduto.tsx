import { invoke } from "@tauri-apps/api";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FeedbackContext } from "../../routes/appRouter";
import { validaNome, validaPreco } from "../../interfaces/ZodInputs";

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
                window.location.href = '/produtos';
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
                <label className=" border-none text-xs font-semibold text-slate-400" htmlFor="username">NOME</label>
                <input value={name} autoComplete="none" onChange={e => setName(e.target.value)} className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="" id="name" />
                <span className=" mb-2 text-xs text-red-500">{nameErr}</span>
                <label className="text-xs font-semibold text-slate-400" htmlFor="">PREÇO</label>
                <div className=" rounded mt-2 items-center p-4  bg-slate-400 text-4xl">R${getPrice}</div>
                <span className=" mb-2 text-xs text-red-500">{priceErr}</span>
                <div className=" self-center mt-4 w-48  bg-slate-950 rounded">
                    <div className=" flex ">
                        <div onClick={() => updatePrice(7)} className=" flex items-center justify-center text-lg text-yellow-900 font-semibold rounded cursor-pointer hover:scale-105 m-2 h-12 w-12 bg-yellow-300">7</div>
                        <div onClick={() => updatePrice(8)} className=" flex items-center justify-center text-lg text-yellow-900 font-semibold rounded cursor-pointer hover:scale-105 m-2 h-12 w-12 bg-yellow-300">8</div>
                        <div onClick={() => updatePrice(9)} className=" flex items-center justify-center text-lg text-yellow-900 font-semibold rounded cursor-pointer hover:scale-105 m-2 h-12 w-12 bg-yellow-300">9</div>
                    </div>
                    <div className=" flex ">
                        <div onClick={() => updatePrice(4)} className=" flex items-center justify-center text-lg text-yellow-900 font-semibold rounded cursor-pointer hover:scale-105 m-2 h-12 w-12 bg-yellow-300">4</div>
                        <div onClick={() => updatePrice(5)} className=" flex items-center justify-center text-lg text-yellow-900 font-semibold rounded cursor-pointer hover:scale-105 m-2 h-12 w-12 bg-yellow-300">5</div>
                        <div onClick={() => updatePrice(6)} className=" flex items-center justify-center text-lg text-yellow-900 font-semibold rounded cursor-pointer hover:scale-105 m-2 h-12 w-12 bg-yellow-300">6</div>
                    </div>
                    <div className=" flex ">
                        <div onClick={() => updatePrice(1)} className=" flex items-center justify-center text-lg text-yellow-900 font-semibold rounded cursor-pointer hover:scale-105 m-2 h-12 w-12 bg-yellow-300">1</div>
                        <div onClick={() => updatePrice(2)} className=" flex items-center justify-center text-lg text-yellow-900 font-semibold rounded cursor-pointer hover:scale-105 m-2 h-12 w-12 bg-yellow-300">2</div>
                        <div onClick={() => updatePrice(3)} className=" flex items-center justify-center text-lg text-yellow-900 font-semibold rounded cursor-pointer hover:scale-105 m-2 h-12 w-12 bg-yellow-300">3</div>
                    </div>
                    <div className="flex ">
                        <div onClick={() => updatePrice(0)} className=" flex items-center justify-center text-lg text-yellow-900 font-semibold rounded cursor-pointer hover:scale-105 m-2 h-12 w-12 bg-yellow-300">0</div>
                        <div onClick={clearPrice} className=" flex items-center justify-center text-lg text-yellow-900 font-semibold rounded cursor-pointer hover:scale-105 m-2 h-12 w-28 bg-slate-300">Limpar</div>
                    </div>


                </div>
                <div className=" mt-4 flex items-center w-full justify-between">
                    <Link to={'/produtos'}><p className=" text-slate-400 underline cursor-pointer ml-2">Voltar</p></Link>
                    {!buttonDisabled && <button type="submit" className=" text-xl w-36 transition-all hover:bg-transparent hover:text-emerald-300 border border-emerald-300  bg-emerald-300 text-emerald-700 font-semibold p-2 rounded">Confirmar</button>}
                    {buttonDisabled && <button disabled className=" opacity-50 text-xl w-36 transition-all hover:bg-transparent hover:text-emerald-300 border border-emerald-300  bg-emerald-300 text-emerald-700 font-semibold p-2 rounded">Confirmar</button>}
                </div>
            </form>
        </div>
    )
}