import { Dispatch, SetStateAction } from "react";

export default function PaymentTypeSelection({paymentType, setPaymentType}:{paymentType: number, setPaymentType: Dispatch<SetStateAction<number>>}) {

    return (
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
    )
}