import { invoke } from "@tauri-apps/api";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FeedbackContext } from "../../routes/appRouter";

export default function PaginaCriaPagamentos() {

    const { createFeedback, manageLoading } = useContext(FeedbackContext);

    const [getValue, setValue] = useState('0.00');
    const [valueErr, setValueErr] = useState('');
    const [paymentType, setPaymentType] = useState(0);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const { id, total, paid } = useParams();

    const criaPagamento = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        let amount = Number(getValue)
        let accountId = String(id);

        if (Number(amount) <= (Number(total) - Number(paid))) {
            manageLoading(true);
            console.log(accountId);
            try {
                await invoke("create_payment", { amount, accountId, paymentType });
                window.location.href = '/contas';
                createFeedback(false, "Pagamento criado.");
            } catch (e) {
                manageLoading(false);
                createFeedback(true, String(e));
            }
        } else {
            createFeedback(true, "Valor do pagamento maior que valor da conta.")
        }
    }

    useEffect(() => {
        if (getValue.length > 7) {
            setButtonDisabled(true);
            setValueErr('Número inválido.')
        } else {
            setButtonDisabled(false);
            setValueErr('')
        }
    }, [getValue])

    const updatevalue = (n: number) => {

        let splitedvalue = getValue.split('');
        splitedvalue.splice(getValue.indexOf('.'), 1);

        let newvalue = splitedvalue.map((value, index) => {
            if (index == 0 && value == '0') {
                return;
            } else {
                return value;
            }
        });

        newvalue.push(String(n));

        newvalue.splice(newvalue.length - 2, 0, '.');

        if (newvalue) {
            setValue(newvalue.join(''));
        }

    }

    const clearvalue = () => {
        setValue('0.00');
    }

    return (
        <div className=" h-full flex flex-col items-center justify-center">
            <h1 className=" text-3xl mb-4">Criar novo pagamento</h1>
            <form onSubmit={e => criaPagamento(e)} className="flex flex-col w-96">
                <label className="text-xs font-semibold text-slate-400" htmlFor="">Valor</label>
                <div className=" rounded mt-2 items-center p-4  bg-slate-600 text-4xl">R${getValue}</div>
                <span className=" mb-2 text-xs text-red-500">{valueErr}</span>
                <div className=" self-center mt-4 w-48  bg-slate-950 rounded">
                    <div className=" flex ">
                        <div onClick={() => updatevalue(7)} className=" flex items-center justify-center text-lg text-emerald-900 font-semibold rounded cursor-pointer hover:scale-105 m-2 h-12 w-12 bg-emerald-300">7</div>
                        <div onClick={() => updatevalue(8)} className=" flex items-center justify-center text-lg text-emerald-900 font-semibold rounded cursor-pointer hover:scale-105 m-2 h-12 w-12 bg-emerald-300">8</div>
                        <div onClick={() => updatevalue(9)} className=" flex items-center justify-center text-lg text-emerald-900 font-semibold rounded cursor-pointer hover:scale-105 m-2 h-12 w-12 bg-emerald-300">9</div>
                    </div>
                    <div className=" flex ">
                        <div onClick={() => updatevalue(4)} className=" flex items-center justify-center text-lg text-emerald-900 font-semibold rounded cursor-pointer hover:scale-105 m-2 h-12 w-12 bg-emerald-300">4</div>
                        <div onClick={() => updatevalue(5)} className=" flex items-center justify-center text-lg text-emerald-900 font-semibold rounded cursor-pointer hover:scale-105 m-2 h-12 w-12 bg-emerald-300">5</div>
                        <div onClick={() => updatevalue(6)} className=" flex items-center justify-center text-lg text-emerald-900 font-semibold rounded cursor-pointer hover:scale-105 m-2 h-12 w-12 bg-emerald-300">6</div>
                    </div>
                    <div className=" flex ">
                        <div onClick={() => updatevalue(1)} className=" flex items-center justify-center text-lg text-emerald-900 font-semibold rounded cursor-pointer hover:scale-105 m-2 h-12 w-12 bg-emerald-300">1</div>
                        <div onClick={() => updatevalue(2)} className=" flex items-center justify-center text-lg text-emerald-900 font-semibold rounded cursor-pointer hover:scale-105 m-2 h-12 w-12 bg-emerald-300">2</div>
                        <div onClick={() => updatevalue(3)} className=" flex items-center justify-center text-lg text-emerald-900 font-semibold rounded cursor-pointer hover:scale-105 m-2 h-12 w-12 bg-emerald-300">3</div>
                    </div>
                    <div className="flex ">
                        <div onClick={() => updatevalue(0)} className=" flex items-center justify-center text-lg text-emerald-900 font-semibold rounded cursor-pointer hover:scale-105 m-2 h-12 w-12 bg-emerald-300">0</div>
                        <div onClick={clearvalue} className=" flex items-center justify-center text-lg text-emerald-900 font-semibold rounded cursor-pointer hover:scale-105 m-2 h-12 w-28 bg-slate-300">Limpar</div>
                    </div>


                </div>
                <div className=" my-4 p-4 ">
                    <h5 className=" text-center mb-2">Tipo de pagamento</h5>
                    <div className=" flex cursor-pointer justify-evenly">
                        <div onClick={() => setPaymentType(0)} className={` ${paymentType == 0 ? "scale-110 bg-yellow-400 text-yellow-950 font-bold" : "scale-90 bg-slate-200 text-slate-900"} cursor-pointer hover:bg-slate-100 hover:text-yellow-800 w-16 h-8 rounded text-xs flex items-center justify-center`}>Dinheiro</div>
                        <div onClick={() => setPaymentType(1)} className={` ${paymentType == 1 ? "scale-110 bg-yellow-400 text-yellow-950 font-bold" : "scale-90 bg-slate-200 text-slate-900"} cursor-pointer hover:bg-slate-100 hover:text-yellow-800 w-16 h-8 rounded text-xs flex items-center justify-center`}>Crédito</div>
                        <div onClick={() => setPaymentType(2)} className={` ${paymentType == 2 ? "scale-110 bg-yellow-400 text-yellow-950 font-bold" : "scale-90 bg-slate-200 text-slate-900"} cursor-pointer hover:bg-slate-100 hover:text-yellow-800 w-16 h-8 rounded text-xs flex items-center justify-center`}>Débito </div>
                        <div onClick={() => setPaymentType(3)} className={` ${paymentType == 3 ? "scale-110 bg-yellow-400 text-yellow-950 font-bold" : "scale-90 bg-slate-200 text-slate-900"} cursor-pointer hover:bg-slate-100 hover:text-yellow-800 w-16 h-8 rounded text-xs flex items-center justify-center`}>Pix    </div>
                        <div onClick={() => setPaymentType(4)} className={` ${paymentType == 4 ? "scale-110 bg-yellow-400 text-yellow-950 font-bold" : "scale-90 bg-slate-200 text-slate-900"} cursor-pointer hover:bg-slate-100 hover:text-yellow-800 w-16 h-8 rounded text-xs flex items-center justify-center`}>VR     </div>
                    </div>
                </div>
                <div className=" mt-4 flex items-center w-full justify-between">
                    <Link to={'/contas'}><p className=" text-slate-400 underline cursor-pointer ml-2">Voltar</p></Link>
                    {!buttonDisabled && <button type="submit" className=" text-xl w-36 transition-all hover:bg-transparent hover:text-emerald-300 border border-emerald-300  bg-emerald-300 text-emerald-900 font-semibold p-2 rounded">Confirmar</button>}
                    {buttonDisabled && <button disabled className=" opacity-50 text-xl w-36 transition-all hover:bg-transparent hover:text-emerald-300 border border-emerald-300  bg-emerald-300 text-emerald-900 font-semibold p-2 rounded">Confirmar</button>}
                </div>
            </form>
        </div>
    )
}