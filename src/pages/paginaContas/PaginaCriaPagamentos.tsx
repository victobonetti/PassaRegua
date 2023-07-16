import { invoke } from "@tauri-apps/api";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FeedbackContext } from "../../routes/appRouter";
import NumberInput from "../../components/numberInput.tsx/NumberInput";
import PaymentTypeSelection from "../../components/numberInput.tsx/paymentType/PaymentType";
import ButtonComponentLink from "../../components/buttons/ButtonComponentLink";

export default function PaginaCriaPagamentos() {

    const { createFeedback, manageLoading } = useContext(FeedbackContext);

    const [getValue, setValue] = useState('0.00');
    const [valueErr, setValueErr] = useState('');
    const [paymentType, setPaymentType] = useState(0);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const { id, total, paid } = useParams();

    let navigate = useNavigate();


    const criaPagamento = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        let amount = Number(getValue)
        let accountId = String(id);

        if (Number(amount) <= (Number(total) - Number(paid))) {
            manageLoading(true);
            console.log(accountId);
            try {
                await invoke("create_payment", { amount, accountId, paymentType });
                navigate('/contas');
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

    const updateValue = (n: number) => {

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

    const clearValue = () => {
        setValue('0.00');
    }

    return (
        <div className=" h-full flex flex-col items-center justify-center">
            <h1 className=" text-3xl mb-4">Criar novo pagamento</h1>
            <form onSubmit={e => criaPagamento(e)} className="flex flex-col w-96">
                <label className="text-xs font-semibold dark:text-slate-400" htmlFor="">Valor</label>
                <div className=" border border-slate-300 rounded mt-2 items-center p-4  dark:bg-slate-600 text-4xl">R${getValue}</div>
                <span className=" mb-2 text-xs text-red-500">{valueErr}</span>
                <NumberInput updateVal={updateValue} clearVal={clearValue} />
                <span onClick={() => setValue(Number(Number(total) - Number(paid)).toFixed(2))} className=" hover:scale-105 transition-all text-center cursor-pointer border rounded text-lg py-2 px-4 bg-blue-400 text-blue-50 mt-2 ">Inserir valor pendente &#40;{"R$" + Number(Number(total) - Number(paid)).toFixed(2)}&#41;</span>
                <PaymentTypeSelection paymentType={paymentType} setPaymentType={setPaymentType} />
                <div className=" mt-4 flex items-center w-full justify-between">
                    <Link to={'/contas'}><p className=" dark:text-slate-400 underline cursor-pointer ml-2">Voltar</p></Link>
                    {!buttonDisabled && <ButtonComponentLink text={"Criar pagamento"} color={1} />
                    }

                </div>
            </form>
        </div>
    )
}