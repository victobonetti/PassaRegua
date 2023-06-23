import { invoke } from "@tauri-apps/api";
import { useContext, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FeedbackContext } from "../../routes/appRouter";

export default function PaginaPagamentos() {

    const { createFeedback, manageLoading } = useContext(FeedbackContext);

    const [getValue, setValue] = useState('0.00');

    const { id } = useParams();

    const criaPagamento = async (e: React.FormEvent<HTMLFormElement>) => {
        manageLoading(true);
        e.preventDefault();
        let amount = Number(getValue)
        let accountId = String(id);
        console.log(accountId);
        try {
            await invoke("create_payment", { amount, accountId });
            window.location.href = '/contas';
        } catch (e) {
            manageLoading(false);
            createFeedback(true, String(e));
        }


    }

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
                <div className=" rounded mt-2 items-center p-4  bg-slate-400 text-4xl">R${getValue}</div>
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
                <div className=" mt-4 flex items-center w-full justify-between">
                    <Link to={'/contas'}><p className=" text-slate-400 underline cursor-pointer ml-2">Voltar</p></Link>
                    <button type="submit" className=" text-xl w-36 transition-all hover:bg-transparent hover:text-emerald-300 border border-emerald-300  bg-emerald-300 text-emerald-900 font-semibold p-2 rounded">Confirmar</button>
                </div>
            </form>
        </div>
    )
}