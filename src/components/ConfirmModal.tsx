export default function ConfirmModal(titulo:string, texto:string, botaotexto:string, callbackConfirm:() => void, callbackCancel:() => void) {
    return (
        <div className=" flex flex-col items-center justify-center w-full h-full">
            <div className=" flex flex-col rounded p-8 bg-slate-300 w-1/2 m-8">
                <h2 className=" mb-2 text-2xl text-slate-700">{titulo}</h2>
                <p className=" text-justify text-sm font-semibold text-slate-600">{texto}</p>
                <div className=" flex justify-between items-end">
                    <p onClick={() => callbackCancel()} className=" cursor-pointer text-slate-500 underline">Cancelar</p>
                    <button onClick={() => callbackConfirm()} className=" mt-4 text-xl w-36 transition-all hover:bg-transparent hover:text-red-300 border border-red-300  bg-red-300 text-red-700 font-semibold p-2 rounded">{botaotexto}</button>
                </div>
            </div>
        </div>
    )
}